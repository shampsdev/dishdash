package story

import (
	"net/http"

	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// SaveStory godoc
// @Summary Create a story
// @Description Create a new story in the database
// @Tags stories
// @Accept  json
// @Produce  json
// @Schemes http https
// @Param story body domain.Story true "Story data"
// @Success 200 {object} domain.Story "Saved story"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /stories [post]
func SaveStory(storyUseCase usecase.Story) gin.HandlerFunc {
	return func(c *gin.Context) {
		var storyInput domain.Story
		err := c.BindJSON(&storyInput)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		story, err := storyUseCase.SaveStory(c, &storyInput)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, story)
	}
}
