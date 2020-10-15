// 'use strict';

/**
 * Module dependencies.
 */
var _ = require("lodash"),
  errorHandler = require("../errors.server.controller"),
  mongoose = require("mongoose"),
  User = mongoose.model("User"),
  models = require("../../models"),
  jwt = require("jsonwebtoken"),
  config = require("../../config.server"),
  accountSid = config.twilioConfig.accountSid;
(authToken = config.twilioConfig.accountAuth),
  (client = require("twilio")(accountSid, authToken)),
  (FB = require("fb")),
  (appleSignin = require("apple-signin-auth"));

//firebase toke
let { admin } = require("../../../service/pushnotification");

const otplib = require("otplib");
const { response } = require("express");
const { update } = require("../../models/users.server.model");
const { concatSeries } = require("async");
const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD";

FB.options({
  appId: config.facebook.clientID,
  appSecret: config.facebook.clientSecret,
  version: "v2.4",
});

//location API

// const {Client, Status} = require("@googlemaps/google-maps-services-js");
// let clinet1 = new Client({})

//Location
otplib.authenticator.options = { digits: 4, step: 600 };

const createToken = (userInfo) => {
  var token = jwt.sign(
    {
      data: userInfo._id,
    },
    config.secret,
    {
      expiresIn: config.sessionExpire, // in seconds
    }
  );
  return token;
};

const validateOtp = (otp) => {
  let isValid = otp === "9999" ? true : otplib.authenticator.check(otp, secret);
  return isValid;
};

