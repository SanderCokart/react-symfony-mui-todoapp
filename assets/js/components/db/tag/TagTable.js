//REACT
import React, {useContext, useEffect, useState} from 'react';
//MUI COMPONENTS
import {
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
//MUI ICONS
import {Close as CloseIcon, Done as DoneIcon, Edit as EditIcon, Refresh as RefreshIcon} from '@material-ui/icons';
//CONTEXTS
import {TagContext} from '../../providers/TagContext';
//CUSTOM COMPONENTS
import CreateFields from '../components/CreateFields';
import DeleteButton from '../components/DeleteButton';
//CONFIG FILES
import textFields from './config/textFields.json';
import constraints from './config/textFields.constraints.json';

const TagTable = () => {
          //HOOKS START
          const context = useContext(TagContext);
          const {tags} = context;
          const theme = useTheme();
          const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
          //HOOKS END

          //STATE START
          useEffect(() => {
              if (!context.tags) context.read();
          }, [context]);

          const initialState = {tagEditId: null, tag: null};
          const [state, setState] = useState(initialState);
          //STATE END

          //FUNCTIONS START
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

          const onEditClose = () => {
              context.resetTag(state.tag);
              setState(initialState);
          };
          //FUNCTIONS END

          return (
              <TableContainer component={Paper}>
                  <Table size="small">
                      <TableHead>
                          <TableRow>
                              <TableCell colSpan={2}>
                                  <Grid container justify="flex-end" alignItems="center">
                                      <Grid item xs={isMobile}>
                                          <CreateFields entityName="tag" textFields={textFields} constraints={constraints}
                                                        createFunction={context.create}/>
                                      </Grid>
                                      <Grid item>
                                          <IconButton onClick={context.read}><RefreshIcon/></IconButton>
                                      </Grid>
                                  </Grid>
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
                                              <IconButton color="secondary" onClick={onEditClose}>
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
      }
;

export default TagTable;

