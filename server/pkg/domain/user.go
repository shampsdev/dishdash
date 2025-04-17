package domain

import "time"

type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Avatar    string    `json:"avatar"`
	Telegram  *int64    `json:"telegram"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type UserTGData struct {
	FirstName        string `json:"firstName"`
	LastName         string `json:"lastName"`
	TelegramID       int64  `json:"telegramId"`
	TelegramUsername string `json:"telegramUsername"`
	Avatar           string `json:"avatar"`
}
