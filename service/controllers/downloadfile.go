package controllers

import (
	"context"
	"net/http"
	"strconv"

	"example.aeyewitness/services"

	"github.com/gin-gonic/gin"
)

type DownloadFile struct{}

type File struct {
	Key string `json:"key"`
}

func (df DownloadFile) GetFile(c *gin.Context) {
	key := c.Param("key")

	if len(key) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No key was given"})
		return
	}
	result := services.DownloadFile(context.Background(), key)

	c.Header("Content-Type", "image/*")
	c.Header("Content-Length", strconv.Itoa(len(result)))

	c.Writer.Write(result)
}
