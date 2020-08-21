'use strict';

let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema

let Feedback = new Schema({
    userId:
    {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    },
    isDeleted:{
        type: Boolean,
        default:false

    }

});


module.exports = mongoose.model('feedback', Feedback);                  