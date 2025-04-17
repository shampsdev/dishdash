package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"sort"
	"strconv"
	"time"

	"dishdash.ru/cmd/server/config"
	"github.com/go-telegram/bot"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Source struct {
	Data []TelegramSource `json:"data"`
}

type TelegramSource struct {
	Telegram int    `json:"telegram"`
	Source   string `json:"source"`
}

type User struct {
	ID            string    `json:"id"`
	TGID          string    `json:"tg_id"`
	TGUsername    string    `json:"tg_username"`
	SwipesCount   int       `json:"swipes_count"`
	LikesCount    int       `json:"likes_count"`
	DislikesCount int       `json:"dislikes_count"`
	CreatedAt     time.Time `json:"created_at"`
	Source        string    `json:"source"`
	Name          string    `json:"name"`
	LobbiesCount  int       `json:"lobbies_count"`
	Lobbies       []Lobby   `json:"lobbies"`
}

type Lobby struct {
	ID            string    `json:"id"`
	SwipesCount   int       `json:"swipes_count"`
	LikesCount    int       `json:"likes_count"`
	DislikesCount int       `json:"dislikes_count"`
	UsersCount    int       `json:"users_count"`
	CreatedAt     time.Time `json:"created_at"`
}

func main() {
	config.Load(".env")
	cfg := config.C
	ctx := context.Background()
	pgxcfg := cfg.PGXConfig()
	db, err := pgxpool.NewWithConfig(ctx, pgxcfg)
	if err != nil {
		panic(err)
	}

	botToken := os.Getenv("BOT_TOKEN")
	b, err := bot.New(botToken, bot.WithDebug())
	if err != nil {
		panic(err)
	}

	sourceFname := "plausible.json"
	source, err := os.ReadFile(sourceFname)
	if err != nil {
		panic(err)
	}
	var s Source
	err = json.Unmarshal(source, &s)
	if err != nil {
		panic(err)
	}

	telegramSourceMap := make(map[string]string)
	for _, v := range s.Data {
		telegramSourceMap[strconv.Itoa(v.Telegram)] = v.Source
	}

	var count int
	q := `SELECT count(*) FROM "user"`
	row := db.QueryRow(ctx, q)
	err = row.Scan(&count)
	if err != nil {
		panic(err)
	}
	println(count)

	var users []User
	q = `SELECT id, telegram, created_at, name FROM "user"`
	rows, err := db.Query(ctx, q)
	if err != nil {
		panic(err)
	}
	for rows.Next() {
		var user User
		err = rows.Scan(&user.ID, &user.TGID, &user.CreatedAt, &user.Name)
		if err != nil {
			panic(err)
		}

		u, err := b.GetChat(ctx, &bot.GetChatParams{
			ChatID: user.TGID,
		})
		if err != nil {
			log.Println(err)
		}
		if u != nil {
			user.TGUsername = u.Username
		}
		user.Source = telegramSourceMap[user.TGID]

		lq := `SELECT id, created_at
		FROM "lobby"
		JOIN lobby_user ON "lobby".id = lobby_user.lobby_id
		WHERE lobby_user.user_id = $1`
		lrows, err := db.Query(ctx, lq, user.ID)
		if err != nil {
			panic(err)
		}

		uSwipeCountQ := `SELECT count(*) FROM "swipe" WHERE user_id = $1`
		row := db.QueryRow(ctx, uSwipeCountQ, user.ID)
		err = row.Scan(&user.SwipesCount)
		if err != nil {
			panic(err)
		}

		uLikesCountQ := `SELECT count(*) FROM "swipe" WHERE user_id = $1 AND type = 'like'`
		row = db.QueryRow(ctx, uLikesCountQ, user.ID)
		err = row.Scan(&user.LikesCount)
		if err != nil {
			panic(err)
		}
		user.DislikesCount = user.SwipesCount - user.LikesCount

		for lrows.Next() {
			var lobby Lobby
			err = lrows.Scan(&lobby.ID, &lobby.CreatedAt)
			if err != nil {
				panic(err)
			}

			swipeCountQ := `SELECT count(*) FROM "swipe" WHERE lobby_id = $1`
			row := db.QueryRow(ctx, swipeCountQ, lobby.ID)
			err = row.Scan(&lobby.SwipesCount)
			if err != nil {
				panic(err)
			}

			userCountQ := `SELECT count(*) FROM "lobby_user" WHERE lobby_id = $1`
			row = db.QueryRow(ctx, userCountQ, lobby.ID)
			err = row.Scan(&lobby.UsersCount)
			if err != nil {
				panic(err)
			}

			likeCountQ := `SELECT count(*) FROM "swipe" WHERE lobby_id = $1 AND type = 'like' AND user_id = $2`
			row = db.QueryRow(ctx, likeCountQ, lobby.ID, user.ID)
			err = row.Scan(&lobby.LikesCount)
			if err != nil {
				panic(err)
			}
			lobby.DislikesCount = lobby.SwipesCount - lobby.LikesCount

			user.Lobbies = append(user.Lobbies, lobby)
		}

		user.LobbiesCount = len(user.Lobbies)
		users = append(users, user)
	}

	sort.Slice(users, func(i, j int) bool {
		return users[i].SwipesCount > users[j].SwipesCount
	})

	fname := "users.json"
	f, err := os.Create(fname)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	data, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		panic(err)
	}
	_, err = f.Write(data)
	if err != nil {
		panic(err)
	}
}
