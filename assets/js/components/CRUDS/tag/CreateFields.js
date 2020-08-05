//REACT
import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
//CONTEXT
import {TagContext} from '../../../contexts/TagContext';
//MUI COMPONENTS
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    IconButton,
    List,
    ListItem,
    makeStyles,
    Slide,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
//MUI ICONS
import {Close as CloseIcon, Refresh as RefreshIcon} from '@material-ui/icons';
//CUSTOM COMPONENTS
import CheckType from '../../functions/CheckType';

/**
 *
 * @param props
 * @param {[]} props.textFields
 * @param {string} props.textFields.name - name should match the key of an entity
 * @param {string} props.textFields.label - any string
 * @param {string} props.textFields.type - text | number
 * @example [{name: 'name', label: 'label', type: 'text'}]
 * @returns {*}
 * @constructor
 */
const CreateFields = (props) => {
    //HOOKS START
    const context = useContext(TagContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    //HOOKS END

    //STATE START
    const initialState = {dialogIsOpen: false, errors: null};
    props.textFields.forEach(item => initialState[item.name] = item.type ? CheckType(item.type) : '');
    const [state, setState] = useState(initialState);
    //STATE END

    //FUNCTIONS START
    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const entity = {};
        props.textFields.forEach(item => [entity[item.name] = state[item.name]]);

        context.create(entity);
        setState(initialState);
    };

    const toggleCreateDialog = () => {
        setState({...state, dialogIsOpen: !state.dialogIsOpen});
    };
    //FUNCTIONS END

    return (
        <>
            <Grid container alignItems="center" spacing={1}>
                <Grid item xs>
                    <Button size="large" variant="contained" color="primary" fullWidth
                            onClick={toggleCreateDialog}>Create</Button>
                </Grid>
                <Grid item>
                    <IconButton color="inherit"><RefreshIcon/></IconButton>
                </Grid>
            </Grid>

            <Dialog fullScreen={isMobile} fullWidth open={state.dialogIsOpen} onClose={toggleCreateDialog}
                    TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={toggleCreateDialog}>
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" component="h2" className={classes.title}>
                            Create {props.entityName}
                        </Typography>
                        <Button size="large" type="submit" color="inherit" onClick={onSubmit}>
                            Save / Submit
                        </Button>
                    </Toolbar>
                </AppBar>

                <form noValidate onSubmit={onSubmit}>
                    <DialogContent>
                        <List>
                            {props.textFields.map((item, index) => (
                                <ListItem key={item.name}>
                                    <TextField variant="outlined"
                                               size={isMobile ? 'medium' : 'small'}
                                               type={item.type}
                                               value={state[item.name]}
                                               label={item.label}
                                               name={item.name}
                                               fullWidth
                                               autoFocus={index === 0}
                                               onChange={handleChange}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>

                    <DialogActions style={{display: 'none'}}>
                        <Button type="submit"/>
                    </DialogActions>
                </form>

            </Dialog>
        </>
    );
};

//EXTRA COMPONENTS
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

//STYLES
const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title:  {
        marginLeft: theme.spacing(2),
        flex:       1,
    },
}));

//PROPTYPES
CreateFields.propTypes = {
    textFields: PropTypes.arrayOf(PropTypes.shape({
        name:      PropTypes.string,
        label:     PropTypes.string,
        type:      PropTypes.oneOf(['text', 'number']),
        multiline: PropTypes.bool,
    })).isRequired,
    entityName: PropTypes.string.isRequired,
};

export default CreateFields;