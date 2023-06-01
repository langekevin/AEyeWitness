package services

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"storj.io/uplink"
)

type Response struct {
	Message     string `json:"message"`
	Transaction string `json:"transaction"`
}

type ImageMetaData struct {
	Name             string    `form:"name"`
	Longitute        float64   `form:"longitute"`
	Latitute         float64   `form:"latitute"`
	LocalTime        time.Time `form:"timestamp"`
	Accuracy         float32   `form:"accuracy"`
	Altitude         float64   `form:"altitude"`
	AltitudeAccuracy float32   `form:"altitudeAccuracy"`
	Heading          float32   `form:"heading"`
	Speed            float32   `form:"speed"`
	ServerTime       time.Time
	Hash             string
}

func getFileExtension(fileName string) string {
	parts := strings.Split(fileName, ".")
	return parts[len(parts)-1]
}

func calculateSha(data []byte) string {
	sha := sha256.New()
	sha.Write(data)
	return hex.EncodeToString(sha.Sum(nil))
}

func getEnvVariable(key string) string {
	value, ok := os.LookupEnv(key)
	if ok {
		return value
	}
	return ""
}

func StartUploadFile(ctx context.Context, metaData ImageMetaData, fileName string, data []byte) bool {

	hash_value := calculateSha(data)

	metaData.Hash = hash_value
	metaDataBytes, err := json.Marshal(metaData)
	if err != nil {
		return false
	}

	meta_data_hash := calculateSha(metaDataBytes)

	values := map[string]string{"imageHash": hash_value, "metaDataHash": meta_data_hash}
	json_data, err := json.Marshal(values)

	if err != nil {
		return false
	}

	var frontend_url string = getEnvVariable("NODE_FRONTEND_SERVER")
	resp, err := http.Post(frontend_url+"blockchain", "application/json", bytes.NewBuffer(json_data))
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var result Response
	if err := json.Unmarshal(body, &result); err != nil {
		return false
	}
	fileName = result.Transaction + "." + getFileExtension(fileName)
	metaDataFileName := result.Transaction + ".meta"

	return UploadFile(ctx, fileName, metaDataFileName, data, metaDataBytes)
}

func UploadFile(ctx context.Context, fileName string, metaDataFileName string, imageData []byte, metaData []byte) bool {

	var myAccessGrant string = getEnvVariable("STORJ_ACCESS_GRANT")
	var myBucket string = getEnvVariable("STORJ_BUCKET")

	access, err := uplink.ParseAccess(myAccessGrant)
	if err != nil {
		return false
	}

	project, err := uplink.OpenProject(ctx, access)
	if err != nil {
		return false
	}

	_, err = project.EnsureBucket(ctx, myBucket)
	if err != nil {
		return false
	}

	upload, err := project.UploadObject(ctx, myBucket, metaDataFileName, nil)
	if err != nil {
		return false
	}

	buf := bytes.NewBuffer(metaData)
	_, err = io.Copy(upload, buf)
	if err != nil {
		_ = upload.Abort()
		return false
	}

	err = upload.Commit()
	if err != nil {
		return false
	}

	upload, err = project.UploadObject(ctx, myBucket, fileName, nil)
	if err != nil {
		return false
	}

	buf = bytes.NewBuffer(imageData)
	_, err = io.Copy(upload, buf)
	if err != nil {
		_ = upload.Abort()
		return false
	}

	err = upload.Commit()
	if err != nil {
		return false
	}

	return true
}

type FileList struct {
	Key string `json:"key"`
}

func GetFileList(ctx context.Context) []FileList {
	var result []FileList
	var myAccessGrant string = getEnvVariable("STORJ_ACCESS_GRANT")
	var myBucket string = getEnvVariable("STORJ_BUCKET")

	access, err := uplink.ParseAccess(myAccessGrant)
	if err != nil {
		return result
	}

	project, err := uplink.OpenProject(ctx, access)
	if err != nil {
		return result
	}

	_, err = project.EnsureBucket(ctx, myBucket)
	if err != nil {
		return result
	}

	objects := project.ListObjects(ctx, myBucket, nil)
	for objects.Next() {
		item := objects.Item()
		if !strings.Contains(item.Key, ".meta") {
			result = append(result, FileList{Key: item.Key})
		}
	}
	return result
}

func DownloadFile(ctx context.Context, key string) []byte {
	var result []byte
	var myAccessGrant string = getEnvVariable("STORJ_ACCESS_GRANT")
	var myBucket string = getEnvVariable("STORJ_BUCKET")

	access, err := uplink.ParseAccess(myAccessGrant)
	if err != nil {
		return result
	}

	project, err := uplink.OpenProject(ctx, access)
	if err != nil {
		return result
	}

	_, err = project.EnsureBucket(ctx, myBucket)
	if err != nil {
		return result
	}

	obj, err := project.DownloadObject(ctx, myBucket, key, nil)
	if err != nil {
		return result
	}

	result, err = ioutil.ReadAll(obj)
	if err != nil {
		return result
	}

	return result
}
