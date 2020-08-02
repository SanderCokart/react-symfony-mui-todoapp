//REACT
import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
//CONTEXT
import {TagContext} from '../../../contexts/TagContext';
//MUI COMPONENTS
import {Grid, TextField, Box, IconButton, useTheme, useMediaQuery, Button, Modal} from '@material-ui/core';
//MUI ICONS
import {Add as AddIcon, Refresh as RefreshIcon} from '@material-ui/icons';
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
    const context = useContext(TagContext);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const initialState = {modalOpen: false};

    props.textFields.forEach(item => initialState[item.name] = item.type ? CheckType(item.type) : '');

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

    const toggleModal = () => {

    };

    return (
        <form noValidate onSubmit={onSubmit}>
            <Box my={1}>

                <Modal open={state.modalOpen}>
                    {props.textFields.map((item, index) => (
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
                    ))}
                </Modal>


                {isMobile ?
                    <Button fullWidth size="large" variant="contained" color="primary"
                            onClick={onSubmit}>
                        Add Tag {state.name}
                    </Button>
                    :
                    <IconButton type="submit" color="primary" onClick={onSubmit}>
                        <AddIcon/>
                    </IconButton>
                }

                <IconButton color='inherit' onClick={context.read}>
                    <RefreshIcon/>
                </IconButton>

            </Box>
        </form>
    );
};

CreateFields.propTypes = {
    textFields: PropTypes.arrayOf(PropTypes.shape({
        name:      PropTypes.string,
        label:     PropTypes.string,
        type:      PropTypes.oneOf(['text', 'number']),
        multiline: PropTypes.bool,
    })),
};

CreateFields.defaultProps = {
    textFields: [
        {
            name:      'defaultName',
            label:     'defaultLabel',
            type:      'text',
            multiline: false,
        },
    ],
};

export default CreateFields;