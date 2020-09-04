import React from 'react';

/**
 * Array Cloner
 * @param array - array you want to copy
 * @returns {[]} - copy of the array
 * @constructor
 */
const CloneArray = (array) => {
    let newArray = [];
    for (let i = 0, arrayLength = array.length; i < arrayLength; i++) {
        newArray[i] = array[i];
    }
    return newArray;
};

export default CloneArray;