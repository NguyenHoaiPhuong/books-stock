import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import './app-button.css'

export default class AppButton extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             modal: false
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }
    
    render() {
        return (
            <div>
                <Button color="primary" className="AppButton" onClick={this.toggle}>Add New Book</Button>{' '}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
