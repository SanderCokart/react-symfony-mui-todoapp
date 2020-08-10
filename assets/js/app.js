//REACT
import React from 'react';
import ReactDOM from 'react-dom';
//CUSTOM COMPONENTS
import Router from './components/router/Router';
import DefaultThemeProvider from './components/themes/DefaultThemeProvider';
//FONTS
import 'fontsource-roboto/300.css';
import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';
import 'fontsource-roboto/700.css';

class App extends React.Component {

    render() {
        return <Router/>;
    }
}

ReactDOM.render(
    <DefaultThemeProvider>
        <App/>
    </DefaultThemeProvider>
    , document.getElementById('root'));