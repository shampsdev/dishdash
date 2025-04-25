package usecase

import (
	"dishdash.ru/pkg/repo/pg"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Setup(pool *pgxpool.Pool) Cases {
	placeRepo := pg.NewPlaceRepo(pool)
	tagRepo := pg.NewTagRepo(pool)
	collectionRepo := pg.NewCollectionRepo(pool, placeRepo)
	lobbyRepo := pg.NewLobbyRepo(pool)
	userRepo := pg.NewUserRepo(pool)
	swipeRepo := pg.NewSwipeRepo(pool)
	placeRecommenderRepo := pg.NewPlaceRecommenderRepo(pool)
	storyRepo := pg.NewStoryRepo(pool)

	placeCase := NewPlaceUseCase(tagRepo, placeRepo)
	lobbyCase := NewLobbyUseCase(lobbyRepo, userRepo, tagRepo, placeRepo, swipeRepo)
	swipeCase := NewSwipeUseCase(swipeRepo)
	userCase := NewUserUseCase(userRepo)
	collectionCase := NewCollectionUseCase(collectionRepo, placeRepo)
	placeRecommender := NewPlaceRecommender(
		placeRecommenderRepo,
		placeRepo,
		tagRepo,
	)
	storyCase := NewStoryUseCase(storyRepo)

	return Cases{
		Place:      placeCase,
		Tag:        NewTagUseCase(tagRepo),
		Lobby:      lobbyCase,
		User:       userCase,
		Swipe:      swipeCase,
		Collection: collectionCase,
		Story:      storyCase,
		RoomRepo:   NewInMemoryRoomRepo(lobbyCase, placeCase, swipeCase, userCase, placeRecommender),
	}
}
