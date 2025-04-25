package story

import (
	"dashboard.dishdash.ru/cmd/config"
	"dashboard.dishdash.ru/pkg/gateways/http/middlewares"
	"dishdash.ru/pkg/usecase"
	"github.com/gin-gonic/gin"
)

func SetupHandlers(r *gin.RouterGroup, cases usecase.Cases) {
	storyGroup := r.Group("stories")
	storyGroup.Use(middlewares.ApiTokenAuth(config.C.Auth.ApiToken))

	storyGroup.
		POST("", SaveStory(cases.Story)).
		PATCH("", PatchStory(cases.Story)).
		GET("id/:id", GetStoryByID(cases.Story)).
		DELETE("id/:id", DeleteStory(cases.Story)).
		POST("filter", FilterStories(cases.Story))
}
