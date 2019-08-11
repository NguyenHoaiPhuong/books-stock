import React, { Component } from 'react';
import axios from 'axios';
import AppTable from './components/app-table';
import AppButton from './components/app-button';
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

    render() {
        return (
            <div className="App">
                <AppButton bookHandler={this.addBook} serverHost={serverHost} />
                <AppTable bookHandler={this.getBooks} />
            </div>
        )
    }
}