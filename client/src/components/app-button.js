import React, { Component } from 'react'
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button } from 'reactstrap'
import './app-button.css'

export default class AppButton extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             addBookDlg: false,
        }

        // Event binding
        this.openAddBookDlg = this.openAddBookDlg.bind(this);
        this.addNewBook = this.addNewBook.bind(this);
    }

    openAddBookDlg() {
        this.setState(prevState => ({
            addBookDlg: !prevState.addBookDlg
        }));
    }

    addNewBook() {
        const book = {
            id: document.getElementById("id").value,
            title: document.getElementById("title").value,
            rating: document.getElementById("rating").value
        };
        axios.post('http://localhost:9000/books', book).then((response) => {            
            console.log(response)
        })
        this.setState(prevState => ({
            addBookDlg: !prevState.addBookDlg,
        }));
    }
    
    render() {
        return (
            <div>
                <Button color="primary" className="AppButton" onClick={this.openAddBookDlg}>Add Book</Button>{' '}
                <Modal isOpen={this.state.addBookDlg} toggle={this.openAddBookDlg}>
                    <ModalHeader toggle={this.openAddBookDlg}>Add a new book</ModalHeader>
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
                        <Button color="primary" onClick={this.addNewBook}>Add book</Button>{' '}
                        <Button color="secondary" onClick={this.openAddBookDlg}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
