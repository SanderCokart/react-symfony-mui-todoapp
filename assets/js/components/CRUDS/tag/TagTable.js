//REACT
import React, {useContext, useEffect, useState} from 'react';
//MUI COMPONENTS
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    TableContainer, Paper, TextField, useTheme, useMediaQuery,
} from '@material-ui/core';
//MUI ICONS
import {Edit as EditIcon, Done as DoneIcon, Close as CloseIcon, Refresh as RefreshIcon} from '@material-ui/icons';
//CONTEXTS
import {TagContext} from '../../../contexts/TagContext';
//CUSTOM COMPONENTS
import CreateFields from './CreateFields';
import DeleteButton from './DeleteButton';


const TagTable = () => {
    const context = useContext(TagContext);
    const {tags} = context;

    useEffect(() => {
        if (!context.tags) context.read();
    }, [context]);

    const initialState = {
        tagEditId: null,
        tag:       null,
    };
    const [state, setState] = useState(initialState);

    const setEdit = (tag) => {
        setState({
            tagEditId: tag.id ? tag.id : null,
            tag:       {...tag},
        });
    };

    const onEditSubmit = (e) => {
        e.preventDefault();
        context.update(state.tag);
        setState(initialState);
    };

    const onClose = () => {
        context.resetTag(state.tag);
        setState(initialState);
    };
    const createTextFields = [
        // {name: 'test1', label: 'Tag Name'},
        {name: 'test2', label: 'Tag Name'},
        {name: 'test3', label: 'Tag Name'},
        {name: 'test4', label: 'Tag Name'},
        {name: 'test5', label: 'Tag Name'},
        {name: 'test6', label: 'Tag Name'},
        {name: 'test7', label: 'Tag Name'},
        {name: 'test8', label: 'Tag Name'},
    ];


    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <CreateFields textFields={createTextFields}/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tag Name</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tags && tags.map(tag => (
                        <TableRow key={tag.id}>
                            <TableCell>
                                {state.tagEditId === tag.id ?
                                    <form noValidate onSubmit={onEditSubmit}>
                                        <TextField type="text" value={tag.name} name="name" fullWidth
                                                   autoFocus onChange={(e) => context.handleChange(tag, e)}/>
                                    </form>
                                    :
                                    <Typography>{tag.name}</Typography>
                                }
                            </TableCell>
                            <TableCell align="right">
                                {state.tagEditId !== tag.id ?
                                    <>
                                        <IconButton color="inherit" onClick={() => setEdit(tag)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <DeleteButton deleteFunction={context.delete} entity={tag}/>
                                    </>
                                    :
                                    <>
                                        <IconButton color="primary" onClick={onEditSubmit}>
                                            <DoneIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={onClose}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </>
                                }
                            </TableCell>
                        </TableRow>
                    ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TagTable;