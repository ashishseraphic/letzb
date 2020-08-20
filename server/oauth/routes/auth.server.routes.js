'use strict';

var express = require('express');
var router = express.Router();

var users = require('../controllers/users/users.authentication.server.controller'),
	userscrud = require('../controllers/users/users.crud.server.controller'),
	auth = require('../controllers/users/users.authorization.server.controller'),
	userPassword = require('../controllers/users/users.password.server.controller'),
	questions = require('../controllers/users/questions.server.controller'),
	privacy = require('../controllers/users/static')


router.route('/signup/otp')
	.post(users.sendOtpForSignup);

router.route('/signin/otp')
	.post(users.sendOtpForSignin);	

router.route('/signup')
	.post(users.signup);

router.route("/signin")
	.post(users.signin);

router.route('/signup/vendor')
	.post(users.signupVendor);	

// Facebook Signin
router
	.post('/auth/facebook', users.facebookSignin);

router.route('/getquestions')
	.get(questions.getAllQuestions);

	router.route('/saveanswers')
	.post(auth.hasAuthentcation(), userscrud.saveResponse);

	router.route('/savequestion')
	.post(questions.saveQuestion);

	router.route('/saveoptions/:id')
	.post(questions.saveOption);



// router.route('/privacy')
// 	.get(privacy.getPrivacyPolicy);

// router.route('/terms')
// 	.get(privacy.getTermsAndConditions);

module.exports = router;
