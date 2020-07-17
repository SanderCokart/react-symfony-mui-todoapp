import React, {useContext, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {IconButton, TextField} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {Add as AddIcon} from '@material-ui/icons';
import {TodoContext} from '../contexts/TodoContext';

const AddTodo = () => {
    const context = useContext(TodoContext);
    const [addTodoName, setAddTodoName] = useState('');
    const [addTodoDescription, setAddTodoDescription] = useState('');

    const onCreateSubmit = (event) => {
        event.preventDefault();
        context.createTodo(event, {
            task:        addTodoName,
            description: addTodoDescription,
        });
        setAddTodoName('');
        setAddTodoDescription('');
    };

    return (
        <Grid container spacing={2} alignItems="center" justify="flex-end">
            <Grid item xs={12} sm={4}>
                <TextField variant="outlined"
                           size="small"
                           type="text"
                           value={addTodoName}
                           label="Task"
                           fullWidth={true}
                           onChange={(event) => {
                               setAddTodoName(event.target.value);
                           }}/>
            </Grid>
            <Grid item xs={12} sm={7}>
                <TextField variant="outlined"
                           size="small"
                           type="text"
                           value={addTodoDescription}
                           label="Description"
                           fullWidth={true}
                           multiline={true}
                           onChange={(event) => {
                               setAddTodoDescription(event.target.value);
                           }}

                           inputProps={{
                               onKeyPress: (e) => {
                                   if (e.key === 'Enter' && e.shiftKey) {
                                       onCreateSubmit();
                                   }
                               },
                           }}
                />
            </Grid>
            <Grid item xs={12} sm={1}>
                <Box textAlign="right">
                    <IconButton color="primary" onClick={onCreateSubmit}>
                        <AddIcon/>
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AddTodo;