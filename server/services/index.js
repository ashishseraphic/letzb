'use strict';

let sesMailService =  require('./sesEmail'), 
    utills = require('./utills'),
    services = { 
        utills,
        sesMailService
    };

module.exports = services;