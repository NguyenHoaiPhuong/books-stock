import React, { Component } from 'react';
import axios from 'axios';
import BookTable from './components/book-table';
import AddBookModal from './components/add-book-modal';
import './app.css';

const serverHost = "http://192.168.100.100"
const serverPort = ":9000"

export default class App extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             books: []
        }
    }

    componentWillMount() {
        axios.get(serverHost + serverPort +  '/books').then((response) => {
            this.setState({
                books: response.data
            })
            console.log(response)
        })
    }

    getBooks = () => this.state.books

    addBook = (book) => {
        let books = this.state.books
        books.push(book)
        this.setState({
                books: books,
            });
    }

    removeBook  = (bookID) => {
        let books = this.state.books
        for( var i = 0; i < books.length; i++ ){ 
            if (books[i].id === bookID) {
                books.splice(i, 1); 
                break
            }
        }
        this.setState({
            books: books,
        });         
    }

    modifyBook = (bookID, book) => {
        let books = this.state.books
        for( var i = 0; i < books.length; i++ ){ 
            if (books[i].id === bookID) {
                books[i].id = book.id
                books[i].title = book.title
                books[i].rating = book.rating
                break
            }
        }
        this.setState({
            books: books,
        });        
    }

    render() {
        return (
            <div className="App">
                <AddBookModal bookHandler={this.addBook} host={serverHost} port={serverPort} />
                <BookTable getBooksHandler={this.getBooks} removeBookHandler={this.removeBook} modifyBookHandler={this.modifyBook} host={serverHost} port={serverPort} />
            </div>
        )
    }
}