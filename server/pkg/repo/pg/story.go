package pg

import (
	"context"
	"fmt"

	"dishdash.ru/pkg/domain"
	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5/pgxpool"
)

type StoryRepo struct {
	db   *pgxpool.Pool
	psql sq.StatementBuilderType
}

func NewStoryRepo(db *pgxpool.Pool) *StoryRepo {
	return &StoryRepo{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *StoryRepo) SaveStory(ctx context.Context, story *domain.Story) (string, error) {
	q := r.psql.Insert("story").
		Columns("title", "icon", "src", "visible", "stories").
		Values(story.Title, story.Icon, story.Src, story.Visible, story.Stories).
		Suffix("RETURNING id")
	id := ""
	sql, args, err := q.ToSql()
	if err != nil {
		return "", fmt.Errorf("failed to build query: %w", err)
	}
	err = r.db.QueryRow(ctx, sql, args...).Scan(&id)
	return id, err
}

func (r *StoryRepo) PatchStory(ctx context.Context, story *domain.StoryPatch) error {
	s := r.psql.Update("story").Where(sq.Eq{"id": story.ID})

	if story.Title != nil {
		s = s.Set("title", *story.Title)
	}
	if story.Icon != nil {
		s = s.Set("icon", *story.Icon)
	}
	if story.Src != nil {
		s = s.Set("src", *story.Src)
	}
	if story.Visible != nil {
		s = s.Set("visible", *story.Visible)
	}
	sql, args, err := s.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}
	_, err = r.db.Exec(ctx, sql, args...)
	return err
}

func (r *StoryRepo) GetStoryByID(ctx context.Context, id string) (*domain.Story, error) {
	q := r.selectBuilder().Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}
	row := r.db.QueryRow(ctx, sql, args...)
	return r.scanStory(row)
}

func (r *StoryRepo) DeleteStoryByID(ctx context.Context, id string) error {
	q := r.psql.Delete("story").Where(sq.Eq{"id": id})
	sql, args, err := q.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}
	_, err = r.db.Exec(ctx, sql, args...)
	return err
}

func (r *StoryRepo) FilterStories(ctx context.Context, filter domain.StoryFilter) ([]*domain.Story, error) {
	s := r.selectBuilder()
	if filter.Title != "" {
		s = s.Where(sq.ILike{"title": "%" + filter.Title + "%"})
	}
	if filter.Visible != nil {
		s = s.Where(sq.Eq{"visible": *filter.Visible})
	}
	sql, args, err := s.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}
	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	var stories []*domain.Story
	for rows.Next() {
		story, err := r.scanStory(rows)
		if err != nil {
			return nil, err
		}
		stories = append(stories, story)
	}
	return stories, nil
}

func (r *StoryRepo) selectBuilder() sq.SelectBuilder {
	return r.psql.Select("id", "title", "icon", "src", "visible", "stories", "created_at").From("story")
}

func (r *StoryRepo) scanStory(scanner interface {
	Scan(dest ...any) error
},
) (*domain.Story, error) {
	var story domain.Story
	err := scanner.Scan(
		&story.ID,
		&story.Title,
		&story.Icon,
		&story.Src,
		&story.Visible,
		&story.Stories,
		&story.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to scan story: %w", err)
	}
	return &story, err
}
