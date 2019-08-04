package test

import (
	"fmt"
	"testing"

	"books-stock/server/config"
)

func TestSetupConfig(t *testing.T) {
	cf := config.SetupConfig("../resource/config.json")
	if cf == nil {
		t.Errorf("Setup Config Error\n")
	}
	fmt.Println("App 's configuration:")
	fmt.Println("MongoDB 's configuration:")
	fmt.Printf("Host: %v\n", *cf.MongoDBConfig.Host)
	fmt.Printf("Port: %v\n", *cf.MongoDBConfig.Port)
}