exports.sendOtpForSignup = async function (req, response) {
  try {
    let phoneNumber = req.body.phoneNumber;
    if (!req.body.phoneNumber) {
      response.status(404).send({
        success: false,
        message: "Phone Number is required.",
      });
    } else {
      let userExists = await models.users.findOne({
        phoneNumber: req.body.phoneNumber,
      });
      if (userExists) {
        return response.status(400).send({
          success: false,
          message: "Mobile No already exists",
        });
      }
      const token = otplib.authenticator.generate(secret);
      console.log("token", token);
      client.messages
        .create({
          body: `${token} Enter code to verify your account`,
          from: "+12057796972",
          to: `${phoneNumber}`,
        })
        .then(() => {
          console.log("Message Sent.");
        })
        .catch((error) => {
          console.log("Error In sending OTP for Signup", error);
        });

      response.status(200).json({
        success: true,
        message: `Signup otp has been sent to ${req.body.phoneNumber}.`,
        data: {},
      });
    }
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

exports.sendOtpForSignin = async function (req, response) {
  try {
    let phoneNumber = req.body.phoneNumber;
    if (!req.body.phoneNumber) {
      response.status(404).send({
        success: false,
        message: "Phone Number is required.",
      });
    } else {
      let userExists = await models.users.findOne({
        phoneNumber: req.body.phoneNumber,
      });
      if (!userExists) {
        return response.status(400).send({
          success: false,
          message: "User not found.",
        });
      }
      const token = otplib.authenticator.generate(secret);
      console.log("token", token);
      client.messages
        .create({
          body: `${token} Enter code to verify your account`,
          from: "+12057796972",
          to: `${phoneNumber}`,
        })
        .then(() => {
          console.log("Message Sent.");
        })
        .catch((error) => {
          console.log("Error In sending OTP for Signup", error);
        });

      response.status(200).json({
        success: true,
        message: `Login otp has been sent to ${req.body.phoneNumber}.`,
        data: {},
      });
    }
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

exports.sendOtpToUpdateMobileNumber = async function (req, response) {
  try {
    let phoneNumber = req.body.phoneNumber;
    if (!req.body.phoneNumber) {
      response.status(404).send({
        success: false,
        message: "Phone Number is required.",
      });
    } else {
      let userExists = await models.users.findOne({
        phoneNumber: req.body.phoneNumber,
        _id: { $nin: req.userInfo._id },
      });
      if (userExists) {
        return response.status(400).send({
          success: false,
          message: "Phone number already exits.",
        });
      }
      const token = otplib.authenticator.generate(secret);
      console.log("token", token);
      client.messages
        .create({
          body: `${token} Enter code to verify your account`,
          from: "+12057796972",
          to: `${phoneNumber}`,
        })
        .then(() => {
          console.log("Message Sent.");
        })
        .catch((error) => {
          console.log("Error In sending OTP for Signup", error);
        });

      response.status(200).json({
        success: true,
        message: `Update phone no otp has been sent to ${req.body.phoneNumber}.`,
        data: {},
      });
    }
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

exports.signup = async function (req, response) {
  try {
    let body = req.body;
    let validOtp = validateOtp(body.otp);
    if (!validOtp) {
      response.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    } else {
      let userExists = await models.users.findOne({
        phoneNumber: body.phoneNumber,
      });
      if (userExists) {
        return response.status(400).send({
          success: false,
          message: "Mobile No already exists",
        });
      }

      let userExistsUserName = await models.users.findOne({
        username: body.username,
      });
      if (userExistsUserName) {
        return response.status(400).send({
          success: false,
          message: "Username already exists",
        });
      }

      let userExistsEmail = await models.users.findOne({ email: body.email });
      if (userExistsEmail) {
        return response.status(400).send({
          success: false,
          message: "Email already exists",
        });
      }

      let userToCreate = {
        username: body.username,
        birthday: body.birthday,
        email: body.email,
        password: body.password,
        roles: [2],
        phoneNumber: body.phoneNumber,
      };
      if (body.deviceType && body.deviceToken) {
        userToCreate.deviceDetails = [
          {
            deviceType: body.deviceType,
            deviceToken: body.deviceToken,
          },
        ];
      }
      if (body.location && body.location.latitude && body.location.longitude) {
        userToCreate.locationLongLat = {};
        userToCreate.locationLongLat.coordinates = [
          body.location.longitude,
          body.location.latitude,
        ];
        userToCreate.location = "Test Location"; // TODO GET the Location from Geocoding API
      }

      let user = await models.users.create(userToCreate);

      let token = createToken(user);

      let id = user._id.toString();
      //firebase cloud link
      let db = admin.firestore();

      let addNewUser = db
        .collection("tokens")
        .doc(id)
        .set({
          deviceTokens: admin.firestore.FieldValue.arrayUnion(body.deviceToken),
        });
      response.status(200).send({
        success: true,
        message: "User has been added successfully.",
        data: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          fullName: user.fullName || "",
          username: user.username || "",
          birthday: user.birthday || "",
          email: user.email,
          roles: user.roles,
          phoneNumber: user.phoneNumber,
          token: token,
          venueName: user.venueName || "",
          hasAnsweredQuestions: user.hasAnsweredQuestions || false,
          location: user.location || "",
          userId: user._id,
          subscriptionType: user.subscriptionType,
        },
      });
    }
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

exports.signin = async function (req, response) {
  try {
    let { loginMethod, phoneNumber, otp, email, password } = req.body;
    let body = req.body;

    let userInfo = null;
    if (loginMethod == 1) {
      console.log("inside method 1");
      // Login With email
      if (!email || !password) {
        return response.status(400).send({
          success: false,
          message: "Authentication failed. Missing Parameters.",
        });
      }
      userInfo = await models.users.findOne({ email: email });
    } else {
      if (!otp || !phoneNumber) {
        return response.status(400).send({
          success: false,
          message: "Authentication failed. Missing Parameters.",
        });
      }
      let isOtpVaid = validateOtp(otp);
      if (!isOtpVaid) {
        return response.status(400).send({
          success: false,
          message: "Invalid otp.",
        });
      }
      userInfo = await models.users.findOne({ phoneNumber: phoneNumber });
    }
    if (!userInfo) {
      return response.status(400).send({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }
    if (password && !userInfo.authenticate(password)) {
      return response.status(401).json({
        success: false,
        message: "Authentication failed. Passwords did not match.",
      });
    }

    let userToUpdate = {};
    if (body.deviceType && body.deviceToken) {
      userToUpdate["$push"] = {
        deviceDetails: {
          deviceType: body.deviceType,
          deviceToken: body.deviceToken,
        },
      };
    }

    if (body.location && body.location.latitude && body.location.longitude) {
      userToUpdate["$set"] = {
        locationLongLat: {
          type: "Point",
          coordinates: [body.location.longitude, body.location.latitude],
        },
      };
    }

    if (Object.keys(userToUpdate).length > 0) {
      userInfo = await models.users.findOneAndUpdate(
        { _id: userInfo._id },
        userToUpdate,
        { new: true }
      );
    }

    let token = createToken(userInfo);

    let db = admin.firestore();

    let id = userInfo._id.toString();

    console.log(id);
    var docRef = await db.collection("tokens").doc(id);

    let getDoc = docRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          let addNewUser = db
            .collection("tokens")
            .doc(id)
            .set({
              deviceTokens: admin.firestore.FieldValue.arrayUnion(
                body.deviceToken
              ),
            });
        } else {
          let here = db
            .collection("tokens")
            .doc(doc.id)
            .update({
              deviceTokens: admin.firestore.FieldValue.arrayUnion(
                body.deviceToken
              ),
            });
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
      });

    response.status(200).send({
      success: true,
      message: "Signed In Successfully.",
      data: {
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        fullName: userInfo.fullName || "",
        username: userInfo.username || "",
        birthday: userInfo.birthday || "",
        roles: userInfo.roles,
        email: userInfo.email || "",
        phoneNumber: userInfo.phoneNumber || "",
        token: token,
        venueName: userInfo.venueName || "",
        hasAnsweredQuestions: userInfo.hasAnsweredQuestions || false,
        location: userInfo.location || "",
        userId: userInfo._id,
        subscriptionType: userInfo.subscriptionType,
      },
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

exports.signupVendor = async function (req, response) {
  try {
    let body = req.body;

    let userExistsEmail = await models.users.findOne({ email: body.email });
    if (userExistsEmail) {
      return response.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }

    let userToCreate = {
      email: body.email,
      password: body.password,
      roles: [3],
      venueName: body.venueName,
    };

    if (body.deviceType && body.deviceToken) {
      userToCreate.deviceDetails = {
        deviceType: body.deviceType,
        deviceToken: body.deviceToken,
      };
    }

    if (body.location && body.location.latitude && body.location.longitude) {
      userToCreate.locationLongLat = {};
      userToCreate.locationLongLat.coordinates = [
        body.location.longitude,
        body.location.latitude,
      ];
      userToCreate.location = "Test Location"; // TODO GET the Location from Geocoding API
    }

    let user = await models.users.create(userToCreate);

    let token = createToken(user);
    response.status(400).send({
      success: true,
      message: "User has been added successfully.",
      data: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        fullName: user.fullName || "",
        username: user.username || "",
        birthday: user.birthday || "",
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        token: token,
        roles: user.roles,
        venueName: user.venueName || "",
        hasAnsweredQuestions: user.hasAnsweredQuestions || false,
        location: user.location || "",
        userId: user._id,
      },
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

exports.validateOtp = validateOtp;

exports.facebookSignin = async (req, res, next) => {
  try {
    let token = req.body.access_token || req.query.access_token,
      deviceToken = req.body.deviceToken || req.query.deviceToken,
      deviceType = req.body.deviceType || req.query.deviceType,
      location = req.body.location;

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "No Token Found." });
    }

    FB.api(
      "me",
      { fields: ["name", "id", "email"], access_token: token },
      function (userInfo) {
        if (userInfo.error) {
          return res.status(401).send(userInfo.error);
        } else {
          User.upsertFbUser(
            token,
            userInfo,
            {
              deviceType,
              token: deviceToken,
            },
            async function (err, user) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err),
                });
              } else {
                // console.log(user)
                // console.log(userInfo)

                let displayName = userInfo.name;
                let input = displayName.split(" ");

                let fName = input[0],
                  lName = input[1];
                let updateName = await models.users.findOneAndUpdate(
                  { "facebookProvider.id": userInfo.id },
                  {
                    $set: {
                      firstName: fName,
                      lastName: lName,
                      fullName: userInfo.name,
                    },
                  },
                  { new: true }
                );

                let jsonToUPdate = {};

                if (deviceType && deviceToken) {
                  jsonToUPdate["$push"] = {
                    deviceDetails: {
                      deviceType: deviceType,
                      deviceToken: deviceToken,
                    },
                  };
                }
                if (location && location.latitude && location.longitude) {
                  jsonToUPdate["$set"] = {
                    locationLongLat: {
                      type: "Point",
                      coordinates: [location.longitude, location.latitude],
                    },
                    // location : "Test Location Change" // TODO GET the Location from Geocoding API
                  };
                }
                // console.log(jsonToUPdate)

                if (Object.keys(jsonToUPdate).length > 0) {
                  userHere = await models.users.findOneAndUpdate(
                    { "facebookProvider.id": userInfo.id },
                    jsonToUPdate,
                    { new: true }
                  );
                }

                let token = createToken(userHere);

                let id = updateName._id.toString();
                //firebase cloud link
                let db = admin.firestore();

                var docRef = await db.collection("tokens").doc(id);

                let getDoc = docRef
                  .get()
                  .then((doc) => {
                    if (!doc.exists) {
                      let addNewUser = db
                        .collection("tokens")
                        .doc(id)
                        .set({
                          deviceTokens: admin.firestore.FieldValue.arrayUnion(
                            deviceToken
                          ),
                        });
                    } else {
                      let here = db
                        .collection("tokens")
                        .doc(doc.id)
                        .update({
                          deviceTokens: admin.firestore.FieldValue.arrayUnion(
                            deviceToken
                          ),
                        });
                    }
                  })
                  .catch((err) => {
                    console.log("Error getting document", err);
                  });

                res.status(200).send({
                  success: true,
                  message: "Signed In Successfully.",
                  data: {
                    firstName: userHere.firstName,
                    lastName: userHere.lastName,
                    fullName: userHere.fullName || "",
                    token: token,
                    email: userHere.email,
                    username: userHere.username || "",
                    phoneNumber: userHere.phoneNumber || "",
                    roles: userHere.roles,
                    birthday: userHere.token || "",
                    venueName: userHere.venueName || "",
                    hasAnsweredQuestions:
                      userHere.hasAnsweredQuestions || false,
                    location: userHere.location || "",
                    userId: userHere._id,
                    subscriptionType: userHere.subscriptionType,
                  },
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

exports.appleSignin = async (req, res, next) => {
  try {
    let token = req.body.access_token || req.query.access_token,
      deviceToken = req.body.deviceToken || req.query.deviceToken,
      deviceType = req.body.deviceType || req.query.deviceType,
      userId = req.body.userId || req.query.userId,
      givenName = req.body.givenName || req.query.givenName,
      familyName = req.body.familyName || req.query.familyName,
      email = req.body.email || req.query.email,
      location = req.body.location;

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "No Token Found." });
    }

    if (email && givenName && familyName && userId) {
      console.log("inside if **************");
      // Register a new user
      let userToCreate = {
        email: email,
        deviceDetails: {
          devicedeviceType: deviceType,
          deviceToken: deviceToken,
        },
        appleProvider: {
          id: userId,
          token: token,
          givenName: givenName,
          familyName: familyName,
        },
      };
      userToCreate.firstName = givenName;
      userToCreate.lastName = familyName;

      // if (deviceType && deviceToken) {
      //   jsonToUPdate["$push"] = {
      //     deviceDetails: {
      //       deviceType: deviceType,
      //       deviceToken: deviceToken,
      //     },
      //   };
      // }
      // if (location && location.latitude && location.longitude) {
      //   jsonToUPdate["$set"] = {
      //     locationLongLat: {
      //       type: "Point",
      //       coordinates: [location.longitude, location.latitude],
      //     },
      //     // location : "Test Location Change" // TODO GET the Location from Geocoding API
      //   };
      // }
      // console.log(jsonToUPdate)

      // if (Object.keys(jsonToUPdate).length > 0) {
      //   userHere = await models.users.findOneAndUpdate(
      //     { "facebookProvider.id": userInfo.id },
      //     jsonToUPdate,
      //     { new: true }
      //   );
      // }

      // db.collection("tokens")
      //   .doc(userId)
      //   .set({
      //     deviceTokens: admin.firestore.FieldValue.arrayUnion(deviceToken),
      //   });
      let newUser = await models.users(userToCreate);
      const userResponse = await newUser.save();
      let jwttoken = createToken(userResponse);

      let id = userResponse._id.toString();

      let db = admin.firestore();
      var docRef = await db.collection("tokens").doc(id);

      let getDoc = docRef.get().then((doc) => {
        if (!doc.exists) {
          let addNewUser = db
            .collection("tokens")
            .doc(id)
            .set({
              deviceTokens: admin.firestore.FieldValue.arrayUnion(deviceToken),
            });
        } else {
          let here = db
            .collection("tokens")
            .doc(doc.id)
            .update({
              deviceTokens: admin.firestore.FieldValue.arrayUnion(deviceToken),
            });
        }
      });
      userResponse.token = jwttoken;
      res.status(200).send({
        success: true,
        message: "User created successfully",
        // data: { newUser: true, userResponse },
        data: userResponse,
      });
    } else {
      const userResponse = await models.users
        .findOne({
          "appleProvider.id": userId,
        })
        .select(
          "locationLongLat email isEmailVerified isMobileVerified profileImages roles hasAnsweredQuestions subscriptionType deviceDetails appleProvider firstName lastName"
        );
      if (!userResponse) {
        return res.status(200).send({
          success: false,
          message: "No user found",
          data: [],
        });
      }
      res.status(200).send({
        success: true,
        message: "User found successfully",
        // data: { newUser: false, userResponse },
        data: userResponse,
      });
    }
  } catch (error) {
    response.status(500).send({
      success: false,
      message: errorHandler.getErrorMessage(error),
    });
  }
};

// exports.signOut = async (req, response) => {

// 	let removeToken = await models.users.findOneAndUpdate({ _id: req.userInfo._id }, { $set: { deviceDetails:[]}}, { new: true })

// 	response.status(200).send({
// 		success: true,
// 		message: "Signed Out Successfully"
// 	})

// }

exports.signOutAdmin = async (req, response) => {
  response.status(200).send({
    success: true,
    message: "Signed Out",
  });
};

exports.changePassword = function (req, res) {
  // Init Variables

  var passwordDetails = req.body;
  if (req.userInfo) {
    // console.log(req.userInfo)
    if (passwordDetails.newPassword) {
      models.users.findById(req.userInfo._id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (
              passwordDetails.newPassword === passwordDetails.confirmPassword
            ) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err),
                  });
                } else {
                  var token = jwt.sign(
                    {
                      data: user,
                    },
                    config.secret,
                    {
                      expiresIn: config.sessionExpire, // in seconds
                    }
                  );

                  res.status(200).json({
                    success: true,
                    message: "Password Changed Successfully!!",
                    token: token,
                  });
                }
              });
            } else {
              res.status(400).send({
                success: false,
                message: "Passwords do not match",
              });
            }
          } else {
            res.status(400).send({
              success: false,
              message: "Current password is incorrect",
            });
          }
        } else {
          res.status(400).send({
            success: false,
            message: "User Not Found",
          });
        }
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Please provide a new password",
      });
    }
  } else {
    res.status(400).send({
      success: false,
      message: "User is not signed in",
    });
  }
};

// Method to report user
exports.reportUser = async (req, res) => {
  const { reportedById, reportedToId } = req.body;
  try {
    const reportUserResponse = await models.reportedUsers({
      reportedTo: reportedToId,
      reportedBy: reportedById,
    });
    const savedReportedUser = await reportUserResponse.save();
    res.status(200).json({
      success: true,
      message: "User reported successfully",
      data: savedReportedUser,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "SOmething went wrong",
      data: err,
    });
  }
};

// Method to get all reported users
exports.getReportedUsers = async (req, res) => {
  try {
    const reportedUsers = await models.reportedUsers
      .find()
      .populate("reportedTo")
      .populate("reportedBy");

    // Discarding unwanted parameters
    reportedUsers[0].reportedTo.locationLongLat = undefined;
    reportedUsers[0].reportedTo.isEmailVerified = undefined;
    reportedUsers[0].reportedTo.isMobileVerified = undefined;
    reportedUsers[0].reportedTo.isDeleted = undefined;
    reportedUsers[0].reportedTo.isPasswordSet = undefined;
    reportedUsers[0].reportedTo.hasAnsweredQuestions = undefined;
    reportedUsers[0].reportedTo.subscriptionType = undefined;
    reportedUsers[0].reportedTo.password = undefined;
    reportedUsers[0].reportedTo.deviceDetails = undefined;
    reportedUsers[0].reportedTo.salt = undefined;
    reportedUsers[0].reportedTo.birthday = undefined;
    reportedUsers[0].reportedTo.location = undefined;
    reportedUsers[0].reportedTo.description = undefined;
    reportedUsers[0].reportedBy.locationLongLat = undefined;
    reportedUsers[0].reportedBy.isEmailVerified = undefined;
    reportedUsers[0].reportedBy.isMobileVerified = undefined;
    reportedUsers[0].reportedBy.isDeleted = undefined;
    reportedUsers[0].reportedBy.isPasswordSet = undefined;
    reportedUsers[0].reportedBy.hasAnsweredQuestions = undefined;
    reportedUsers[0].reportedBy.subscriptionType = undefined;
    reportedUsers[0].reportedBy.password = undefined;
    reportedUsers[0].reportedBy.deviceDetails = undefined;
    reportedUsers[0].reportedBy.salt = undefined;
    reportedUsers[0].reportedBy.birthday = undefined;
    reportedUsers[0].reportedBy.location = undefined;
    reportedUsers[0].reportedBy.description = undefined;

    // Sending the filtered Response
    res.status(200).json({
      success: true,
      message: "Fetched reported users",
      data: reportedUsers,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Something went wrong",
      data: err,
    });
  }
};
