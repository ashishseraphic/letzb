'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	// User = mongoose.model('User'),
	models = require('../../models'),
	async = require('async'),
	crypto = require('crypto'),
	// services = require('../../services'),
	nodemailer = require('nodemailer'),
	config = require('../../../config.server'),
	jwt = require('jsonwebtoken');

exports.forgot = function (req, res, next) {
	async.waterfall([
		// Generate random token
		function (done) {
			crypto.randomBytes(20, function (err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},

		function (token, done) {
			if (req.body.email) {
				models.users.findOne({
					email: req.body.email
				}, '-salt -password', function (err, user) {
					if (!user) {
						return res.status(400).send({
							success: false,
							message: 'No account with this email has been found.',
							statusCode:400
						});
						// } else if (user !== 'local') {
						// 	return res.status(400).send({
						// 		message: 'It seems like you signed up using your ' + user.email + ' account'
						// 	});
					}
					else if(user.isVerified == false)
					{
						return res.status(400).send({
							success: false,
							message: 'Cannot send Verification. Email Not Verified',
							statusCode:400
						});

					} 
					else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function (err) {
							done(err, token, user);
						});
					}
				});
			} else {
				return res.status(400).send({
					success: false,
					message: 'Username field must not be blank',
					statusCode:400
				});
			}
		},
		function (token, user, done) {
			console.log(`http://${req.headers.host}/auth/reset/${token}`);

			let emailHTML = `Hello ${user.firstName},
			You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
		  http://${req.headers.host}/auth/reset/${token} \n\n
		  Note: This link will expire in 1 hour \n\n
          'If you did not request this, please ignore this email and your password will remain unchanged.\n`
			done(null, emailHTML, user);
		},
		// If valid email, send reset email using service

		function (emailHTML, user, done) {
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: '',
					pass: ''
				}
			});

			var mailOptions = {
				from: '',
				to: user.email,
				subject: 'LetzBE Password Reset',
				html: emailHTML
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					res.status(200).send({
						success: true,
						message: 'An email has been sent to ' + user.email + ' with further instructions.',
						statusCode:200
					});
				}
				done(err);
			});
		}
	], function (err) {
		if (err) return next(err);
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
	let token = req.params.token;
	models.users.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function (err, user) {

		if (!user) {
			return res.redirect('/password/reset/invalid');
		}
		else {
			res.render('password-reset', {
				token
			})
			// res.redirect('/password/reset/' + req.params.token);
		}

	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	// console.log("yes in AUth")
	// console.log("passwordDetails", passwordDetails);


	async.waterfall([

		function (done) {
			models.users.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function (err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = req.body.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;


						user.save(function (err) {
							if (err) {
								return res.status(400).send({
									status: 0,
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								var token = jwt.sign({ data: user }, config.secret, {
									expiresIn: config.sessionExpire // in seconds
								});
								res.json({ status: 1, token: token });
								// res.render('password-changed', {
								// 	token
								// })
							}
						});
					} else {
						return res.status(400).send({
							status: 0,
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						status: 0,
						message: 'Password reset token is invalid or has expired.'
					});
				}
			});
		},
		function (user, done) {
			res.render('templates/reset-password-confirm-email', {
				name: user.displayName,
				appName: config.app.title
			}, function (err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function (emailHTML, user, done) {

			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: '',
					pass: ''
				}
			});

			var mailOptions = {
				from: '',
				to: user.email,
				subject: 'LetzBE Password Changed',
				html: emailHTML
			};
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					res.status(200).send({
						status: 1,
						message: 'Password Reset Successful'
					});
				}
			});

		}
	], function (err) {
		if (err) return next(err);
	});
};


exports.success = function (req, res) {
	// Init Variables
	res.render('password-changed')
};
exports.error = function (req, res) {
	// Init Variables
	res.render('password-error')
};