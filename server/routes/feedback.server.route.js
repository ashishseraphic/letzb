"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    feedback = require('../controllers/feedback.server.controller');

     router.route('/savefeedback')
    .post(auth.hasAuthentcation(), feedback.addFeedback)
    
module.exports = router