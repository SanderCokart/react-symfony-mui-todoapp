//REACT
import React, {useContext, useState} from 'react';
//CONTEXT
import {TagContext} from '../../../contexts/TagContext';
//MUI COMPONENTS
import {Grid, TextField, Box, IconButton} from '@material-ui/core';
//MUI ICONS
import {Add as AddIcon} from '@material-ui/icons';


const AddTag = () => {
    const context = useContext(TagContext);

    const initialState = {
        name: '',
    };

    const [state, setState] = useState(initialState);

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        context.create(state);
        setState(initialState);
    };

    return (
        <form noValidate onSubmit={onSubmit}>
            <Grid spacing={2} alignItems="center" justify="flex-end" container>
                <Grid item xs={12} sm={11}>
                    <TextField variant="outlined"
                               size="small"
                               type="text"
                               value={state.name}
                               label="Tag Name"
                               name="name"
                               fullWidth
                               autoFocus
                               onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={1}>
                    <Box textAlign="right">
                        <IconButton type="submit" color="primary" onClick={onSubmit}>
                            <AddIcon/>
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
};

export default AddTag;