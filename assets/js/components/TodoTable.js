//REACT
import React, {Fragment, useContext, useState} from 'react';
//CONTEXT
import {TodoContext} from '../contexts/TodoContext';
//MUI COMPONENTS
import {
    makeStyles,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@material-ui/core';
//MUI ICONS
import {
    Close as CloseIcon,
    Done as DoneIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
//CUSTOM COMPONENTS
import DeleteDialog from './DeleteDialog';
import AddTodo from './AddTodo';

const useStyles = makeStyles(theme => ({
    thead: {
        backgroundColor: theme.palette.primary.main,
    },
}));


function TodoTable() {
    const context = useContext(TodoContext);
    const [editIsShown, setEditIsShown] = useState(false);
    const [editTodoName, setEditTodoName] = useState('');
    const [editTodoDescription, setEditTodoDescription] = useState('');
    const [deleteConfirmationIsShown, setDeleteConfirmationIsShown] = useState(false);
    const [todoToBeDeleted, setTodoToBeDeleted] = useState(null);

    const classes = useStyles();


    const onEditSubmit = (todoId, event) => {
        if (event !== undefined) event.preventDefault();

        context.updateTodo({
            id:          todoId,
            task:        editTodoName,
            description: editTodoDescription,
        });
        setEditIsShown(false);
    };

    return (
        <Fragment>
            <Table size="small">
                {/*HEAD*/}
                <TableHead>

                    {/*ADD*/}
                    <TableRow>
                        <TableCell colSpan={3}>
                            <AddTodo/>
                        </TableCell>
                    </TableRow>
                    {/*END OF ADD*/}

                    {/*COLUMN NAMES*/}
                    <TableRow className={classes.thead}>
                        <TableCell width={200}>Task</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    {/*END OF COLUMN NAMES*/}

                </TableHead>
                {/*END OF HEAD*/}


                {/*BODY*/}
                <TableBody>
                    {/*DATA*/}
                    {context.todos.slice().reverse().map((todo, index) => (
                        <TableRow key={todo.id}>

                            {/*TASK*/}
                            <TableCell>
                                {editIsShown === todo.id ?
                                    <form onSubmit={onEditSubmit.bind(this, todo.id)}>
                                        <TextField
                                            type="text"
                                            fullWidth={true}
                                            autoFocus={true}
                                            value={editTodoName}
                                            onChange={(event) => {
                                                setEditTodoName(event.target.value);
                                            }}
                                        />
                                    </form>
                                    :
                                    <Typography>{todo.task}</Typography>
                                }
                            </TableCell>
                            {/*END OF TASK*/}

                            {/*DESCRIPTION*/}
                            <TableCell>
                                {editIsShown === todo.id ?
                                    <TextField
                                        type="text"
                                        fullWidth={true}
                                        value={editTodoDescription}
                                        onChange={(event) => setEditTodoDescription(event.target.value)}
                                        multiline={true}
                                        inputProps={{
                                            onKeyPress: (e) => {
                                                if (e.shiftKey && e.key === 'Enter') {
                                                    e.preventDefault();
                                                    onEditSubmit(todo.id);
                                                }
                                            },
                                        }}
                                    />
                                    :
                                    <Typography style={{whiteSpace: 'pre-wrap'}}>{todo.description}</Typography>
                                }
                            </TableCell>
                            {/*END OF DESCRIPTION*/}


                            {/*ACTIONS*/}
                            <TableCell align="right">
                                {editIsShown === todo.id ?
                                    <Fragment>
                                        <IconButton color="primary" onClick={onEditSubmit.bind(this, todo.id)}>
                                            <DoneIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => setEditIsShown(false)}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <IconButton color="inherit" onClick={() => {
                                            setEditIsShown(todo.id);
                                            setEditTodoName(todo.task);
                                            setEditTodoDescription(todo.description);
                                        }}>
                                            <EditIcon/>
                                        </IconButton>

                                        <IconButton color="primary" onClick={() => {
                                            setDeleteConfirmationIsShown(true);
                                            setTodoToBeDeleted(todo);
                                        }}>
                                            <DoneIcon/>
                                        </IconButton>
                                    </Fragment>
                                }


                            </TableCell>
                            {/*END OF ACTIONS*/}

                        </TableRow>
                    ))}
                    {/*END OF DATA*/}
                </TableBody>
            </Table>

            {deleteConfirmationIsShown && (
                <DeleteDialog todo={todoToBeDeleted}
                              open={deleteConfirmationIsShown}
                              setDeleteConfirmationIsShown={setDeleteConfirmationIsShown}
                />
            )}

        </Fragment>
    );
}

export default TodoTable;