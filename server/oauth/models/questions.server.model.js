let mongoose = require('./db.server.connect'),
    Schema = mongoose.Schema;

let QuestionSchema = new Schema({
    questionNumber: {
        type: Number
    },
    type: {
        type: String
    },
    question: {
        type: String
    },
    options: [
        {
            image: {
                type: String
            },
            title: {
                type: String
            }

        }
    ],
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('questions', QuestionSchema);

