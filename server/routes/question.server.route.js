'use strict';

var express = require('express');
var router = express.Router();

var auth = require('../controllers/users/users.authorization.server.controller'),
	questions = require('../controllers/questions.server.controller.js')

router.route('/getquestions')
	.get(questions.getAllQuestions);

router.route('/saveanswers')
	.post(auth.hasAuthentcation(), questions.saveAnswerResponse);

router.route('/savequestion')
	.post(questions.saveQuestion);


module.exports = router;
