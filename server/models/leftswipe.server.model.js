let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema;

let LeftSwipSchema = new Schema({
    whoLeftSwiped: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    toWhomLeftSwiped:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports = mongoose.model('leftswipe', LeftSwipSchema);