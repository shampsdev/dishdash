package ginerr

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func AbortIfErr(c *gin.Context, err error, code int, reason string) bool {
	if err == nil {
		return false
	}
	err = fmt.Errorf("%s: %w", reason, err)
	logrus.WithError(err).Error("Aborting handler")
	c.AbortWithStatusJSON(code, gin.H{"error": err.Error()})
	return true
}
