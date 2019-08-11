import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button, Table} from 'reactstrap'
import axios from 'axios';
import './book-table.css'

export default class BookTable extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            editBookDlg: false,           
        }
    }    

    openEditBookDlg = () => {
        this.setState(prevState => ({
            editBookDlg: !prevState.editBookDlg
        }));
    }
    
    removeBook = function(bookID) {
        let config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }        
        axios.delete(`${this.props.host}${this.props.port}/book/${bookID.toString()}`, config).then((response) => {
            console.log('Response:')
            console.log(response)
            this.props.removeBookHandler(bookID)
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
        })
    }

    editBook() {
        let config = {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }
        let book = {
            id: parseInt(document.getElementById("id").value),
            title: document.getElementById("title").value,
            rating: parseFloat(document.getElementById("rating").value),
        };
        axios.put(this.props.host + this.props.port + "/book/" + book.id.toString(), book, config).then((response) => {            
            console.log(response)
            let newBook = response.data;
            this.props.bookHandler(newBook)
        })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
        })        

        this.setState(prevState => ({
            editBookDlg: !prevState.editBookDlg,
        }));
    }

    render() {
        const books = this.props.getBooksHandler()
        let bookData = books.map((book) => {
            return (                
                <tr className="BookTable-Row" key={book.id}>
                    <td className="BookTable-Col-Num">{book.id}</td>
                    <td className="BookTable-Col-Title">{book.title}</td>
                    <td className="BookTable-Col-Rating">{book.rating}</td>
                    <td className="BookTable-Col-Actions">
                        <Button color="success" size="sm" className="mr-2">Edit</Button>
                        <Button color="danger" size="sm" onClick={this.removeBook.bind(this, book.id)}>Delete</Button>
                    </td>
                </tr>
            );
        })

        return (
            <div>
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

                <Modal isOpen={this.state.editBookDlg} toggle={this.openEditBookDlg}>
                    <ModalHeader toggle={this.openEditBookDlg}>Edit a book</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="id">ID</Label>
                            <Input id="id" type="text" placeholder="#" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input id="title" type="text" placeholder="Book title" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rating">Rating</Label>
                            <Input id="rating" type="text" placeholder="Rating" />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.editBook}>Edit book</Button>{' '}
                        <Button color="secondary" onClick={this.openEditBookDlg}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
