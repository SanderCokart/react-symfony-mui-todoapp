//REACT
import React from 'react';
import PropTypes from 'prop-types';
//MUI COMPONENTS
import {IconButton} from '@material-ui/core';
//MUI ICONS
import {Delete as DeleteIcon} from '@material-ui/icons';

const DeleteButton = props => {
    const onClick = (e) => {
        e.preventDefault();
        props.deleteFunction(props.entity);
    };

    return (
        <IconButton color="secondary" onClick={onClick}>
            <DeleteIcon/>
        </IconButton>
    );
};

DeleteButton.propTypes = {
    entity:         PropTypes.shape({id: PropTypes.number.isRequired}).isRequired,
    deleteFunction: PropTypes.func.isRequired,
};

export default DeleteButton;