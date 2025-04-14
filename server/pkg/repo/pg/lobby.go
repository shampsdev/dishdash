package pg

import (
	"context"
	"fmt"
	"math/rand/v2"
	"time"

	"dishdash.ru/pkg/domain"

	"github.com/jackc/pgx/v5/pgxpool"
)

type LobbyRepo struct {
	db   *pgxpool.Pool
	rand *rand.Rand
}

func NewLobbyRepo(db *pgxpool.Pool) *LobbyRepo {
	return &LobbyRepo{
		db:   db,
		rand: rand.New(rand.NewPCG(uint64(time.Now().UnixNano()), rand.Uint64())),
	}
}

func (lr *LobbyRepo) SaveLobby(ctx context.Context, lobby *domain.Lobby) (string, error) {
	const saveQuery = `
		INSERT INTO "lobby" (id, state, type, settings, created_at)
		VALUES ($1, $2, $3, $4, $5)
`

	lobby.ID = lr.generateID()
	lobby.CreatedAt = time.Now().UTC()
	_, err := lr.db.Exec(ctx, saveQuery,
		lobby.ID,
		lobby.State,
		lobby.Type,
		lobby.Settings,
		lobby.CreatedAt,
	)
	if err != nil {
		return "", fmt.Errorf("can't save lobby: %w", err)
	}
	return lobby.ID, nil
}

func (lr *LobbyRepo) DeleteLobbyByID(ctx context.Context, id string) error {
	const deleteQuery = `
		DELETE FROM "lobby" WHERE id = $1
`
	_, err := lr.db.Exec(ctx, deleteQuery, id)
	if err != nil {
		return fmt.Errorf("can't delete lobby: %w", err)
	}
	return nil
}

func (lr *LobbyRepo) GetLobbyByID(ctx context.Context, id string) (*domain.Lobby, error) {
	const getQuery = `
		SELECT id, state, type, settings, created_at
		FROM "lobby" WHERE id = $1
`
	row := lr.db.QueryRow(ctx, getQuery, id)

	lobby := &domain.Lobby{}
	err := row.Scan(
		&lobby.ID,
		&lobby.State,
		&lobby.Type,
		&lobby.Settings,
		&lobby.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("can't get lobby: %w", err)
	}
	return lobby, nil
}

func (lr *LobbyRepo) SetLobbySettings(ctx context.Context, lobbyID string, settings domain.LobbySettings) error {
	const query = `
		UPDATE lobby SET type = $1, settings = $2
		WHERE id = $3
`
	_, err := lr.db.Exec(ctx, query,
		settings.Type,
		settings,
		lobbyID,
	)
	if err != nil {
		return fmt.Errorf("can't update lobby: %w", err)
	}
	return nil
}

func (lr *LobbyRepo) SetLobbyState(ctx context.Context, lobbyID string, state domain.LobbyState) error {
	const query = `
		UPDATE lobby SET state = $1
		WHERE id = $2
`
	_, err := lr.db.Exec(ctx, query, state, lobbyID)
	if err != nil {
		return fmt.Errorf("can't update lobby state: %w", err)
	}
	return nil
}

func (lr *LobbyRepo) GetLatestLobbiesForUser(ctx context.Context, userID string, amount int) ([]*domain.Lobby, error) {
	const query = `
	WITH user_lobbies AS (
		SELECT DISTINCT lobby_id 
		FROM lobby_user
		WHERE user_id = $1
	)
	SELECT 
		l.id, 
		l.created_at, 
		l.settings,
		JSON_AGG(
		JSON_BUILD_OBJECT(
			'id', lu_all.user_id,
			'name', u.name,
			'avatar', u.avatar
		)
		) AS users
	FROM user_lobbies ul
	JOIN lobby l ON ul.lobby_id = l.id
	JOIN lobby_user lu_all ON l.id = lu_all.lobby_id
	JOIN "user" u ON lu_all.user_id = u.id
	GROUP BY l.id, l.created_at, l.settings
	ORDER BY l.created_at DESC
	LIMIT $2;
	`

	rows, err := lr.db.Query(ctx, query, userID, amount)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest lobbies: %w", err)
	}
	defer rows.Close()

	lobbies := make([]*domain.Lobby, 0, amount)
	for rows.Next() {
		lobby := &domain.Lobby{}
		err := rows.Scan(
			&lobby.ID,
			&lobby.CreatedAt,
			&lobby.Settings,
			&lobby.Users,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan lobby: %w", err)
		}
		lobbies = append(lobbies, lobby)
	}
	return lobbies, nil
}

var letterRunes = []rune("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")

func (lr *LobbyRepo) generateID() string {
	b := make([]rune, 5)
	for i := range b {
		b[i] = letterRunes[lr.rand.IntN(len(letterRunes))]
	}
	return string(b)
}
