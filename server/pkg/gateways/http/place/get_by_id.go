package place

import (
	"net/http"
	"strconv"

	"dishdash.ru/pkg/gateways/http/ginerr"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

// GetByID godoc
// @Summary Get place by id
// @Tags places
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Place ID"
// @Success 200 {object} domain.Place "Place"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /places/id/{id} [get]
func GetByID(placeCase usecase.Place) gin.HandlerFunc {
	return func(c *gin.Context) {
		placeID, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to parse place id") {
			return
		}
		place, err := placeCase.GetPlaceByID(c, placeID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get place") {
			return
		}
		c.JSON(http.StatusOK, place)
	}
}
