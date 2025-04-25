package story

import (
	"net/http"

	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// GetStoryByID godoc
// @Summary Get a story
// @Description Get a story with the same id from the database
// @Tags stories
// @Accept  json
// @Produce  json
// @Schemes http https
// @Param id path string true "Story ID"
// @Success 200 {object} domain.Story "Story"
// @Failure 500
// @Security ApiKeyAuth
// @Router /stories/id/{id} [get]
func GetStoryByID(storyUseCase usecase.Story) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		story, err := storyUseCase.GetStoryByID(c, id)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, story)
	}
}
