import React, {useContext} from 'react';
import {Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {AlertContext} from '../../contexts/AlertContext';
import Typography from '@material-ui/core/Typography';
import ExtractTextFromMessage from '../functions/ExtractTextFromMessage';

const AlertComponent = () => {
    const context = useContext(AlertContext);
    let {text, level} = context.alert;

    if (text && level)
        return (
            <Snackbar color="primary" anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} autoHideDuration={5000}
                      open={context.open}
                      onClose={context.close}>
                <MuiAlert variant="filled"
                          severity={level}>
                    <Typography style={{whiteSpace: 'pre'}}>{typeof text !== 'string' ? text.join('\n') : text}</Typography>
                </MuiAlert>
            </Snackbar>
        );
    else return false;
};

export default AlertComponent;