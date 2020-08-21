'use strict'
let _ = require('lodash'),
    models = require('../../models'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    config = require('../../config.server'),
    path = require('path'),
    Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(process.env.PWD, 'uploads'));
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    }),
    uploadAllTypeOfFiles = multer({
        storage: Storage

    }),
    documentImage = uploadAllTypeOfFiles.array('profileImage')

// accountSid = config.twilioConfig.accountSid
// authToken = config.twilioConfig.accountAuth,
// client = require('twilio')(accountSid, authToken)
let validateOtp = require("./users.authentication.server.controller").validateOtp
let crud = {
    async userProfile(req, response) {
        try {

            let user = req.userInfo
            let answerToSend = []

            let answer = await models.answers.findOne({ userId: user._id });
            if (answer) {
                answer = JSON.parse(JSON.stringify(answer));
                let questions = await models.questions.find({ _id: answer.answersArray.map((o) => o.questionId) });
                questions = questions ? JSON.parse(JSON.stringify(questions)) : [];
                answer.answersArray.forEach((ans) => {
                    let question = questions.find((que) => que._id === ans.questionId);
                    if (question) {
                        let answerFound = question.options.find((o) => o._id === ans.answerId);
                        if (answerFound) {
                            answerToSend.push({
                                image: answerFound.image,
                                title: answerFound.title,
                                id: answerFound._id
                            })
                        }
                    }
                })
            }
            response.status(200).send({
                success: true,
                message: "Success",
                data: {
                    user: {
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        fullName: user.fullName || "",
                        username: user.username || "",
                        birthday: user.birthday || "",
                        roles: user.roles,
                        email: user.email || "",
                        phoneNumber: user.phoneNumber || "",
                        venueName: user.venueName || "",
                        answers: answerToSend,
                        hasAnsweredQuestions: user.hasAnsweredQuestions || false,
                        location: user.location || "",
                        userId: user._id,
                        description: user.description || "",
                        profileImages: user.profileImages || [],
                    }
                }
            })
        }
        catch (error) {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error)
            })
        }
    },

    async updateProfile(req, response) {
        try {
            
            let dataToUpdate = {};
            let payload = req.body;
            // console.log("Req.user", req.userInfo)
            if(payload.phoneNumber && !payload.otp) {
                return response.status(400).json({
                    success: false,
                    message: "OTP is missing."
                }); 
            }
            if(payload.phoneNumber && payload.otp) {
                let isOTPValid = validateOtp(payload.otp)
                if(isOTPValid) {
                    dataToUpdate.phoneNumber = payload.phoneNumber
                } else {
                    return response.status(400).json({
                        success: false,
                        message: "Invalid OTP"
                    }); 
                }
            }
            if(payload.fullName) {
                dataToUpdate.fullName = payload.fullName;
                let fullName = payload.fullName;
                fullName = fullName.split(" ");
                dataToUpdate.firstName = fullName[0];
                fullName.splice(0, 1)
                dataToUpdate.lastName = fullName.join(" ") || "";
            }

            if(payload.birthday) {
                dataToUpdate.birthday = payload.birthday;
            }

            if(payload.profileImages) {
                dataToUpdate.profileImages = payload.profileImages;
            }

            if(payload.email) {
                dataToUpdate.email = payload.email;
            }

            if(payload.description) {
                dataToUpdate.description = payload.description
            }

            if(payload.username) {
                
                let userWithThisUserName = await models.users.findOne({username: payload.username, _id: {$nin: req.userInfo._id}});
                if(userWithThisUserName) {
                    return response.status(400).json({
                        success: false,
                        message: "Username Already Exists."
                    }); 
                } else {
                    dataToUpdate.username = payload.username;
                }
            }

            if(payload.location && payload.location.latitude && payload.location.longitude && payload.location.address) {
                dataToUpdate.location = payload.location.address;
                dataToUpdate.locationLongLat = {
                    type: "Point",
                    coordinates: [payload.location.longitude, payload.location.latitude]
                }
            }

            let res = await  models.users.findOneAndUpdate({ _id: req.userInfo._id }, {
                $set: dataToUpdate
            }, { new: true })

            response.status(200).send({
                success: true,
                message: "Details Updated Successfully",
                data: {
                    firstName: res.firstName || "",
                    lastName: res.lastName || "",
                    fullName: res.fullName || "",
                    username: res.username || "",
                    birthday: res.birthday || "",
                    email: res.email,
                    roles: res.roles,
                    profileImages: res.profileImages,
                    phoneNumber: res.phoneNumber,
                    userId: res._id,
                    location: res.location || "",
                    description: res.description || "",
                    venueName: res.venueName || ""
                }
            })

          
        } catch (error) {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error)
            })
        }
    },

    uploadPhoto: (req, response) => {
        documentImage(req, response, (err) => {
            let profileImage = ''
            let profileImages = []
            console.log("err", err)
            if (req.files) {
                for (let index = 0; index < req.files.length; index++) {
                    profileImages.push(profileImage = config.serverUrl + req.files[index].filename)
                }
                response.status(200).send({
                    success: true,
                    message: "Success",
                    data: {
                        imagePath: profileImages
                    }
                })
            } else {
                return response.status(400).send({
                    success: false,
                    message: 'uploading failed.'
                })
            }
        })
    },
}
module.exports = crud