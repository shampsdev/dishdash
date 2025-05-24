package domain

import "time"

type Story struct {
	ID        string      `json:"id"`
	Title     string      `json:"title"`
	Icon      string      `json:"icon"`
	Src       string      `json:"src"`
	Visible   bool        `json:"visible"`
	Stories   []StoryData `json:"stories"`
	CreatedAt time.Time   `json:"created_at"`
}

type StoryData struct {
	URL           string `json:"url"`
	Type          string `json:"type"`
	DurationMilli int    `json:"duration"`
	Title         string `json:"title"`
	Description   string `json:"description"`
}

type StoryFilter struct {
	Title   string `json:"title"`
	Visible *bool  `json:"visible"`
}

type StoryPatch struct {
	ID      string       `json:"id"`
	Title   *string      `json:"title"`
	Visible *bool        `json:"visible"`
	Icon    *string      `json:"icon"`
	Src     *string      `json:"src"`
	Stories *[]StoryData `json:"stories"`
}
