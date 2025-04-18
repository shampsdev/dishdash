package collection

import (
	"net/http"

	"dishdash.ru/pkg/gateways/http/ginerr"
	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// GetByID godoc
// @Summary Get collection by id
// @Tags collections
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Collection ID"
// @Success 200 {object} domain.Collection "Collection"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /collections/id/{id} [get]
func GetByID(collectionCase usecase.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		collection, err := collectionCase.GetCollectionByID(c, user.ID, c.Param("id"))
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get collections") {
			return
		}
		c.JSON(http.StatusOK, collection)
	}
}
