package story

import (
	"net/http"

	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// DeleteStory godoc
// @Summary Delete a story
// @Description Delete a story with the same ID in the database
// @Tags stories
// @Accept  json
// @Produce  json
// @Schemes http https
// @Param id path string true "Story ID"
// @Success 200
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /stories/id/{id} [delete]
func DeleteStory(storyUseCase usecase.Story) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		err := storyUseCase.DeleteStoryByID(c, id)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.Status(http.StatusOK)
	}
}
