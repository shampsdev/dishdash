package usecase

import (
	"context"
	"errors"
	"fmt"

	"dishdash.ru/cmd/server/config"
	"dishdash.ru/pkg/algo"
	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/geo"
	"dishdash.ru/pkg/repo"
	log "github.com/sirupsen/logrus"
)

type PlaceRecommender struct {
	dbPRRepo repo.PlaceRecommender

	pRepo repo.Place
	tRepo repo.Tag
}

func NewPlaceRecommender(
	dbPRRepo repo.PlaceRecommender,
	pRepo repo.Place,
	tRepo repo.Tag,
) *PlaceRecommender {
	return &PlaceRecommender{
		dbPRRepo: dbPRRepo,
		pRepo:    pRepo,
		tRepo:    tRepo,
	}
}

func (pr *PlaceRecommender) RecommendPlaces(
	ctx context.Context,
	settings domain.LobbySettings,
) ([]*domain.Place, error) {
	log.Debug("Starting recommendation process")
	var places []*domain.Place
	var err error

	switch settings.Type {
	case domain.ClassicPlacesLobbyType:
		log.Debug("Using classic recommendation")
		if settings.ClassicPlaces == nil {
			return nil, errors.New("classic recommendation settings are chosen but not set")
		}

		if settings.ClassicPlaces.Recommendation == nil {
			settings.ClassicPlaces.Recommendation = defaultRecommendationOpts()
		}

		places, err = pr.dbPRRepo.RecommendClassicPlaces(ctx, *settings.ClassicPlaces)
		if err != nil {
			return nil, fmt.Errorf("can't recommend from db: %w", err)
		}
		log.Debugf("Got %d places from db", len(places))

	case domain.CollectionPlacesLobbyType:
		log.Debug("Using collection recommendation")

		if settings.CollectionPlaces == nil {
			return nil, errors.New("collection recommendation settings are chosen but not set")
		}

		places, err = pr.pRepo.GetPlacesByCollection(ctx, settings.CollectionPlaces.CollectionID)
		if err != nil {
			return nil, fmt.Errorf("can't get collection: %w", err)
		}
		if settings.CollectionPlaces.Location != nil {
			geo.SortPlacesByDistance(places, *settings.CollectionPlaces.Location)
		}

		log.Debugf("Got %d places from db", len(places))
	default:
		return nil, fmt.Errorf("unsupported recommendation type: %s", settings.Type)
	}

	places = algo.Filter(places, placeIncluded)
	return places, nil
}

func placeIncluded(p *domain.Place) bool {
	for _, tag := range p.Tags {
		if tag.Excluded {
			return false
		}
	}
	return true
}

func defaultRecommendationOpts() *domain.RecommendationOpts {
	return &domain.RecommendationOpts{
		Type: domain.RecommendationTypeClassic,
		Classic: &domain.RecommendationOptsClassic{
			PricePower: config.C.Recommendation.PricePower,
			PriceCoeff: config.C.Recommendation.PriceCoeff,
			PriceBound: config.C.Recommendation.PriceBound,
			DistPower:  config.C.Recommendation.DistPower,
			DistCoeff:  config.C.Recommendation.DistCoeff,
			DistBound:  config.C.Recommendation.DistBound,
		},
	}
}
