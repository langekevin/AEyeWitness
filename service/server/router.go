package server

import (
	"example.aeyewitness/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}

	router.Use(cors.New(config))

	// Register all the routes here...
	fileUploadController := new(controllers.FileUploadController)
	router.POST("/upload", fileUploadController.Upload)

	fileListController := new(controllers.FileListController)
	router.GET("/filelist", fileListController.GetFilelist)

	fileDownloadController := new(controllers.DownloadFile)
	router.GET("/download/:key", fileDownloadController.GetFile)

	metaDataController := new(controllers.MetaDataController)
	router.GET("/metadata/:key", metaDataController.GetMetaData)

	return router
}
