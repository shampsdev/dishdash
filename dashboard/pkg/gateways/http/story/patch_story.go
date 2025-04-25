package story

import (
	"encoding/json"
	"net/http"

	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// PatchStory godoc
// @Summary Patch a story
// @Description Patch a story with the same ID in the database
// @Tags stories
// @Accept json
// @Produce json
// @Schemes http https
// @Param story body domain.StoryPatch true "Story data"
// @Success 200 {object} domain.Story "Updated story"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /stories [patch]
func PatchStory(storyUseCase usecase.Story) gin.HandlerFunc {
	return func(c *gin.Context) {
		var patch domain.StoryPatch
		err := json.NewDecoder(c.Request.Body).Decode(&patch)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		story, err := storyUseCase.PatchStory(c, &patch)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, story)
	}
}
