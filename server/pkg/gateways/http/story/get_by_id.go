package story

import (
	"net/http"

	"dishdash.ru/pkg/gateways/http/ginerr"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// GetByID godoc
// @Summary Get story by id
// @Tags stories
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Story ID"
// @Success 200 {object} domain.Story "Story"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /stories/id/{id} [get]
func GetByID(storyCase usecase.Story) gin.HandlerFunc {
	return func(c *gin.Context) {
		story, err := storyCase.GetStoryByID(c, c.Param("id"))
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get stories") {
			return
		}
		c.JSON(http.StatusOK, story)
	}
}
