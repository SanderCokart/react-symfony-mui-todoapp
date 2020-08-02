import React from 'react';

const CheckType = (type) => {
    switch (type) {
        case 'text':
            return '';
        case 'number':
            return 0;
        default:
            console.error('Unknown type given');
            return;
    }
};

export default CheckType;