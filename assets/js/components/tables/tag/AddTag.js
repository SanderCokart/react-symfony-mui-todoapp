//REACT
import React, {useContext, useState} from 'react';
//CONTEXT
import {TagContext} from '../../../contexts/TagContext';
//MUI COMPONENTS
import {Grid, TextField, Box, IconButton, useTheme, useMediaQuery, Button} from '@material-ui/core';
//MUI ICONS
import {Add as AddIcon, Refresh as RefreshIcon} from '@material-ui/icons';


const AddTag = () => {
    const context = useContext(TagContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

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
            <Box my={1}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm>
                        <TextField variant="outlined"
                                   size={isMobile ? 'medium' : 'small'}
                                   type="text"
                                   value={state.name}
                                   label="Tag Name"
                                   name="name"
                                   fullWidth
                                   autoFocus
                                   onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                        {isMobile ?
                            <>
                                <Grid container spacing={1}>
                                    <Grid item xs>
                                        <Button fullWidth size="large" variant="contained" color="primary"
                                                onClick={onSubmit}>
                                            Add Tag {state.name}
                                        </Button>
                                    </Grid>

                                    <Grid item xs={'auto'}>
                                        < IconButton color='inherit' onClick={context.read}>
                                            <RefreshIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </>
                            :
                            <>
                                <IconButton type="submit" color="primary" onClick={onSubmit}>
                                    <AddIcon/>
                                </IconButton>
                                < IconButton color='inherit' onClick={context.read}>
                                    <RefreshIcon/>
                                </IconButton>
                            </>
                        }
                    </Grid>
                </Grid>
            </Box>
        </form>
    );
};

export default AddTag;