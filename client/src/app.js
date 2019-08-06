import React, { Component } from 'react';
import AppTable from './components/app-table';
import AppButton from './components/app-button';
import './app.css';


export default class App extends Component {
    render() {
        return (
            <div className="App">
                <AppButton />
                <AppTable />
            </div>
        )
    }
}