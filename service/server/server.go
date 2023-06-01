package server

import (
	"os"
)

func getEnvVariable(key string) string {
	value, ok := os.LookupEnv(key)
	if ok {
		return value
	}
	return ""
}

func Init() {
	r := NewRouter()

	var http_address string = getEnvVariable("BACKEND_SERVER")

	r.Run(http_address)
}
