//REACT
import React from 'react';
//MUI COMPONENTS
import {createMuiTheme, CssBaseline, MuiThemeProvider, responsiveFontSizes} from '@material-ui/core';
//MUI COLORS
import {green, red} from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        secondary: red,
        primary: green,
    },
});

const responsiveTheme = responsiveFontSizes(theme);

const DefaultThemeProvider = (props) => {
    return (
        <MuiThemeProvider theme={responsiveTheme}>
            <CssBaseline/>
            {props.children}
        </MuiThemeProvider>
    );
};

export default DefaultThemeProvider;