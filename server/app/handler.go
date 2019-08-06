package app

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/NguyenHoaiPhuong/books-stock/server/error"
	"github.com/NguyenHoaiPhuong/books-stock/server/jsonfunc"
	"github.com/NguyenHoaiPhuong/books-stock/server/model"
	"github.com/NguyenHoaiPhuong/books-stock/server/utils"
	"github.com/globalsign/mgo/bson"

	"github.com/gorilla/mux"
)

func (a *App) allBooks(w http.ResponseWriter, r *http.Request) {
	docs, err := a.Database.GetAllDocuments(*a.Config.MongoDBConfig.DBName, string(model.BookCol))
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorDB)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppGetAllBooks)
		log.Printf("%v\n", errNew.Error())
		return
	}

	books := make([]*model.Book, len(docs))
	for i, doc := range docs {
		book := new(model.Book)
		bsonBytes, _ := bson.Marshal(doc)
		bson.Unmarshal(bsonBytes, book)
		books[i] = book
	}

	err = utils.RespondJSON(w, http.StatusOK, books)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorJSON)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppGetAllBooks)
		log.Printf("%v\n", errNew.Error())
		return
	}
}

func (a *App) addBook(w http.ResponseWriter, r *http.Request) {
	var book model.Book

	err := jsonfunc.ConvertFromJSON(r.Body, &book)
	defer r.Body.Close()
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorJSON)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppAddBook)
		log.Printf("%v\n", errNew.Error())
		return
	}

	err = a.Database.AddDocument(*a.Config.MongoDBConfig.DBName, model.BookCol, &book)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorDB)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppAddBook)
		log.Printf("%v\n", errNew.Error())
		return
	}

	fmt.Fprintf(w, "Add new book into database successfully\n")
	utils.RespondJSON(w, http.StatusOK, book)
}

func (a *App) bookByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sid := vars["id"]
	id, err := strconv.Atoi(sid)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppGetBookByIsbn)
		log.Printf("%v\n", errNew.Error())
		return
	}
	doc, err := a.Database.GetDocumentByKey(*a.Config.MongoDBConfig.DBName, model.BookCol, "id", id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorDB)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppGetBookByIsbn)
		log.Printf("%v\n", errNew.Error())
		return
	}

	book := new(model.Book)
	bsonBytes, _ := bson.Marshal(doc)
	bson.Unmarshal(bsonBytes, book)

	err = utils.RespondJSON(w, http.StatusOK, book)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorJSON)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppGetBookByIsbn)
		log.Printf("%v\n", errNew.Error())
		return
	}
}

func (a *App) updateBook(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sid := vars["id"]
	id, err := strconv.Atoi(sid)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppUpdateBook)
		log.Printf("%v\n", errNew.Error())
		return
	}
	var book model.Book
	err = jsonfunc.ConvertFromJSON(r.Body, &book)
	defer r.Body.Close()
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorJSON)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppUpdateBook)
		log.Printf("%v\n", errNew.Error())
		return
	}
	book.ID = id
	err = a.Database.UpdateDocument(*a.Config.MongoDBConfig.DBName, model.BookCol, &book)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorDB)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppUpdateBook)
		log.Printf("%v\n", errNew.Error())
		return
	}
	fmt.Fprintf(w, "Update book with isbn %v into database successfully\n", id)
	utils.RespondJSON(w, http.StatusOK, book)
}

func (a *App) deleteBook(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sid := vars["id"]
	id, err := strconv.Atoi(sid)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppDeleteBookByIsbn)
		log.Printf("%v\n", errNew.Error())
		return
	}
	err = a.Database.DeleteDocumentByKey(*a.Config.MongoDBConfig.DBName, model.BookCol, "id", id)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, error.ErrorDB)
		var errNew error.Imp
		errNew.SetErrorMessage(err.Error())
		errNew.InsertErrorMessage(error.ErrorAppDeleteBookByIsbn)
		log.Printf("%v\n", errNew.Error())
		return
	}

	fmt.Fprintf(w, "Remove book with id %v from database successfully\n", id)
}
