package collection

import (
	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.RouterGroup, cases usecase.Cases) {
	collectionGroup := r.Group("collections")
	middlewares.SetupAuth(collectionGroup, cases.User)

	collectionGroup.GET("", GetAll(cases.Collection))
	collectionGroup.GET("/id/:id", GetByID(cases.Collection))

	collectionGroup.GET("/favorites", GetFavorites(cases.Collection))
	collectionGroup.POST("/favorites/add_place/:place_id", AddPlaceToFavorites(cases.Collection))
	collectionGroup.POST("/favorites/remove_place/:place_id", RemovePlaceFromFavorites(cases.Collection))
}
