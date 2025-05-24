package collection

import (
	"net/http"

	"dishdash.ru/pkg/gateways/http/ginerr"
	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// GetAll godoc
// @Summary Get visible collections
// @Tags collections
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} []domain.Collection "Collections data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /collections [get]
func GetAll(collectionCase usecase.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		collections, err := collectionCase.GetVisibleCollections(c, user.ID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get collections") {
			return
		}
		c.JSON(http.StatusOK, collections)
	}
}
