package app

import (
	"log"
	"net/http"
	"time"

	"github.com/NguyenHoaiPhuong/books-stock/server/api"
	"github.com/NguyenHoaiPhuong/books-stock/server/config"
	"github.com/NguyenHoaiPhuong/books-stock/server/error"
	"github.com/NguyenHoaiPhuong/books-stock/server/model"
	"github.com/NguyenHoaiPhuong/books-stock/server/repo"
)

// App struct includes router and mongodb session
type App struct {
	Config   *config.Config
	Database *repo.MongoDB
	API      *api.API
}

// Run App
func (a *App) Run() {
	srv := &http.Server{
		Handler:      a.API.Router,
		Addr:         ":9000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())

	defer a.Database.Session.Close()
}

// Initialize init App
func (a *App) Initialize() {
	a.initConfigure()
	a.initDatabase()
	a.initAPI()
}

func (a *App) initConfigure() {
	a.Config = config.SetupConfig("resource/config.json")
}

func (a *App) initDatabase() {
	a.Database = new(repo.MongoDB)
	err := a.Database.InitDBSession(*a.Config.MongoDBConfig.Host)
	if err != nil {
		var errNew error.Imp
		errNew.InsertErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppInit)
		log.Fatalln(errNew.Error())
	}
	a.Database.EnsureIndex(*a.Config.MongoDBConfig.DBName, model.BookCol, "id")
}

func (a *App) initAPI() {
	a.API = new(api.API)
	a.API.InitRouter()
	a.API.RegisterHandleFunction("GET", "/books", a.allBooks)
	a.API.RegisterHandleFunction("GET", "/book/{id}", a.bookByID)
	a.API.RegisterHandleFunction("POST", "/books", a.addBook)
	a.API.RegisterHandleFunction("PUT", "/book/{id}", a.updateBook)
	a.API.RegisterHandleFunction("DELETE", "/book/{id}", a.deleteBook)
	a.API.RegisterHandleFunction("OPTIONS", "/book/{id}", a.enableCORS)
	a.API.RegisterHandleFunction("OPTIONS", "/books", a.enableCORS)
}
