package main

import "github.com/NguyenHoaiPhuong/books-stock/server/app"

func main() {
	app := &app.App{}
	app.Initialize()
	app.Run()
}
