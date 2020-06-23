//REACT
import React from 'react';
import ReactDOM from 'react-dom';
//CUSTOM COMPONENTS
import Router from './components/Router';
import DefaultThemeProvider from './components/themes/DefaultThemeProvider';

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