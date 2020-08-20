var users = require('./users.server.model'),
    adminProfile =  require('./admin.profiles.server.model'),
    privacy = require('./privacy.server.model'),
    condition = require('./terms.server.model'),
    answers = require('./answers.server.model'),
    questions = require('./questions.server.model')
    models = {
        users,
        adminProfile,
        privacy,
        condition,
        answers,
        questions
    }
module.exports = models;