import React from 'react';
import TodoContextProvider from './TodoContext';
import TagContextProvider from './TagContext';

const Providers = (props) => {
    return (
        <TodoContextProvider>
            <TagContextProvider>
                {props.children}
            </TagContextProvider>
        </TodoContextProvider>
    );
};

export default Providers;