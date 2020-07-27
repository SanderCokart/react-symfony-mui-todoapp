import React from 'react';

/**
 *
 * @param array {object} - array of objects
 * @returns {string[]} - array of strings
 * @constructor
 */
const ExtractTextFromMessage = (array) => {
    const textCollection = [];
    array.forEach(item => textCollection.push(item.text));
    return textCollection;
};


export default ExtractTextFromMessage;