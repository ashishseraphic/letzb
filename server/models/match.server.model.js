let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema;

let MatchSchema = new Schema({
    whoMatched: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    withWhomMatched:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports = mongoose.model('match', MatchSchema);