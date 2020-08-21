'use strict';

var express = require('express');
var router = express.Router();

var users = require('../controllers/users/users.authentication.server.controller'),
	auth = require('../controllers/users/users.authorization.server.controller'),
	password = require('../controllers/users/users.password.server.controller')


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

router.route('/update-phone/otp')
	.post(auth.hasAuthentcation(), users.sendOtpToUpdateMobileNumber);

// Facebook Signin
router
	.post('/auth/facebook', users.facebookSignin);

	router.route('/logout')
	.delete(auth.hasAuthentcation(), users.signOutAdmin)


router.route('/change-password')
.patch(auth.hasAuthentcation(), users.changePassword);

// router.route('/signout')
// .delete(auth.hasAuthentcation(), users.signOut)


router.route('/forgot-password')
	.post(password.forgot);

router.route('/auth/reset/:token')
	.get(password.validateResetToken);

// router.route('/auth/reset-password/:token')
// 	.post(password.reset);

router.route('/password/reset/:token')
	.patch(password.reset);

// router.route('/success')
// 	.get(password.success);

router.route('/verificationsuccess')
	.get(password.success)

router.route('/password-error')
	.get(password.error);
 
module.exports = router;
