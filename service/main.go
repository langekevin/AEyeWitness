package main

import (
	"fmt"
	"os"

	"example.aeyewitness/server"
	"github.com/spf13/viper"
)

func loadEnvVariables() bool {

	viper.SetConfigFile(".env")

	err := viper.ReadInConfig()

	if err != nil {
		fmt.Println("Error while reading config file")
		fmt.Println(err)
		return false
	}

	value, ok := viper.Get("STORJ_ACCESS_GRANT").(string)
	if ok {
		os.Setenv("STORJ_ACCESS_GRANT", value)
	}

	value, ok = viper.Get("STORJ_BUCKET").(string)
	if ok {
		os.Setenv("STORJ_BUCKET", value)
	}

	value, ok = viper.Get("NODE_FRONTEND_SERVER").(string)
	if ok {
		os.Setenv("NODE_FRONTEND_SERVER", value)
	}

	value, ok = viper.Get("BACKEND_SERVER").(string)
	if ok {
		os.Setenv("BACKEND_SERVER", value)
	}

	return true
}

func main() {

	if !loadEnvVariables() {
		return
	}

	server.Init()
}
