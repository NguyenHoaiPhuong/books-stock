import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button, Table} from 'reactstrap'
import axios from 'axios';
import './book-table.css'

export default class BookTable extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            editBookDlg: false,
            book: {
                id: -1,
                title: "",
                rating: 0
            }
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

    editBook(book) {
        this.setState(prevState => ({
            editBookDlg: !prevState.editBookDlg,
            book: book
        }));     
    }

    modifyBook = () => {
        let config = {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }
        let newBook = {
            id: this.state.book.id,
            title: document.getElementById("title-edit").value,
            rating: parseFloat(document.getElementById("rating-edit").value),
        };
        axios.put(this.props.host + this.props.port + "/book/" + this.state.book.id, newBook, config).then((response) => {            
            console.log(response)
            this.props.modifyBookHandler(this.state.book.id, newBook)
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
                        <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, book)}>Edit</Button>
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
                            <Label for="title-edit">Title</Label>
                            <Input id="title-edit" type="text" defaultValue={this.state.book.title} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rating-edit">Rating</Label>
                            <Input id="rating-edit" type="text" defaultValue={this.state.book.rating} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.modifyBook}>Modify book</Button>{' '}
                        <Button color="secondary" onClick={this.openEditBookDlg}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
