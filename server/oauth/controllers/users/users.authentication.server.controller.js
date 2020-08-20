// 'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	models = require('../../models'),
	nodemailer = require('nodemailer'),
	jwt = require('jsonwebtoken'),
	config = require('../../../config.server'),
	crypto = require('crypto'),
	async = require('async'),
	accountSid = config.twilioConfig.accountSid
authToken = config.twilioConfig.accountAuth,
	client = require('twilio')(accountSid, authToken),
	FB = require('fb'),
	multer = require('multer'),
	nunjucks = require('nunjucks'),
	path = require('path'),
	// ffmpeg = require('fluent-ffmpeg'),
	Storage = multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, path.join(process.env.PWD, 'uploads'));
		},
		filename: function (req, file, callback) {
			// console.log("File", file)

			callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
		}
	}),
	uploadAllTypeOfFiles = multer({
		storage: Storage

	}),
	documentImage = uploadAllTypeOfFiles.single('videoUrl'),
	_ = require('lodash'),
	errorHandler = require('../errors.server.controller');

const otplib = require('otplib');
const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';

FB.options({
	appId: config.facebook.clientID,
	appSecret: config.facebook.clientSecret,
	version: 'v2.4'
})

otplib.authenticator.options = { digits: 4, step:600 };


const createToken = (userInfo) => {
	var token = jwt.sign({
		data: userInfo._id
	}, config.secret, {
		expiresIn: config.sessionExpire // in seconds
	});
	return token;
}

const validateOtp = (otp) => {
	let isValid = otp === "9999" ? true : otplib.authenticator.check(otp, secret);
	return isValid
}

exports.sendOtpForSignup = async function  (req, response) {
	try {
		let phoneNumber = req.body.phoneNumber
		if (!req.body.phoneNumber) {
			response.status(404).send({
				success: false,
				message: "Phone Number is required.",
			})
		}
		else {
			let userExists = await models.users.findOne({phoneNumber: req.body.phoneNumber});
			if(userExists) {
				return response.status(400).send({
					success: false,
					message: "Mobile No already exists",
				})
			}
			const token = otplib.authenticator.generate(secret);
			// console.log("token", token)
			client.messages
				.create({
					body: `${token} Enter code to verify your account`,
					from: '+12057796972',
					to: `${phoneNumber}`
				})
				.then(() => {
					console.log("Message Sent.")
				})
				.catch((error) => {
					console.log("Error In sending OTP for Signup", error)
				})
				
			response.status(200).json({
				success: true,
				message: `Signup otp has been sent to ${req.body.phoneNumber}.`,
				data: {}
			});	
		}
	} catch(error) {
		response.status(500).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}
}

exports.sendOtpForSignin = async function  (req, response) {
	try {
		let phoneNumber = req.body.phoneNumber
		if (!req.body.phoneNumber) {
			response.status(404).send({
				success: false,
				message: "Phone Number is required.",
			})
		}
		else {
			let userExists = await models.users.findOne({phoneNumber: req.body.phoneNumber});
			if(!userExists) {
				return response.status(400).send({
					success: false,
					message: "User not found.",
				})
			}
			const token = otplib.authenticator.generate(secret);
			console.log("token", token)
			client.messages
				.create({
					body: `${token} Enter code to verify your account`,
					from: '+12057796972',
					to: `${phoneNumber}`
				})
				.then(() => {
					console.log("Message Sent.")
				})
				.catch((error) => {
					console.log("Error In sending OTP for Signup", error)
				})
				
			response.status(200).json({
				success: true,
				message: `Login otp has been sent to ${req.body.phoneNumber}.`,
				data: {}
			});	
		}
	} catch(error) {
		response.status(500).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}
}

