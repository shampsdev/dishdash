package story

import (
	"dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.RouterGroup, cases usecase.Cases) {
	storiesGroup := r.Group("stories")
	middlewares.SetupAuth(storiesGroup, cases.User)

	storiesGroup.
		GET("", GetAll(cases.Story)).
		GET("id/:id", GetByID(cases.Story))
}
