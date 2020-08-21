let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema;

let RightSwipeSchema = new Schema({
    whoRightSwiped: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    toWhomRightSwiped:{
        type:Schema.Types.ObjectId,
        ref:"User"
     }
});

module.exports = mongoose.model('rightswipe', RightSwipeSchema);