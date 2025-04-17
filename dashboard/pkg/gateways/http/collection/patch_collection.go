package collection

import (
	"encoding/json"
	"io"
	"net/http"

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
// @Param collection body usecase.UpdateCollectionInput true "Collection data"
// @Success 200 {object} domain.Collection "Updated collection"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /collections [patch]
func PatchCollection(collectionUseCase usecase.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var collectionInput usecase.UpdateCollectionInput
		err = json.Unmarshal(body, &collectionInput)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		collection, err := collectionUseCase.GetCollectionByID(c, collectionInput.ID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		collectionUpdate := usecase.UpdateCollectionInputFromDomain(collection)

		err = json.Unmarshal(body, &collectionUpdate)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		collectionUpdate.ID = collection.ID
		collection, err = collectionUseCase.UpdateCollection(c, collectionUpdate)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, collection)
	}
}
