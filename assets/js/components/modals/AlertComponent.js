import React, {useContext} from 'react';
import {IconButton, Snackbar, Typography} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {AlertContext} from '../providers/AlertContext';
import {Close as CloseIcon} from '@material-ui/icons';

const AlertComponent = () => {
    const context = useContext(AlertContext);
    let {text, level} = context.alert;

    if (text && level)
        return (
            <Snackbar color="primary" anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                      open={context.open}
                      onClose={context.close}>
                <MuiAlert variant="filled"
                          severity={level}
                          action={<IconButton onClick={context.close}><CloseIcon/></IconButton>}>
                    <Typography style={{whiteSpace: 'pre-wrap'}}>{typeof text !== 'string'
                        ? text.join('\n')
                        : text}</Typography>
                </MuiAlert>
            </Snackbar>
        );
    else return false;
};

export default AlertComponent;