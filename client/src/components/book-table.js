import React, { Component } from 'react'
import {Table, Button} from 'reactstrap'
import axios from 'axios';
import './book-table.css'

export default class BookTable extends Component {
    removeBook = function() {
        let config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }        
        axios.delete(`${this.host}${this.port}/book/${this.bookID}`, config).then((response) => {
            console.log('Response:')
            console.log(response)
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
        })
    }

    render() {
        const books = this.props.bookHandler()
        let bookData = books.map((book) => {
            let obj = {
                bookID: book.id,
                host: this.props.host,
                port: this.props.port
            }
            return (                
                <tr className="BookTable-Row" key={book.id}>
                    <td className="BookTable-Col-Num">{book.id}</td>
                    <td className="BookTable-Col-Title">{book.title}</td>
                    <td className="BookTable-Col-Rating">{book.rating}</td>
                    <td className="BookTable-Col-Actions">
                        <Button color="success" size="sm">Edit</Button>
                        <Button color="danger" size="sm" onClick={this.removeBook.bind(obj)}>Delete</Button>
                    </td>
                </tr>
            );
        })

        return (
            <Table className="BookTable">
                <thead className="BookTable-Head">
                    <tr className="BookTable-Row">
                        <th className="BookTable-Col-Num">#</th>
                        <th className="BookTable-Col-Title">Title</th>
                        <th className="BookTable-Col-Rating">Rating</th>
                        <th className="BookTable-Col-Actions">Actions</th>
                    </tr>
                </thead>

                <tbody className="BookTable-Body">
                    {bookData}                    
                </tbody>
            </Table>
        )
    }
}
