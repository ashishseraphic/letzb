'use strict';

let mongoose = require('./db.server.connect'),
	Schema = mongoose.Schema;

let EventLocation = new Schema({
        locationName: {
            type:String
        },
        isDeleted:{
            type: Boolean,
            default: false
        }
});


module.exports = mongoose.model('eventlocation', EventLocation);