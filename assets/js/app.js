//REACT
import React from 'react';
import ReactDOM from 'react-dom';
//CUSTOM COMPONENTS
import AppSnackbar from './components/AppSnackbar';
import TodoTable from './components/TodoTable';
import DefaultThemeProvider from './components/themes/DefaultThemeProvider';
import TodoContextProvider from './contexts/TodoContext';

class App extends React.Component {

    render() {
        return (
            <TodoContextProvider>
                <TodoTable/>
                <AppSnackbar/>
            </TodoContextProvider>
        );
    }
}

ReactDOM.render(
    <DefaultThemeProvider>
        <App/>
    </DefaultThemeProvider>
    , document.getElementById('root'));