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
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
} from '@material-ui/icons';
//CUSTOM COMPONENTS
import DeleteDialog from './DeleteDialog';

const useStyles = makeStyles(theme => ({
    thead: {
        backgroundColor: theme.palette.primary.main,
    },
}));


function TodoTable() {
    const context = useContext(TodoContext);
    const [addTodoName, setAddTodoName] = useState('');
    const [addTodoDescription, setAddTodoDescription] = useState('');
    const [editIsShown, setEditIsShown] = useState(false);
    const [editTodoName, setEditTodoName] = useState('');
    const [editTodoDescription, setEditTodoDescription] = useState('');
    const [deleteConfirmationIsShown, setDeleteConfirmationIsShown] = useState(false);
    const [todoToBeDeleted, setTodoToBeDeleted] = useState(null);

    const classes = useStyles();

    const onCreateSubmit = (event) => {
        event.preventDefault();
        context.createTodo(event, {task: addTodoName, description: addTodoDescription});
        setAddTodoName('');
        setAddTodoDescription('');
    };

    const onEditSubmit = (todoId, event) => {
        event.preventDefault();
        context.updateTodo({id: todoId, task: editTodoName, description: editTodoDescription});
        setEditIsShown(false);
    };

    return (
        <Fragment>

            <Table size="small">
                {/*HEAD*/}
                <TableHead>
                    {/*ADD*/}
                    <TableRow>
                        <TableCell>
                            <form onSubmit={onCreateSubmit}>
                                <TextField variant="outlined"
                                           type="text"
                                           size="small"
                                           value={addTodoName}
                                           onChange={(event) => {
                                               setAddTodoName(event.target.value);
                                           }}
                                           label="Task"
                                           fullWidth={true}/>
                            </form>
                        </TableCell>

                        <TableCell>
                            <form>
                                <TextField variant="outlined"
                                           size="small"
                                           type="text"
                                           value={addTodoDescription}
                                           onChange={(event) => {
                                               setAddTodoDescription(event.target.value);
                                           }}
                                           label="Description"
                                           fullWidth={true}
                                           multiline={true}/>
                            </form>
                        </TableCell>

                        <TableCell width={130} align="right">
                            <IconButton color="primary" onClick={onCreateSubmit}>
                                <AddIcon/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    <TableRow className={classes.thead}>
                        <TableCell width={200}>Task</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>


                {/*BODY*/}
                <TableBody>
                    {/*DATA*/}
                    {context.todos.slice().reverse().map((todo, index) => (
                        <TableRow key={'todo ' + index}>

                            {/*NAME*/}
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

                            {/*DESCRIPTION*/}
                            <TableCell>
                                {editIsShown === todo.id ?
                                 <TextField
                                     type="text"
                                     fullWidth={true}
                                     value={editTodoDescription}
                                     onChange={(event) => setEditTodoDescription(event.target.value)}
                                     multiline={true}
                                 />
                                                         :
                                 <Typography style={{whiteSpace: 'pre-wrap'}}>{todo.description}</Typography>
                                }
                            </TableCell>

                            <TableCell align="right">

                                {editIsShown === todo.id ?
                                 <Fragment>
                                     <IconButton onClick={onEditSubmit.bind(this, todo.id)}>
                                         <DoneIcon/>
                                     </IconButton>
                                     <IconButton onClick={() => setEditIsShown(false)}>
                                         <CloseIcon/>
                                     </IconButton>
                                 </Fragment>
                                                         :
                                 <Fragment>
                                     <IconButton color="primary" onClick={() => {
                                         setEditIsShown(todo.id);
                                         setEditTodoName(todo.task);
                                         setEditTodoDescription(todo.description);
                                     }}>
                                         <EditIcon/>
                                     </IconButton>

                                     <IconButton color="secondary" onClick={() => {
                                         setDeleteConfirmationIsShown(true);
                                         setTodoToBeDeleted(todo);
                                     }}>
                                         <DeleteIcon/>
                                     </IconButton>
                                 </Fragment>
                                }


                            </TableCell>
                        </TableRow>
                    ))}
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