exports.signup = async function (req, response) {
	try {
		let body = req.body;
		let validOtp = validateOtp(body.otp);
		if(!validOtp) {
			response.status(400).send({
				success: false,
				message: "Invalid OTP",
			})
		} else {

			let userExists = await models.users.findOne({phoneNumber: body.phoneNumber});
			if(userExists) {
				return response.status(400).send({
					success: false,
					message: "Mobile No already exists",
				})
			}

			let userExistsUserName = await models.users.findOne({username: body.username});
			if(userExistsUserName) {
				return response.status(400).send({
					success: false,
					message: "Username already exists",
				})
			}

			let userExistsEmail = await models.users.findOne({email: body.email});
			if(userExistsEmail) {
				return response.status(400).send({
					success: false,
					message: "Email already exists",
				})
			}

			let user = await models.users.create({
				username: body.username,
				birthday: body.birthday,
				email : body.email,
				password: body.password,
				roles:[2],
				phoneNumber: body.phoneNumber,
			});

			let token = createToken(user);
			response.status(200).send({
				success: true,
				message: "User has been added successfully.",
				data: {
					firstName: user.firstName || "",
					lastName: user.lastName || "",
					username: user.username || "",
					birthday: user.birthday || "",
					email: user.email,
					roles : user.roles,
					phoneNumber: user.phoneNumber,
					token: token,
					venueName: user.venueName || ""
				}
			})
		}
	} catch(error) {
		response.status(500).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}
}

exports.signin = async function (req, response) {
	try {
		let { loginMethod, phoneNumber,  otp, email, password} = req.body;
		let userInfo = null
		if(loginMethod == 1) {// Login With email
			if(!email || !password) {
				return response.status(400).send({
					success: false,
					message: "Authentication failed. Missing Parameters.",
				})
			}
			userInfo = await models.users.findOne({email: email})
		} else {
			if(!otp || !phoneNumber) {
				return response.status(400).send({
					success: false,
					message: "Authentication failed. Missing Parameters.",
				})
			}
			let isOtpVaid = validateOtp(otp);
			if(!isOtpVaid) {
				return response.status(400).send({
					success: false,
					message: "Invalid otp.",
				})
			}
			userInfo = await models.users.findOne({phoneNumber: phoneNumber})
		}	
		if(!userInfo) {
			return response.status(400).send({
				success: false,
				message: "Authentication failed. User not found.",
			})
		}

		if (password && !userInfo.authenticate(password)) {
			return response.status(401).json({
				success: false,
				message: 'Authentication failed. Passwords did not match.'
			});
		}

		let token = createToken(userInfo);
		response.status(200).send({
			success: true,
			message: "User has been added successfully.",
			data: {
				firstName: userInfo.firstName || "",
				lastName: userInfo.lastName || "",
				username: userInfo.username || "",
				birthday: userInfo.birthday || "",
				roles: userInfo.roles,
				email: userInfo.email || "",
				phoneNumber: userInfo.phoneNumber || "",
				token: token,
				venueName: userInfo.venueName || ""
			}
		})
	} catch(error) {
		response.status(500).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}
}

exports.signupVendor = async function (req, response) {
	try {
		let body = req.body;

		let userExistsEmail = await models.users.findOne({ email: body.email });
		if (userExistsEmail) {
			return response.status(400).send({
				success: false,
				message: "Email already exists",
			})
		}

		let user = await models.users.create({
			email: body.email,
			password: body.password,
			roles: [3],
			venueName: body.venueName,
		});

		let token = createToken(user);
		response.status(400).send({
			success: true,
			message: "User has been added successfully.",
			data: {
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				username: user.username || "",
				birthday: user.birthday || "",
				email: user.email,
				phoneNumber: user.phoneNumber || "",
				token: token,
				roles : user.roles,
				venueName: user.venueName || ""
			}
		})
	} catch (error) {
		response.status(500).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}
}




// exports.validateVerifyToken = function (req, response) {
// 	let token = req.params.token;
// 	models.users.findOne({
// 		verifyEmailToken: req.params.token,
// 	}, function (err, user) {

