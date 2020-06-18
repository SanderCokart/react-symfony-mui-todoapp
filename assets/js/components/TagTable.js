import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableContainer,
    useTheme,
    Typography, Card, CardContent,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import React, {useContext} from 'react';
import {TagContext} from '../contexts/TagContext';

const TagTable = () => {
    const tagContext = useContext(TagContext);
    const theme = useTheme();

    const MyPaper = (props) => (
        <Paper {...props} square elevation={10}/>
    );

    return (
        <TableContainer component={MyPaper}>
            {tagContext.isLoading ?
             <Typography variant="h1" align="center">Loading...</Typography>
                                  :
             <Table>
                 <TableHead style={{backgroundColor: theme.palette.primary.light}}>
                     <TableRow>
                         <TableCell>Name</TableCell>
                     </TableRow>
                 </TableHead>
                 <TableBody>
                     {tagContext.tags.map(tag => (
                         <TableRow key={tag.id}>
                             <TableCell>{tag.name}</TableCell>
                         </TableRow>
                     ))}
                 </TableBody>
             </Table>
            }

        </TableContainer>

    );
};

export default TagTable;