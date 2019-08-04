import React, { Component } from 'react'
import axios from 'axios';
import {Table, Button} from 'reactstrap'
import './app-table.css'

export default class AppTable extends Component {
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
    
    render() {
        let books = this.state.books.map((book) => {
            return (                
                <tr className="AppTable-Row" key={book.id}>
                    <td className="AppTable-Col-Num">{book.id}</td>
                    <td className="AppTable-Col-Title">{book.title}</td>
                    <td className="AppTable-Col-Rating">{book.rating}</td>
                    <td className="AppTable-Col-Actions">
                        <Button color="success" size="sm">Edit</Button>
                        <Button color="danger" size="sm">Delete</Button>
                    </td>
                </tr>
            );
        })

        return (
            <Table className="AppTable">
                <thead className="AppTable-Head">
                    <tr className="AppTable-Row">
                        <th className="AppTable-Col-Num">#</th>
                        <th className="AppTable-Col-Title">Title</th>
                        <th className="AppTable-Col-Rating">Rating</th>
                        <th className="AppTable-Col-Actions">Actions</th>
                    </tr>
                </thead>

                <tbody className="AppTable-Body">
                    {books}                    
                </tbody>
            </Table>
        )
    }
}