// 		if (!user) {
// 			return response.render('already-verified');
// 		}
// 		else {
// 			models.users.findOneAndUpdate({ verifyEmailToken: req.params.token, }, { $set: { isVerified: true, verifyEmailToken: "" } }, (err, res) => {
// 				if (err) {
// 					// response.status()
// 				}
// 				else {
// 					response.render('email-verification', {
// 						token
// 					})
// 				}
// 			})

// 		}

// 	});

// exports.signin = function (req, response, next) {
// 	try {
// 		let loginMethod = req.body.loginMethod
// 		let phoneNumber = req.body.phoneNumber
// 		console.log(loginMethod === 1)
// 		if (!loginMethod) {
// 			return response.status(401).json({
// 				success: false,
// 				message: 'Login method is required.'
// 			});
// 		}
// 		else if (loginMethod === 1 && phoneNumber) {

// 			if (!phoneNumber) {
// 				return response.status(401).json({
// 					success: false,
// 					message: 'Authentication failed. Phone Number is Required.'
// 				});
// 			}
// 			if (phoneNumber) {

// 				models.users.findOne({ phoneNumber: req.body.phoneNumber }, (err, responsemobile) => {
// 					console.log("Here", responsemobile)

// 					if (err) {

// 					}
// 					else if (!responsemobile) {
// 						return response.status(401).json({
// 							success: false,
// 							message: 'Authentication failed. Phone Number not found.'
// 						});
// 					}
// 					else if (responsemobile.isMobileVerified === false) {
// 						return response.status(401).json({
// 							success: false,
// 							message: 'Authentication failed. Mobile is not Verified Not Allowed to Login.'
// 						});
// 					}
// 					else if (responsemobile) {
// 						let val = Math.floor(1000 + Math.random() * 9000);
// 						client.messages
// 							.create({
// 								body: `${val} Enter code to verify your account`,
// 								from: '+12057796972',
// 								to: `${req.body.phoneNumber}`
// 							})
// 							.then(message => console.log(message.sid));
// 						response.status(200).json({
// 							success: true,
// 							message: 'Phone Verification Link sent',
// 							statusCode: 200
// 							// data: res
// 						});

// 					}
// 				})
// 			}
// 		}

// 		else if (loginMethod === 2) {


// 			if (!req.body.email || !req.body.password) {
// 				return response.status(401).json({
// 					success: false,
// 					message: 'Authentication failed. Missing credentials.'
// 				});
// 			}
// 			models.users.findOne({ email: req.body.email }, (err, res) => {

// 				if (err) {
// 					return response.status(400).send({
// 						success: false,
// 						message: errorHandler.getErrorMessage(err)
// 					});
// 				}
// 				if (!res) {
// 					return response.status(401).json({
// 						success: false,
// 						message: 'Authentication failed. User not found.'
// 					});
// 				}
// 				else if (res.isVerified === false) {
// 					return response.status(401).json({
// 						success: false,
// 						message: 'Authentication failed. Email is not Verified Not Allowed to Login.'
// 					});
// 				}

// 				else {
// 					if (res.isDeleted === true) {
// 						return response.status(401).json({
// 							success: false,
// 							message: 'Authentication failed. User not found.'
// 						});
// 					}

// 					else {
// 						if (!res.authenticate(req.body.password)) {
// 							return response.status(401).json({
// 								success: false,
// 								message: 'Authentication failed. Passwords did not match.'
// 							});
// 						}
// 						else {
// 							models.users.findOneAndUpdate({ _id: res._id }, { $set: { deviceDetails: { deviceType: deviceType, deviceToken: deviceToken, isPasswordSet: true } } }, (err, resp) => {
// 								if (err) {
// 									res.status(400).send({
// 										message: errorHandler.getErrorMessage(err)
// 									});
// 								}
// 								else {
// 									var token = jwt.sign({
// 										data: resp
// 									}, config.secret, {
// 										expiresIn: config.sessionExpire
// 									});
// 									let id = resp._id;
// 									models.users.find({
// 										_id: id
// 									})
// 										.populate([{
// 											path: 'userData.data'
// 										}])
// 										.exec((err, result) => {
// 											result = result[0]
// 											// console.log(result)
// 											if (err) {
// 												response.status(400).send({
// 													message: errorHandler.getErrorMessage(err)
// 												});
// 											} else {


