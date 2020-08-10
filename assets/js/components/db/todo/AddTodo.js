import React, {useContext, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {IconButton, TextField} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {Add as AddIcon} from '@material-ui/icons';
import {TodoContext} from '../../providers/TodoContext';

const AddTodo = () => {
    const context = useContext(TodoContext);

    const initialState = {
        task:        '',
        description: '',
    };

    const [state, setState] = useState(initialState);

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (event) => {
        if (event !== undefined) event.preventDefault();


        context.createTodo(event, state);

        setState(initialState);
    };

    return (
        <form noValidate onSubmit={onSubmit}>
            <Grid container spacing={2} alignItems="center" justify="flex-end">
                <Grid item xs={12} sm={4}>
                    <TextField variant="outlined"
                               size="small"
                               type="text"
                               value={state.task}
                               label="Task"
                               name="task"
                               fullWidth={true}
                               onChange={handleChange}/>
                </Grid>
                <Grid item xs={12} sm={7}>
                    <TextField variant="outlined"
                               size="small"
                               type="text"
                               value={state.description}
                               label="Description"
                               name="description"
                               fullWidth={true}
                               multiline={true}
                               onChange={handleChange}

                               inputProps={{
                                   onKeyPress: (e) => {
                                       if (e.shiftKey && e.key === 'Enter') {
                                           e.preventDefault();
                                           onSubmit();
                                       }
                                   },
                               }}
                    />
                </Grid>
                <Grid item xs={12} sm={1}>
                    <Box textAlign="right">
                        <IconButton color="primary" onClick={onSubmit}>
                            <AddIcon/>
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
};

export default AddTodo;