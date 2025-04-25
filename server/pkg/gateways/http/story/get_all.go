package story

import (
	"net/http"

	"dishdash.ru/pkg/gateways/http/ginerr"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// GetAll godoc
// @Summary Get visible stories
// @Tags stories
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} []domain.Story "Story data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /stories [get]
func GetAll(storyCase usecase.Story) gin.HandlerFunc {
	return func(c *gin.Context) {
		stories, err := storyCase.GetVisibleStories(c)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get stories") {
			return
		}
		c.JSON(http.StatusOK, stories)
	}
}
