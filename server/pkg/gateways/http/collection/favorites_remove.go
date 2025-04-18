package collection

import (
	"net/http"
	"strconv"

	"dishdash.ru/pkg/gateways/http/ginerr"
	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// RemovePlaceFromFavorites godoc
// @Summary Remove place from favorites
// @Tags collections
// @Accept json
// @Produce json
// @Schemes http https
// @Param place_id path string true "Place ID"
// @Success 200
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /collections/favorites/remove_place/{place_id} [post]
func RemovePlaceFromFavorites(collectionCase usecase.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		placeID, err := strconv.ParseInt(c.Param("place_id"), 10, 64)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to parse place id") {
			return
		}
		err = collectionCase.RemovePlaceFromFavorites(c, user.ID, placeID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get collections") {
			return
		}
		c.Status(http.StatusOK)
	}
}
