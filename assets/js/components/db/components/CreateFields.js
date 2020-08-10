//REACT
import React, {useState} from 'react';
import PropTypes from 'prop-types';
//MUI COMPONENTS
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
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
import {Add as AddIcon, Close as CloseIcon} from '@material-ui/icons';
//CUSTOM COMPONENTS
import CheckType from '../../../functions/CheckType';
//LIBRARIES
import validator from 'validate.js';

const CreateFields = ({textFields, constraints, createFunction, entityName}) => {
    //HOOKS START
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    //HOOKS END

    //STATE START
    const initialState = {dialogIsOpen: false, errors: null};
    textFields.forEach(item => initialState[item.name] = item.type ? CheckType(item.type) : '');
    const [state, setState] = useState(initialState);
    //STATE END

    //FUNCTIONS START
    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const entity = {};

        textFields.forEach(item => {
            return entity[item.name] = state[item.name];
        });

        let errors = validator.validate(entity, constraints);

        if (validator.isEmpty(errors)) {
            createFunction(entity);
            setState(initialState);
        } else {
            setState({...state, errors: errors});
        }
    };


    const toggleCreateDialog = () => {
        setState({...state, dialogIsOpen: !state.dialogIsOpen});
    };
    //FUNCTIONS END

    return (
        <>
            {isMobile ?
                <Button size="large" variant="contained"
                        color="primary" fullWidth
                        onClick={toggleCreateDialog}>Create {entityName}</Button>
                :
                <IconButton onClick={toggleCreateDialog}
                            color="primary"><AddIcon/></IconButton>
            }


            <Dialog fullScreen={isMobile} fullWidth open={state.dialogIsOpen} onClose={toggleCreateDialog}
                    TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit"
                                    onClick={toggleCreateDialog}>
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" component="h2" className={classes.title}>
                            Create {entityName}
                        </Typography>
                        <Button size="large" type="submit" color="inherit" onClick={onSubmit}>
                            Create
                        </Button>
                    </Toolbar>
                </AppBar>

                <form noValidate onSubmit={onSubmit}>
                    <DialogContent>
                        <List>
                            {textFields.map((item, index) => (
                                <ListItem key={item.name}>
                                    <TextField variant="outlined"
                                               size={isMobile ? 'medium' : 'small'}
                                               type={item.type}
                                               value={state[item.name]}
                                               label={item.label}
                                               name={item.name}
                                               multiline={item.multiline}
                                               fullWidth
                                               required={item.required}
                                               helperText={state.errors ? state.errors[item.name].join('\n') : null}
                                               FormHelperTextProps={{style: {whiteSpace: 'pre'}}}
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
    entityName:     PropTypes.string,
    textFields:     PropTypes.arrayOf(PropTypes.shape({
        name:      PropTypes.string.isRequired,
        label:     PropTypes.string,
        required:  PropTypes.bool,
        multiline: PropTypes.bool,
        type:      PropTypes.oneOf(['text', 'number']),
    })).isRequired,
    constraints:    PropTypes.objectOf(PropTypes.shape(
        {
            presence: PropTypes.shape(
                {allowEmpty: PropTypes.bool}),
            length:   PropTypes.shape(
                {minimum: PropTypes.number, maximum: PropTypes.number},
            ),
        })),
    createFunction: PropTypes.func.isRequired,
};

export default CreateFields;