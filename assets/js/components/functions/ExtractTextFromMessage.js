import React from 'react';

const ExtractTextFromMessage = (array) => {
    const textCollection = [];
    array.forEach(message => textCollection.push(message.text));
    return textCollection;
};

export default ExtractTextFromMessage;