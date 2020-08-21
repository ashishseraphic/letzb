'use strict';

let mongoose = require('./db.server.connect'),
    constants = require('../constansts'),
	Schema = mongoose.Schema;

let CurrentSubscription = new Schema({
    userId:{
    type: Schema.Types.ObjectId,
    ref: 'User'
    },   
    subscriptionType:{
        type: Number,
        enum: [
          constants.SUBSCRIPTION_TYPES.BASIC,
          constants.SUBSCRIPTION_TYPES.BRONZE,
          constants.SUBSCRIPTION_TYPES.SILVER,
       ],
       default:constants.SUBSCRIPTION_TYPES.BASIC
    },
   
    expireAt:{
        type: Date
}
});

module.exports = mongoose.model('currentsubscription', CurrentSubscription );