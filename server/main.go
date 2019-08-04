package main

import "books-stock/server/app"

func main() {
	app := &app.App{}
	app.Initialize()
	app.Run()
}
