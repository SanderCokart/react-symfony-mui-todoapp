import React from 'react';
import ReactDOM from 'react-dom';
import TodoTable from './components/TodoTable';
import TodoContextProvider from './contexts/TodoContext';

class App extends React.Component {
    render() {
        return (
            <TodoContextProvider>
                <TodoTable/>
            </TodoContextProvider>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));