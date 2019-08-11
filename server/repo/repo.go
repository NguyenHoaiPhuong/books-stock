package repo

import (
	"github.com/NguyenHoaiPhuong/books-stock/server/error"
	"github.com/NguyenHoaiPhuong/books-stock/server/model"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
)

// MongoDB struct includes DB session
type MongoDB struct {
	Session *mgo.Session
}

// InitDBSession initalizes MongoDB session
func (db *MongoDB) InitDBSession(serverHost string) error.Error {
	var err error.Imp
	sess, osErr := mgo.Dial(serverHost)
	if osErr != nil {
		err.SetErrorMessage(osErr.Error())
		err.InsertErrorMessage(error.ErrorDBSessionInit)
		return err
	}
	db.Session = sess
	db.Session.SetMode(mgo.Monotonic, true)
	return nil
}

// EnsureIndex indexing
func (db *MongoDB) EnsureIndex(databaseName string, collectionName string, indexKey string) error.Error {
	var err error.Imp
	if db.Session == nil {
		err.InsertErrorMessage(error.ErrorDBSessionNil)
		err.InsertErrorMessage(error.ErrorDBIndex)
		return err
	}

	session := db.Session.Copy()
	index := mgo.Index{
		Key:        []string{indexKey},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	c := session.DB(databaseName).C(collectionName)
	osErr := c.EnsureIndex(index)
	if osErr != nil {
		err.InsertErrorMessage(osErr.Error())
		err.InsertErrorMessage(error.ErrorDBIndex)
	}

	return nil
}

// GetAllDocuments : get all documents in the given DB and Collection
func (db *MongoDB) GetAllDocuments(databaseName string, collectionName string) ([]interface{}, error.Error) {
	var err error.Imp
	var docs []interface{}

	session := db.Session.Copy()
	defer session.Close()

	c := session.DB(databaseName).C(collectionName)

	osErr := c.Find(bson.M{}).All(&docs)
	if osErr != nil {
		err.SetErrorMessage(osErr.Error())
		err.InsertErrorMessage(error.ErrorAppGetAllBooks)
		return nil, err
	}

	return docs, nil
}

// GetDocumentByKey gets document by given key and respective value
func (db *MongoDB) GetDocumentByKey(databaseName string, collectionName string, key string, value interface{}) (interface{}, error.Error) {
	var err error.Imp
	var doc interface{}

	session := db.Session.Copy()
	defer session.Close()

	c := session.DB(databaseName).C(collectionName)

	osErr := c.Find(bson.M{key: value}).One(&doc)
	if osErr != nil {
		err.SetErrorMessage(osErr.Error())
		err.InsertErrorMessage(error.ErrorDBGetDocumentByKey)
		return doc, err
	}
	return doc, nil
}

// AddDocument adds new document
func (db *MongoDB) AddDocument(databaseName string, collectionName string, doc interface{}) error.Error {
	var err error.Imp

	session := db.Session.Copy()
	defer session.Close()

	c := session.DB(databaseName).C(collectionName)
	osErr := c.Insert(doc)
	if osErr != nil {
		err.SetErrorMessage(osErr.Error())
		err.InsertErrorMessage(error.ErrorDBDuplicatedKey)
		return err
	}
	return nil
}

// UpdateDocument update specific document
func (db *MongoDB) UpdateDocument(databaseName string, collectionName string, book *model.Book) error.Error {
	var err error.Imp

	session := db.Session.Copy()
	defer session.Close()

	c := session.DB(databaseName).C(collectionName)
	osErr := c.Update(bson.M{"id": book.ID}, book)
	if osErr != nil {
		err.SetErrorMessage(osErr.Error())
		err.InsertErrorMessage(error.ErrorDBUpdateDocument)
		return err
	}
	return nil
}

// DeleteDocumentByKey deletes document by given key and respective value
func (db *MongoDB) DeleteDocumentByKey(databaseName string, collectionName string, key string, value interface{}) error.Error {
	var err error.Imp

	session := db.Session.Copy()
	defer session.Close()

	c := session.DB(databaseName).C(collectionName)

	osErr := c.Remove(bson.M{key: value})
	if osErr != nil {
		err.SetErrorMessage(osErr.Error())
		err.InsertErrorMessage(error.ErrorDBDeleteDocumentByKey)
		return err
	}
	return nil
}
