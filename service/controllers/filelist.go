package controllers

import (
	"context"
	"net/http"

	"example.aeyewitness/services"
	"github.com/gin-gonic/gin"
)

type FileListController struct{}

func (flc FileListController) GetFilelist(c *gin.Context) {
	result := services.GetFileList(context.Background())

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, result)
}
