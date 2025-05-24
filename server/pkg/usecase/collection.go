package usecase

import (
	"context"
	"fmt"

	"dishdash.ru/pkg/algo"
	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/repo"
)

type CollectionUseCase struct {
	cRepo repo.Collection
	pRepo repo.Place
}

func NewCollectionUseCase(cRepo repo.Collection, pRepo repo.Place) *CollectionUseCase {
	return &CollectionUseCase{cRepo: cRepo, pRepo: pRepo}
}

func (c *CollectionUseCase) GetFavorites(ctx context.Context, actorID string) (*domain.Collection, error) {
	favorites, err := c.getOrCreateFavorites(ctx, actorID)
	if err != nil {
		return nil, fmt.Errorf("could not get favorites: %w", err)
	}
	favorites.Places, err = c.pRepo.GetPlacesByCollection(ctx, favorites.ID)
	if err != nil {
		return nil, fmt.Errorf("could not get places: %w", err)
	}

	return &favorites.Collection, nil
}

func (c *CollectionUseCase) getOrCreateFavorites(ctx context.Context, actorID string) (*domain.AdminCollection, error) {
	filter := domain.AdminCollectionFilter{
		CollectionFilter: domain.CollectionFilter{
			Types: []domain.CollectionType{domain.CollectionTypeFavorites},
		},
		OwnerID: ptrTo(actorID),
	}
	collections, err := c.cRepo.FilterCollections(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("could not get collections: %w", err)
	}

	if len(collections) == 0 {
		id, err := c.createFavorites(ctx, actorID)
		if err != nil {
			return nil, fmt.Errorf("could not create favorites: %w", err)
		}
		return c.cRepo.GetCollectionByID(ctx, id)
	}
	return collections[0], nil
}

func (c *CollectionUseCase) createFavorites(ctx context.Context, actorID string) (string, error) {
	collection := &domain.AdminCreateCollection{
		CreateCollection: domain.CreateCollection{
			Type: domain.CollectionTypeFavorites,
			Name: "Избранное",
		},
		Visible: false,
		OwnerID: actorID,
	}
	return c.cRepo.SaveCollection(ctx, collection)
}

func (c *CollectionUseCase) AddPlaceToFavorites(ctx context.Context, actorID string, placeID int64) error {
	favorites, err := c.getOrCreateFavorites(ctx, actorID)
	if err != nil {
		return fmt.Errorf("could not get favorites: %w", err)
	}

	err = c.pRepo.AttachPlacesToCollection(ctx, []int64{placeID}, favorites.ID)
	if err != nil {
		return fmt.Errorf("could not add place to favorites: %w", err)
	}

	return nil
}

func (c *CollectionUseCase) RemovePlaceFromFavorites(ctx context.Context, actorID string, placeID int64) error {
	favorites, err := c.getOrCreateFavorites(ctx, actorID)
	if err != nil {
		return fmt.Errorf("could not get favorites: %w", err)
	}

	err = c.pRepo.DetachPlaceFromCollection(ctx, placeID, favorites.ID)
	if err != nil {
		return fmt.Errorf("could not remove place from favorites: %w", err)
	}

	return nil
}

func (c *CollectionUseCase) GetCollectionByID(ctx context.Context, _, id string) (*domain.Collection, error) {
	collection, err := c.cRepo.GetCollectionByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("could not get collection: %w", err)
	}

	collection.Places, err = c.pRepo.GetPlacesByCollection(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("could not get places: %w", err)
	}

	return &collection.Collection, nil
}

func (c *CollectionUseCase) GetVisibleCollections(ctx context.Context, _ string) ([]*domain.Collection, error) {
	collections, err := c.cRepo.FilterCollections(ctx, domain.AdminCollectionFilter{
		Visible: ptrTo(true),
	})
	if err != nil {
		return nil, fmt.Errorf("could not get collections: %w", err)
	}

	return algo.Map(collections, func(c *domain.AdminCollection) *domain.Collection { return &c.Collection }), nil
}

func (c *CollectionUseCase) AdminSaveCollection(ctx context.Context, collection *domain.AdminCreateCollection) (*domain.AdminCollection, error) {
	id, err := c.cRepo.SaveCollection(ctx, collection)
	if err != nil {
		return nil, fmt.Errorf("could not save collection: %w", err)
	}

	return c.cRepo.GetCollectionByID(ctx, id)
}

func (c *CollectionUseCase) AdminGetCollectionByID(ctx context.Context, id string) (*domain.AdminCollection, error) {
	collection, err := c.cRepo.GetCollectionByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("could not get collection: %w", err)
	}

	collection.Places, err = c.pRepo.GetPlacesByCollection(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("could not get places: %w", err)
	}

	return collection, nil
}

func (c *CollectionUseCase) AdminPatchCollection(ctx context.Context, collection *domain.AdminPatchCollection) (*domain.AdminCollection, error) {
	err := c.cRepo.PatchCollection(ctx, collection)
	if err != nil {
		return nil, fmt.Errorf("could not patch collection: %w", err)
	}

	return c.cRepo.GetCollectionByID(ctx, collection.ID)
}

func (c *CollectionUseCase) AdminFilterCollections(ctx context.Context, filter domain.AdminCollectionFilter) ([]*domain.AdminCollection, error) {
	return c.cRepo.FilterCollections(ctx, filter)
}

func (c *CollectionUseCase) AdminDeleteCollection(ctx context.Context, id string) error {
	return c.cRepo.DeleteCollection(ctx, id)
}

func ptrTo[T any](v T) *T {
	return &v
}
