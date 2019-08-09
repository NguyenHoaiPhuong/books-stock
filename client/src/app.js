import React, { Component } from 'react';
import axios from 'axios';
import AppTable from './components/app-table';
import AppButton from './components/app-button';
import './app.css';


export default class App extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             books: []
        }
    }

    componentWillMount() {
        axios.get('http://localhost:9000/books').then((response) => {
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

    render() {
        return (
            <div className="App">
                <AppButton bookHandler={this.addBook} />
                <AppTable bookHandler={this.getBooks} />
            </div>
        )
    }
}