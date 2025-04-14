package lobby

import (
	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.RouterGroup, cases usecase.Cases) {
	lobbiesGroup := r.Group("lobbies")
	lobbiesGroup.POST("", SaveLobby(cases.Lobby))
	lobbiesGroup.GET("/id/:id", GetLobbyByID(cases.Lobby))

	authG := lobbiesGroup.Group("")
	middlewares.SetupAuth(authG, cases.User)
	authG.GET("/latest", GetLatestLobbies(cases.Lobby))
}
