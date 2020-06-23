import {makeStyles} from '@material-ui/core/styles';
import React from 'react';
import TodoContextProvider from '../contexts/TodoContext';
import AppSnackbar from './AppSnackbar';
import Navigation from './Navigation';
import TodoTable from './TodoTable';

const useStyles = makeStyles(theme => ({
    divider: theme.mixins.toolbar,
}));

const Router = () => {
    const classes = useStyles();
    return (
        <div>
            <Navigation/>
            <div className={classes.divider}/>
            <TodoContextProvider>
                <TodoTable/>
                <AppSnackbar/>
            </TodoContextProvider>
        </div>
    );
};

export default Router;