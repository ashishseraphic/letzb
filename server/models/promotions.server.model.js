'use strict';

let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema,
    constant = require('../constansts')

let Promotion = new Schema({
       promotionImage:{
           type:String
       },
       promotionTitle:{
           type:String
       },
       promotionAddress:{
           type:String
       },
       promotionLocation:{
        type: Schema.Types.ObjectId,
        ref: 'category'
       },
       promotionDate:{
           type:String
       },
       promotionDescription:{
           type:String
       },
       promotionCreator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
       },
       promotionBy:{
        type: String,
        enum: [
          constant.EVENT_ROLE.USER,
          constant.EVENT_ROLE.VENDOR
       ],
       default:constant.EVENT_ROLE.VENDOR
       },
       isPromotionEnabled:{
           type: Boolean,
           default:false
       },
       isDeleted:{
           type:Boolean,
           default: false
       }
});


module.exports = mongoose.model('promotion', Promotion);