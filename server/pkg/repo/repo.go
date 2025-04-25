package repo

import (
	"context"

	"dishdash.ru/pkg/domain"
)

type Tag interface {
	SaveTag(ctx context.Context, tag *domain.Tag) (int64, error)
	GetAllTags(ctx context.Context) ([]*domain.Tag, error)

	DeleteTag(ctx context.Context, tagId int64) error
	UpdateTag(ctx context.Context, tag *domain.Tag) (*domain.Tag, error)

	AttachTagsToPlace(ctx context.Context, tagIDs []int64, placeID int64) error
	DetachTagsFromPlace(ctx context.Context, placeID int64) error
	GetTagsByPlaceID(ctx context.Context, placeID int64) ([]*domain.Tag, error)

	AttachTagsToLobby(ctx context.Context, tagIDs []int64, lobbyID string) error
	DetachTagsFromLobby(ctx context.Context, lobbyID string) error
	GetTagsByLobbyID(ctx context.Context, lobbyID string) ([]*domain.Tag, error)
}

type Place interface {
	SavePlace(ctx context.Context, place *domain.Place) (int64, error)
	UpdatePlace(ctx context.Context, place *domain.Place) error
	DeletePlace(ctx context.Context, id int64) error
	GetPlaceByID(ctx context.Context, id int64) (*domain.Place, error)
	GetPlaceByUrl(ctx context.Context, url string) (*domain.Place, error)
	GetAllPlaces(ctx context.Context) ([]*domain.Place, error)
	FilterPlaces(ctx context.Context, query PlacesFilter) ([]*domain.Place, error)

	DetachPlacesFromLobby(ctx context.Context, lobbyID string) error
	AttachOrderedPlacesToLobby(ctx context.Context, placeIDs []int64, lobbyID string) error
	GetOrderedPlacesByLobbyID(ctx context.Context, lobbyID string) ([]*domain.Place, error)

	GetPlacesByCollection(ctx context.Context, collectionID string) ([]*domain.Place, error)
	AttachPlacesToCollection(ctx context.Context, placeIDs []int64, collectionID string) error
	DetachAllPlacesFromCollection(ctx context.Context, collectionID string) error
	DetachPlaceFromCollection(ctx context.Context, placeID int64, collectionID string) error
}

type PlacesFilter struct {
	Search string
	Tags   []string
}

type PlaceRecommender interface {
	RecommendClassicPlaces(ctx context.Context, s domain.ClassicPlacesSettings) ([]*domain.Place, error)
}

type User interface {
	SaveUser(ctx context.Context, user *domain.User) (string, error)
	SaveUserWithID(ctx context.Context, user *domain.User, id string) error
	UpdateUser(ctx context.Context, user *domain.User) (*domain.User, error)
	GetUserByID(ctx context.Context, id string) (*domain.User, error)
	GetUserByTelegram(ctx context.Context, telegram int64) (*domain.User, error)
	GetAllUsers(ctx context.Context) ([]*domain.User, error)

	AttachUsersToLobby(ctx context.Context, userID []string, lobbyID string) error
	DetachUsersFromLobby(ctx context.Context, lobbyID string) error
	GetUsersByLobbyID(ctx context.Context, lobbyID string) ([]*domain.User, error)
}

type Lobby interface {
	SaveLobby(ctx context.Context, lobby *domain.Lobby) (string, error)
	DeleteLobbyByID(ctx context.Context, id string) error
	GetLobbyByID(ctx context.Context, id string) (*domain.Lobby, error)

	SetLobbySettings(ctx context.Context, lobbyID string, settings domain.LobbySettings) error
	SetLobbyState(ctx context.Context, lobbyID string, state domain.LobbyState) error

	GetLatestLobbiesForUser(ctx context.Context, userID string, amount int) ([]*domain.Lobby, error)
}

type Swipe interface {
	SaveSwipe(ctx context.Context, swipe *domain.Swipe) error
	GetSwipesCount(ctx context.Context) (int, error)
	GetSwipesByLobbyID(ctx context.Context, lobbyID string) ([]*domain.Swipe, error)
}

type Collection interface {
	SaveCollection(ctx context.Context, collection *domain.AdminCreateCollection) (string, error)
	PatchCollection(ctx context.Context, collection *domain.AdminPatchCollection) error
	DeleteCollection(ctx context.Context, id string) error
	GetCollectionByID(ctx context.Context, id string) (*domain.AdminCollection, error)
	FilterCollections(ctx context.Context, filter domain.AdminCollectionFilter) ([]*domain.AdminCollection, error)
}

type Story interface {
	SaveStory(ctx context.Context, story *domain.Story) (string, error)
	PatchStory(ctx context.Context, story *domain.StoryPatch) error
	GetStoryByID(ctx context.Context, id string) (*domain.Story, error)
	DeleteStoryByID(ctx context.Context, id string) error
	FilterStories(ctx context.Context, filter domain.StoryFilter) ([]*domain.Story, error)
}