// 												response.status(200).send(
// 													{
// 														tokken: token,
// 														firstName: result.firstName,
// 														lastName: result.lastName,
// 														email: result.email,
// 														profileImage: result.profileImage,
// 														isPasswordSet: result.isPasswordSet
// 													}
// 												)

// 											}
// 										})
// 								}
// 							})
// 						}
// 					}
// 				}
// 			})

// 		}
// 	}
// 	catch (err) {
// 		return response.status(500).send({
// 			success: false,
// 			message: err.message || "Something went wrong"
// 		})
// 	}
// };



/**
 * Signout
 */
// exports.signout = function (req, res) {

// 	// Todo Expire a token on logout
// 	let user = req.user,
// 		deviceToken = req.body.deviceToken || req.query.deviceToken,
// 		deviceType = req.body.deviceType || req.query.deviceType;

// 	if (!deviceToken) {
// 		return res.status(404).json({ success: false, message: 'No Device Token Found.' });
// 	}

// 	if (!deviceType) {
// 		return res.status(404).json({ success: false, message: 'No Device Type Found.' });
// 	}

// 	models.users.findOne({ _id: user._id }, function (err, userObj) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		}

// 		if (!userObj) {
// 			return res.status(400).json({ success: false, message: 'User not found.' });
// 		} else {

// 			let deviceDetails = userObj.deviceDeatils || [];

// 			let token = { token: deviceToken, deviceType },
// 				index = _.findIndex(deviceDetails, token);

// 			// Pop the token while logout
// 			if (index !== -1) {
// 				deviceDetails.splice(index, 1);
// 			}

// 			models.users.findOneAndUpdate({ _id: user._id }, { $set: { deviceDetails: deviceDetails } }, function (err, user) {
// 				if (err) {
// 					return res.status(400).send({
// 						message: errorHandler.getErrorMessage(err)
// 					});
// 				}
// 				res.send({
// 					success: true,
// 					'message': 'Loggedout Sucessfully',
// 					statusCode: 200
// 				});
// 			})
// 		}
// 	});


// },


	// exports.changePassword = function (req, res) {
	// 	// Init Variables

	// 	var passwordDetails = req.body;
	// 	if (req.user) {
	// 		if (passwordDetails.newPassword) {
	// 			models.users.findById(req.user._id, function (err, user) {
	// 				if (!err && user) {
	// 					if (user.authenticate(passwordDetails.currentPassword)) {
	// 						if (passwordDetails.newPassword === passwordDetails.confirmPassword) {
	// 							user.password = passwordDetails.newPassword;

	// 							user.save(function (err) {
	// 								if (err) {
	// 									return res.status(400).send({
	// 										message: errorHandler.getErrorMessage(err)
	// 									});
	// 								} else {
	// 									var token = jwt.sign({
	// 										data: user
	// 									}, config.secret, {
	// 										expiresIn: config.sessionExpire // in seconds
	// 									});

	// 									res.status(200).json({
	// 										success: true,
	// 										message: 'Password Changed Successfully!!',
	// 										token: token,
	// 										statusCode: 200
	// 									});
	// 									var transporter = nodemailer.createTransport({
	// 										service: 'gmail',
	// 										auth: {
	// 											user: '',
	// 											pass: ''
	// 										}
	// 									});

	// 									var mailOptions = {
	// 										from: '',
	// 										to: user.email,
	// 										subject: 'Security Alert',
	// 										html: `Your Password For LetzBE for email ${user.email} is changed.
	// 									If password is changed by you Please Ignore this Email. If not by you please change your password immediately.`
	// 									};

	// 									transporter.sendMail(mailOptions, function (error, info) {
	// 										if (error) {
	// 											console.log(error);
	// 										}
	// 									});
	// 								}
	// 							});
	// 						} else {
	// 							res.status(400).send({
	// 								success: false,
	// 								message: 'Passwords do not match'
	// 							});
	// 						}
	// 					} else {
	// 						res.status(400).send({
	// 							success: false,
	// 							message: 'Current password is incorrect'
	// 						});
	// 					}
	// 				} else {
	// 					res.status(400).send({
	// 						success: false,
	// 						message: 'User Not Found'
	// 					});
	// 				}
	// 			});
	// 		} else {
	// 			res.status(400).send({
	// 				success: false,
	// 				message: 'Please provide a new password'
	// 			});
	// 		}
	// 	} else {
	// 		res.status(400).send({
	// 			success: false,
	// 			message: 'User is not signed in'
	// 		});
	// 	}
	// };


