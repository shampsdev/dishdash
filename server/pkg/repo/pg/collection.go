package pg

import (
	"context"
	"fmt"
	"math/rand/v2"
	"time"

	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/repo"
	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CollectionRepo struct {
	db   *pgxpool.Pool
	rand *rand.Rand
	pr   repo.Place
	psql sq.StatementBuilderType
}

func NewCollectionRepo(db *pgxpool.Pool, pr repo.Place) *CollectionRepo {
	return &CollectionRepo{
		db:   db,
		pr:   pr,
		rand: rand.New(rand.NewPCG(uint64(time.Now().UnixNano()), rand.Uint64())),
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *CollectionRepo) SaveCollection(ctx context.Context, collection *domain.AdminCreateCollection) (string, error) {
	sql, args, err := r.psql.Insert("collection").
		Columns("id", "type", "name", "description", "avatar", `"order"`, "visible", "owner_id").
		Values(r.generateID(), collection.Type, collection.Name, collection.Description, collection.Avatar, collection.Order, collection.Visible, collection.OwnerID).
		Suffix("RETURNING id").
		ToSql()
	if err != nil {
		return "", fmt.Errorf("failed to build sql: %w", err)
	}

	var id string
	err = r.db.QueryRow(ctx, sql, args...).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("failed to save collection: %w", err)
	}

	err = r.pr.AttachPlacesToCollection(ctx, collection.Places, id)
	if err != nil {
		return "", fmt.Errorf("failed to attach places to collection: %w", err)
	}

	return id, nil
}

func (r *CollectionRepo) PatchCollection(ctx context.Context, collection *domain.AdminPatchCollection) error {
	s := r.psql.Update("collection").
		Where(sq.Eq{"id": collection.ID})

	if collection.Type != nil {
		s = s.Set("type", *collection.Type)
	}
	if collection.Name != nil {
		s = s.Set("name", *collection.Name)
	}
	if collection.Description != nil {
		s = s.Set("description", *collection.Description)
	}
	if collection.Avatar != nil {
		s = s.Set("avatar", *collection.Avatar)
	}
	if collection.Order != nil {
		s = s.Set(`"order"`, *collection.Order)
	}
	if collection.Visible != nil {
		s = s.Set("visible", *collection.Visible)
	}
	if collection.OwnerID != nil {
		s = s.Set("owner_id", *collection.OwnerID)
	}

	sql, args, err := s.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build sql: %w", err)
	}

	_, err = r.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to patch collection: %w", err)
	}

	if collection.Places != nil {
		err = r.pr.DetachAllPlacesFromCollection(ctx, collection.ID)
		if err != nil {
			return fmt.Errorf("failed to detach all places from collection: %w", err)
		}

		err = r.pr.AttachPlacesToCollection(ctx, collection.Places, collection.ID)
		if err != nil {
			return fmt.Errorf("failed to attach places to collection: %w", err)
		}
	}

	return nil
}

func (r *CollectionRepo) DeleteCollection(ctx context.Context, id string) error {
	sql, args, err := r.psql.Delete("collection").
		Where(sq.Eq{"id": id}).
		ToSql()
	if err != nil {
		return fmt.Errorf("failed to build sql: %w", err)
	}

	_, err = r.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to delete collection: %w", err)
	}

	return nil
}

func (r *CollectionRepo) GetCollectionByID(ctx context.Context, id string) (*domain.AdminCollection, error) {
	sql, args, err := r.selectBuilder().
		Where(sq.Eq{"id": id}).
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build sql: %w", err)
	}

	var collection *domain.AdminCollection
	collection, err = r.scanCollection(r.db.QueryRow(ctx, sql, args...))
	if err != nil {
		return nil, fmt.Errorf("failed to scan collection: %w", err)
	}

	return collection, nil
}

func (r *CollectionRepo) FilterCollections(ctx context.Context, filter domain.AdminCollectionFilter) ([]*domain.AdminCollection, error) {
	s := r.selectBuilder()

	if filter.Search != "" {
		s = s.Where(sq.Or{
			sq.ILike{"name": "%" + filter.Search + "%"},
			sq.ILike{"description": "%" + filter.Search + "%"},
		})
	}
	if filter.Types != nil {
		s = s.Where(sq.Eq{"type": filter.Types})
	}
	if filter.Visible != nil {
		s = s.Where(sq.Eq{"visible": *filter.Visible})
	}
	if filter.OwnerID != nil {
		s = s.Where(sq.Eq{"owner_id": *filter.OwnerID})
	}

	sql, args, err := s.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build sql: %w", err)
	}

	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to filter collections: %w", err)
	}
	defer rows.Close()
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to filter collections: %w", err)
	}

	collections := []*domain.AdminCollection{}
	for rows.Next() {
		collection, err := r.scanCollection(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan collection: %w", err)
		}
		collections = append(collections, collection)
	}
	return collections, nil
}

func (r *CollectionRepo) selectBuilder() sq.SelectBuilder {
	return r.psql.Select(
		"id",
		"type",
		"name",
		"description",
		"avatar",
		`"order"`,
		"visible",
		"owner_id",
		"created_at",
		"updated_at",
	).From("collection")
}

func (r *CollectionRepo) scanCollection(scanner interface {
	Scan(dest ...any) error
},
) (*domain.AdminCollection, error) {
	var collection domain.AdminCollection
	collection.Places = []*domain.Place{}
	err := scanner.Scan(
		&collection.ID,
		&collection.Type,
		&collection.Name,
		&collection.Description,
		&collection.Avatar,
		&collection.Order,
		&collection.Visible,
		&collection.OwnerID,
		&collection.CreatedAt,
		&collection.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to scan collection: %w", err)
	}
	return &collection, nil
}

func (lr *CollectionRepo) generateID() string {
	b := make([]rune, 10)
	for i := range b {
		b[i] = letterRunes[lr.rand.IntN(len(letterRunes))]
	}
	return string(b)
}
