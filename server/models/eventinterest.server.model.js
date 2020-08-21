'use strict';

let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema,
    constant = require('../constansts')

let EventInterest = new Schema({
    eventId:{
        type: Schema.Types.ObjectId,
        ref:"event"
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
});


module.exports = mongoose.model('eventinterest', EventInterest);                  