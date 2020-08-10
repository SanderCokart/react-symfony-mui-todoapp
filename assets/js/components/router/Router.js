//REACT
import React from 'react';
//ROUTER
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Redirect from 'react-router-dom/Redirect';
//MUI COMPONENTS
import {makeStyles} from '@material-ui/core';
//CUSTOM COMPONENTS
import Navigation from './Navigation';
import Providers from '../providers/Providers';
import AlertComponent from '../modals/AlertComponent';
//PAGES
import NotFound from '../pages/NotFound';
import CrudTodo from '../pages/CrudTodo';
import CrudTag from '../pages/CrudTag';

const useStyles = makeStyles(theme => ({
    divider: theme.mixins.toolbar,
}));

const Router = () => {
    const classes = useStyles();
    return (
        <BrowserRouter>
            <Providers>
                <Navigation/>
                <div className={classes.divider}/>
                <Switch>
                    <Redirect exact from="/" to="/todo-list"/>
                    <Route exact path="/todo-list" component={CrudTodo}/>
                    <Route exact path="/tag-list" component={CrudTag}/>
                    <Route component={NotFound}/>
                </Switch>
                <AlertComponent/>
            </Providers>
        </BrowserRouter>
    );
};

export default Router;