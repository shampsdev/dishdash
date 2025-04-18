package collection

import (
	"encoding/json"
	"net/http"

	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// PatchCollection godoc
// @Summary Patch a collection
// @Description Patch a collection with same id in the database
// @Tags collections
// @Accept json
// @Produce json
// @Schemes http https
// @Param collection body domain.AdminPatchCollection true "Collection data"
// @Success 200 {object} domain.AdminCollection "Updated collection"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /collections [patch]
func PatchCollection(collectionUseCase usecase.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		var patch domain.AdminPatchCollection
		err := json.NewDecoder(c.Request.Body).Decode(&patch)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		collection, err := collectionUseCase.AdminPatchCollection(c, &patch)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, collection)
	}
}
