package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"example.aeyewitness/services"
	"github.com/gin-gonic/gin"
)

type MetaDataController struct{}

type Object struct {
	Key string `json:"key"`
}

func (mdc MetaDataController) GetMetaData(c *gin.Context) {
	key := c.Param("key")

	if len(key) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No or invalid key provided"})
		return
	}

	keyParts := strings.Split(key, ".")
	key = keyParts[0] + ".meta"

	result := services.DownloadFile(context.Background(), key)

	var imageMetaData services.ImageMetaData
	json.Unmarshal(result, &imageMetaData)

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, imageMetaData)
}
