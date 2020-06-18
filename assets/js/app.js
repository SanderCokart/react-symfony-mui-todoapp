import {createMuiTheme, CssBaseline, MuiThemeProvider, responsiveFontSizes} from '@material-ui/core';
import {indigo, deepPurple, grey} from '@material-ui/core/colors';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/Router';
import '../css/app.css';

function App() {
    return <Router/>;
}

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: indigo,
        secondary: deepPurple,
    },
});

const responsiveTheme = responsiveFontSizes(theme);

ReactDOM.render(
    <>
        <MuiThemeProvider theme={responsiveTheme}>
            <CssBaseline/>
            <App/>
        </MuiThemeProvider>

    </>
    ,
    document.getElementById('root'),
);