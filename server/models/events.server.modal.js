'use strict';

let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema,
    constant = require('../constansts')

let Event = new Schema({
       eventImage:{
           type:String
       },
       eventTitle:{
           type:String
       },
       eventFee:{
           type:String
       },
       eventCategory:{
        type: Schema.Types.ObjectId,
        ref: 'category'
       },
       eventAddress:{
           type:String
       },
       eventLocation:{
        type: Schema.Types.ObjectId,
        ref: 'category'
       },
       eventTime:{
           type:String
       },
       eventDescription:{
           type:String
       },
       eventCreator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
       },
       eventLink:{
        type:String
       },
       eventBy:{
        type: String,
        enum: [
          constant.EVENT_ROLE.USER,
          constant.EVENT_ROLE.VENDOR
       ],
       default:constant.EVENT_ROLE.USER
       },
       eventAttendees:{
           type:Number,
           default:0
       },
       isEventEnabled:{
           type:Boolean,
           default:false
       },
       isDeleted:{
           type:Boolean,
           default:false
       }
});


module.exports = mongoose.model('event', Event);