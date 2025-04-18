package domain

import "time"

type Collection struct {
	ID          string         `json:"id"`
	Type        CollectionType `json:"type"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Avatar      string         `json:"avatar"`
	Order       int64          `json:"order"`
	Places      []*Place       `json:"places"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type CreateCollection struct {
	Type        CollectionType `json:"type"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Avatar      string         `json:"avatar"`
	Order       int64          `json:"order"`
	Places      []int64        `json:"places"`
}

type PatchCollection struct {
	ID          string          `json:"id"`
	Type        *CollectionType `json:"type"`
	Name        *string         `json:"name"`
	Description *string         `json:"description"`
	Avatar      *string         `json:"avatar"`
	Order       *int64          `json:"order"`
	Places      []int64         `json:"places"`
}

type CollectionType string

const (
	CollectionTypeBasic     CollectionType = "basic"
	CollectionTypeFavorites CollectionType = "favorites"
)

type AdminCollection struct {
	Collection
	Visible bool   `json:"visible"`
	OwnerID string `json:"ownerId"`
}

type AdminCreateCollection struct {
	CreateCollection
	Visible bool   `json:"visible"`
	OwnerID string `json:"ownerId"`
}

type AdminPatchCollection struct {
	PatchCollection
	Visible *bool   `json:"visible"`
	OwnerID *string `json:"ownerId"`
}

type CollectionFilter struct {
	Search string
	Types  []CollectionType
}

type AdminCollectionFilter struct {
	CollectionFilter
	Visible *bool
	OwnerID *string
}
