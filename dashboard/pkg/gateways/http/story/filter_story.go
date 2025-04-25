package story

import (
	"net/http"

	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

// FilterStories godoc
// @Summary Get stories previews
// @Description Get a list of story previews from the database
// @Tags stories
// @Accept json
// @Produce json
// @Schemes http https
// @Param filter body domain.StoryFilter true "Filter"
// @Success 200 {array} []domain.Story "List of stories previews"
// @Failure 500
// @Security ApiKeyAuth
// @Router /stories/filter [post]
func FilterStories(storyUseCase usecase.Story) gin.HandlerFunc {
	return func(c *gin.Context) {
		var filter domain.StoryFilter
		if err := c.ShouldBindJSON(&filter); err != nil {
			log.WithError(err).Error("failed to bind filter")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		stories, err := storyUseCase.FilterStories(c, filter)
		if err != nil {
			log.WithError(err).Error("failed to get stories")
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.JSON(http.StatusOK, stories)
	}
}
