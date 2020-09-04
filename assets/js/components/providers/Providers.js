import React from 'react';
import TodoContextProvider from './TodoContext';
import AlertContextProvider from './AlertContext';
import NewTagContextProvider from './NewTagContext';

const Providers = (props) => {
    return (
        <AlertContextProvider>
            <TodoContextProvider>
                <NewTagContextProvider>
                    {props.children}
                </NewTagContextProvider>
            </TodoContextProvider>
        </AlertContextProvider>
    );
};

export default Providers;