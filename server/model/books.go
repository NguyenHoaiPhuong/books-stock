package model

// Book struct includes ID, Title and Rating
type Book struct {
	ID     int     `json:"id" bson:"id"`
	Title  string  `json:"title" bson:"title"`
	Rating float64 `json:"rating" bson:"rating"`
}
