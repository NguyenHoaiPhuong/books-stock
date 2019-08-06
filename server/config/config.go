package config

import (
	"github.com/paked/configure"
)

// Config includes all configurations for the App
type Config struct {
	MongoDBConfig *MongoConfig `json:"mongodbConfig"`
}

// MongoConfig includes configurations for Mongo
type MongoConfig struct {
	Host   *string
	Port   *string
	DBName *string
}

var cf *Config
var conf *configure.Configure

func init() {
	conf = configure.New()

	// Default configurations
	cf = &Config{
		MongoDBConfig: &MongoConfig{
			Host:   conf.String("mongodb_server_host", "127.0.0.0", "MongoDB server host"),
			Port:   conf.String("mongodb_port", "27017", "MongoDB port"),
			DBName: conf.String("mongodb_name", "", "MongoDB Name"),
		},
	}
}

// SetupConfig parses app 's configurations
func SetupConfig(fileName string) *Config {
	conf.Use(configure.NewFlag())
	conf.Use(configure.NewEnvironment())
	conf.Use(configure.NewJSONFromFile(fileName))
	conf.Parse()
	return cf
}
