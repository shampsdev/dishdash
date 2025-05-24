package usecase

import (
	"context"
	"fmt"

	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/repo"
)

type StoryUseCase struct {
	sr repo.Story
}

func NewStoryUseCase(sr repo.Story) *StoryUseCase {
	return &StoryUseCase{sr: sr}
}

func (s *StoryUseCase) FilterStories(ctx context.Context, filter domain.StoryFilter) ([]*domain.Story, error) {
	return s.sr.FilterStories(ctx, filter)
}

func (s *StoryUseCase) GetVisibleStories(ctx context.Context) ([]*domain.Story, error) {
	return s.sr.FilterStories(ctx, domain.StoryFilter{Visible: ptrTo(true)})
}

func (s *StoryUseCase) PatchStory(ctx context.Context, story *domain.StoryPatch) (*domain.Story, error) {
	err := s.sr.PatchStory(ctx, story)
	if err != nil {
		return nil, fmt.Errorf("failed to patch story: %w", err)
	}
	return s.sr.GetStoryByID(ctx, story.ID)
}

func (s *StoryUseCase) GetStoryByID(ctx context.Context, id string) (*domain.Story, error) {
	return s.sr.GetStoryByID(ctx, id)
}

func (s *StoryUseCase) SaveStory(ctx context.Context, story *domain.Story) (*domain.Story, error) {
	id, err := s.sr.SaveStory(ctx, story)
	if err != nil {
		return nil, fmt.Errorf("failed to save story: %w", err)
	}
	return s.sr.GetStoryByID(ctx, id)
}

func (s *StoryUseCase) DeleteStoryByID(ctx context.Context, id string) error {
	return s.sr.DeleteStoryByID(ctx, id)
}
