package controllers

import (
	"context"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"example.aeyewitness/services"
	"github.com/gin-gonic/gin"
)

type FileUploadController struct{}

func (u FileUploadController) Upload(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.Error(err)
		return
	}

	// Open the file
	fileToImport, err := fileHeader.Open()
	if err != nil {
		c.Error(err)
		return
	}
	defer fileToImport.Close()

	// Create temp file
	tmpFile, err := ioutil.TempFile("", fileHeader.Filename)
	if err != nil {
		c.Error(err)
		return
	}
	defer tmpFile.Close()

	// Delete temp file after importing
	defer os.Remove(tmpFile.Name())

	// Write data from received file to temp file
	fileBytes, err := ioutil.ReadAll(fileToImport)
	if err != nil {
		c.Error(err)
		return
	}

	var metaData services.ImageMetaData
	if err := c.ShouldBind(&metaData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	metaData.ServerTime = time.Now()
	metaData.Name = fileHeader.Filename

	result := services.StartUploadFile(context.Background(), metaData, fileHeader.Filename, fileBytes)
	if result {
		c.JSON(http.StatusCreated, gin.H{"message": "Upload successfull"})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Upload failed"})
	}
}
