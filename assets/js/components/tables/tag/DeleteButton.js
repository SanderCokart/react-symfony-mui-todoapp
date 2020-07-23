//REACT
import React, {useContext} from 'react';
import PropTypes from 'prop-types';
//MUI COMPONENTS
import IconButton from '@material-ui/core/IconButton';
//MUI ICONS
import {Delete as DeleteIcon} from '@material-ui/icons';
//CONTEXT
import {TagContext} from '../../../contexts/TagContext';

const DeleteButton = props => {
    const context = useContext(TagContext);

    const onClick = (e) => {
        e.preventDefault();
        context.delete(props.entity);
    };

    return (
        <IconButton color="secondary" onClick={onClick}>
            <DeleteIcon/>
        </IconButton>
    );
};

DeleteButton.propTypes = {
    entity: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
};

export default DeleteButton;