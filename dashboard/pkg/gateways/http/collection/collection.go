package collection

import (
	"dashboard.dishdash.ru/cmd/config"
	"dashboard.dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.RouterGroup, cases usecase.Cases) {
	collectionGroup := r.Group("collections")
	collectionGroup.Use(middlewares.ApiTokenAuth(config.C.Auth.ApiToken))

	collectionGroup.
		POST("", SaveCollection(cases.Collection)).
		PATCH("", PatchCollection(cases.Collection)).
		GET("id/:id", GetCollectionByID(cases.Collection)).
		DELETE("id/:id", DeleteCollection(cases.Collection)).
		POST("filter", FilterCollections(cases.Collection))
}
