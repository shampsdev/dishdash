package lobby

import (
	"net/http"
	"strconv"

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
// @Param limit query int false "limit"
// @Success 200 {object} []domain.Lobby "lobby data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /lobbies/latest [get]
func GetLatestLobbies(lobbyUseCase usecase.Lobby) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		limitStr := c.DefaultQuery("limit", "10")
		limit, err := strconv.Atoi(limitStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		lobbies, err := lobbyUseCase.GetLatestLobbiesForUser(c, user.ID, limit)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, lobbies)
	}
}
