import {CssBaseline} from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/Router';

class App extends React.Component {

    render() {
        return (
            <>
                <CssBaseline/>
                <Router/>
            </>
        );
    }
}

ReactDOM.render(
    <App/>
    ,
    document.getElementById('root'),
);