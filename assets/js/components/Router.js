import React from 'react';
import {BrowserRouter, NavLink, Route, Switch, Redirect} from 'react-router-dom';
import TodoContextProvider from '../contexts/TodoContext';
import NotFound from './NotFound';
import TodoTable from './TodoTable';

export default function Router() {
    const TodoList = () => (
        <TodoContextProvider>
            <TodoTable/>
        </TodoContextProvider>
    );

    return (
        <BrowserRouter>
            <div>
                <ul>
                    <NavLink to="/todo-list">TodoList</NavLink>
                </ul>
                <Switch>
                    <Redirect exact from="/" to="/todo-list"/>
                    <Route exact path="/todo-list" component={TodoList}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}