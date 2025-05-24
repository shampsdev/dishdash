package collection

import (
	"net/http"

	"dishdash.ru/pkg/domain"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

// FilterCollections godoc
// @Summary Get collections previews
// @Description Get a list of collections preveiws from the database
// @Tags collections
// @Accept json
// @Produce json
// @Schemes http https
// @Param filter body domain.AdminCollectionFilter true "Filter"
// @Success 200 {array} []domain.AdminCollection "List of collections previews"
// @Failure 500
// @Security ApiKeyAuth
// @Router /collections/filter [post]
func FilterCollections(collectionUseCase usecase.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		var filter domain.AdminCollectionFilter
		if err := c.ShouldBindJSON(&filter); err != nil {
			log.WithError(err).Error("failed to bind filter")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}
		collections, err := collectionUseCase.AdminFilterCollections(c, filter)
		if err != nil {
			log.WithError(err).Error("failed to get collections")
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.JSON(http.StatusOK, collections)
	}
}
