package place

import (
	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.RouterGroup, cases usecase.Cases) {
	placeGroup := r.Group("places")
	middlewares.SetupAuth(placeGroup, cases.User)

	placeGroup.GET("/id/:id", GetByID(cases.Place))
	r.POST("/places/address", Address())
}
