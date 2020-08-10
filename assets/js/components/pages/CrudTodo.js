import React from 'react';
import AppSnackbar from '../db/todo/AppSnackbar';
import TodoTable from '../db/todo/TodoTable';

const CrudTodo = () => {
    return (
        <>
            <AppSnackbar/>
            <TodoTable/>
        </>
    );

};

export default CrudTodo;