'use strict';

module.exports = {
    table: require('./table'),
    map: require('./map'),
    card: require('./card'),
    text: [
        {
            '<>': 'div',
            'html': [
                {
                    '<>': 'h1',
                    'html': 'Header'
                },
                {
                    '<>': 'p',
                    'html': 'some text block'
                }
            ]
        }
    ]
};