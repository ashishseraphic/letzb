let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema;

let AnswersSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    answersArray: [{
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'questions'
        },
        answerId: {
            type: Schema.Types.ObjectId,
            ref: 'questions'
        }
    }],

});

module.exports = mongoose.model('answers', AnswersSchema);