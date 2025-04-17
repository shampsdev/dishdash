package lobby

import (
	"net/http"

	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// GetLatestLobbies godoc
// @Summary Get latest lobbies for user
// @Tags lobbies
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} []domain.Lobby "lobby data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /lobbies/latest [get]
func GetLatestLobbies(lobbyUseCase usecase.Lobby) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		lobbies, err := lobbyUseCase.GetLatestLobbiesForUser(c, user.ID, 5)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, lobbies)
	}
}
