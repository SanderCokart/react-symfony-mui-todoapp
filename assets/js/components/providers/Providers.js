import React from 'react';
import TodoContextProvider from './TodoContext';
import TagContextProvider from './TagContext';
import AlertContextProvider from './AlertContext';

const Providers = (props) => {
    return (
        <AlertContextProvider>
            <TodoContextProvider>
                <TagContextProvider>
                    {props.children}
                </TagContextProvider>
            </TodoContextProvider>
        </AlertContextProvider>
    );
};

export default Providers;