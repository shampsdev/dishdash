package place

import (
	"fmt"
	"net/http"

	"dishdash.ru/cmd/server/config"
	"dishdash.ru/pkg/domain"
	"github.com/ekomobile/dadata/v2"
	"github.com/ekomobile/dadata/v2/api/suggest"
	"github.com/ekomobile/dadata/v2/client"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

type addressResponse struct {
	Address string `json:"address"`
}

// Address godoc
// @Summary Get address by location
// @Tags places
// @Accept json
// @Produce json
// @Schemes http https
// @Param location body domain.Coordinate true "Location"
// @Success 200 {object} addressResponse "Place"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /places/address [post]
func Address() gin.HandlerFunc {
	api := dadata.NewSuggestApi(client.WithCredentialProvider(&client.Credentials{
		ApiKeyValue: config.C.Auth.DadataApiToken,
	}))
	return func(c *gin.Context) {
		var location domain.Coordinate
		if err := c.ShouldBindJSON(&location); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		address, err := api.GeoLocate(c.Request.Context(), &suggest.GeolocateParams{
			Lat:   fmt.Sprintf("%f", location.Lat),
			Lon:   fmt.Sprintf("%f", location.Lon),
			Count: 1,
		})

		if err != nil || len(address) == 0 {
			log.Error(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		c.JSON(http.StatusOK, addressResponse{
			fmt.Sprintf("%s, %s %s", address[0].Data.StreetWithType, address[0].Data.HouseType, address[0].Data.House),
		})
	}
}
