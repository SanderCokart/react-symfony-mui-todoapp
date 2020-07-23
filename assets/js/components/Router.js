//REACT
import React from 'react';
//ROUTER
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Redirect from 'react-router-dom/Redirect';
//MUI COMPONENTS
import {makeStyles} from '@material-ui/core/styles';
//CUSTOM COMPONENTS
import NotFound from './NotFound';
import AppSnackbar from './AppSnackbar';
import Navigation from './Navigation';
import TodoTable from './TodoTable';
import TagTable from './tables/tag/TagTable';
import Providers from '../contexts/Providers';

const TodoList = () => (
    <div>
        <AppSnackbar/>
        <TodoTable/>
    </div>
);

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
                    <Route exact path="/todo-list" component={TodoList}/>
                    <Route exact path="/tag-list" component={TagTable}/>
                    <Route component={NotFound}/>
                </Switch>
            </Providers>
        </BrowserRouter>
    );
};

export default Router;