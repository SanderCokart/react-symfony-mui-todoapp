import {makeStyles} from '@material-ui/core';
import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import TagContextProvider from '../contexts/TagContext';
import TodoContextProvider from '../contexts/TodoContext';
import TagTable from './TagTable';
import Navigation from './Navigation';
import NotFound from './NotFound';
import TodoTable from './TodoTable';
import Login from './Login';

const TodoList = () => (
    <TodoContextProvider>
        <TodoTable/>
    </TodoContextProvider>
);

const TagList = () => (
    <TagContextProvider>
        <TagTable/>
    </TagContextProvider>
);

const useStyles = makeStyles(theme => ({
    offset: theme.mixins.toolbar,
}));

function Router() {
    const classes = useStyles();
    return (
        <BrowserRouter>
            <Navigation/>
            <div className={classes.offset}/>
            <Switch>
                <Redirect exact from="/" to="/todo-list"/>
                <Route exact path="/todo-list" component={TodoList}/>
                <Route exact path="/category-list" component={TagList}/>
                <Route exact path="/login" component={Login}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Router;