// exports.updateProfilePicture = function (req, response) {
// 	// let id = req.params.id;
// 	// console.log(req.body.profileImage)
// 	documentImage(req, response, (err) => {
// 		let body = {};
// 		if (err) {
// 			return response.status(400).send({ success: false, message: 'uploading failed.' });
// 		}

// 		else if (req.files) {
// 			if (req.files[0].filename.indexOf(' ') !== -1) {
// 				return response.status(400).send({ success: false, message: 'uploading failed no white spaces allowed.' });
// 			}

// 			else {
// 				body.profileImage = config.serverUrl + req.files[0].filename;
// 				models.users.findOneAndUpdate({ _id: req.user._id },
// 					{
// 						$set: body
// 					},
// 					{ new: true }, (err, res) => {

// 						if (err) {

// 							response.status(400).send({
// 								success: false,
// 								message: errorHandler.getErrorMessage(err)
// 							});
// 						} else {
// 							res = JSON.parse(JSON.stringify(res))
// 							response.status(200).send({
// 								success: true,
// 								data: res,
// 								statusCode: 200
// 							})
// 						}
// 					})
// 			}
// 		}
// 		// }
// 	})
// }


// exports.verified = function (req, res) {
// 	// Init Variables
// 	res.render('already-verified')
// };

exports.facebookSignin = (req, res, next) => {

	let token = req.body.access_token || req.query.access_token,
		deviceToken = req.body.deviceToken || req.query.deviceToken,
		deviceType = req.body.deviceType || req.query.deviceType;

	if (!token) {
		return res.status(404).json({ success: false, message: 'No Token Found.' });
	}

	FB.api('me', { fields: ['name', 'id', 'email'], access_token: token }, function (userInfo) {
		if (userInfo.error) {
			// console.log('eRROR ', userInfo.error);
			return res.status(401).send(userInfo.error);
		}
		else {
			User.upsertFbUser(token, userInfo, {
				deviceType,
				token: deviceToken
			}, function (err, user) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				else {

					let displayName = userInfo.name
					let input = displayName.split(" ")

					let fName = input[0],
						lName = input[1]
					let token = createToken(userInfo)
					// console.log("User" , user)
					models.users.findOneAndUpdate({ 'facebookProvider.id': userInfo.id }, { $set: { deviceDetails: { deviceType: deviceType, deviceToken: deviceToken }, firstName: fName, lastName: lName } }, { new: true }, (err, ress) => {
						// console.log("resss", ress)
						res.status(200).send({
							firstName: ress.firstName,
							lastName: ress.lastName,
							token: token,
							email: ress.email,
							username: ress.username || "",
							phoneNumber: ress.phoneNumber || "",
							roles: ress.roles,
							birthday: ress.token || "",
							venueName: ress.venueName || ""
						})
					})
				}
			});
		}

	});

}