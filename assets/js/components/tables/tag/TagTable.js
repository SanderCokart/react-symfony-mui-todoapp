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
    TableContainer, Paper,
} from '@material-ui/core';
//MUI ICONS
import {Edit as EditIcon, Done as DoneIcon, Close as CloseIcon} from '@material-ui/icons';
//CONTEXTS
import {TagContext} from '../../../contexts/TagContext';
//CUSTOM COMPONENTS
import AddTag from './AddTag';
import DeleteButton from './DeleteButton';
import ExtractTextFromMessage from '../../functions/ExtractTextFromMessage';


const TagTable = () => {
    const context = useContext(TagContext);
    const {tags, message} = context;

    const initialState = {tagEditId: null};

    const [state, setState] = useState(initialState);

    const setEdit = (e) => {
        setState({tagEditId: e.target.name ? e.target.name : null});
    };

    useEffect(() => {
        if (!context.tags) context.read();
    }, [context]);

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <AddTag/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tag Name</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tags ? tags.map((tag, index) => (
                        <TableRow key={tag.id}>
                            <TableCell><Typography>{tag.name}</Typography></TableCell>
                            <TableCell align="right">
                                {state.tagEditId !== tag.id ?
                                    <>
                                        <IconButton color="primary" name={tag.id} onClick={setEdit}>
                                            <EditIcon/>
                                        </IconButton>
                                        <DeleteButton entity={tag}/>
                                    </>
                                    :
                                    <>
                                        <IconButton color="primary">
                                            <DoneIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={setEdit}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </>
                                }
                            </TableCell>
                        </TableRow>
                    )) : null}

                    {context.isLoading &&
                     <TableRow><TableCell><Typography>Loading...</Typography></TableCell></TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TagTable;