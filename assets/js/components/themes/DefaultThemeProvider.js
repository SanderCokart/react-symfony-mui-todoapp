import React from 'react';
import {createMuiTheme, CssBaseline, MuiThemeProvider} from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const DefaultThemeProvider = (props) => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            {props.children}
        </MuiThemeProvider>
    );
};

export default DefaultThemeProvider;