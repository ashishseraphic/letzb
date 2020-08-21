'use strict';
let
    models = require('../models'),

    _ = require('lodash'),
    errorHandler = require('./errors.server.controller');



var questions = {
    saveQuestion(req, response) {
        let options = []
        options = req.body.options
        let questionNumber = req.body.questionNumber,
            type = req.body.type,
            question = req.body.question
        if (!questionNumber || !type || !question || !options) {
            response.status(400).send({
                success: false,
                message: "Missing Fields"
            })
        }
        else {
            models.questions.insertMany({ questionNumber: questionNumber, type: type, question: question, options }, (err, res) => {
                if (err) {
                    response.status(400).send({
                        success: false,
                        message: errorHandler.getErrorMessage(err)
                    })
                }
                else {
                    response.status(200).send({
                        success: true,
                        message: "Questions Saved Successfully",
                        data: {}
                    })
                }
            })
        }
    },



    getAllQuestions(req, response) {
        try {
            models.questions.find({
                isDeleted: false
            }, {
                isDeleted: 0,
                modified_at: 0,
                created_at: 0,
                __v: 0,
                "options.modified_at": 0,
                "options.created_at": 0
            }, (err, res) => {
                if (err) {
                    response.status(400).send({
                        message: errorHandler.getErrorMessage(err),
                        success: false,
                    })
                }
                else {
                    res = JSON.parse(JSON.stringify(res));
                    res.map((question) => {
                        question.id = question._id;
                        delete question._id;
                        question.options.map((option) => {
                            option.id = option._id;
                            delete option._id
                        })
                    })
                   let temp = _.orderBy(res, ['questionNumber'], ['asc']);
                    response.status(200).send({
                        success: true,
                        message: "Success",
                        data: {
                            Questions:
                                temp
                        }
                    })
                }
            })
        } catch (error) {
            response.status(400).send({
                message: errorHandler.getErrorMessage(error),
                success: false,
            })
        }
    },

    async saveAnswerResponse(req, response) {
        try {
            let answersArray = req.body.answersArray
            if (!answersArray || answersArray.length === 0) {
                response.status(400).send({
                    success: false,
                    message: "Missing Field"
                })
            } else {
                let questions = await models.questions.find({ isDeleted: false, _id: { $in: answersArray.map((a) => a.questionId) } });
                if (questions.length !== answersArray.length) {
                    response.status(400).send({
                        success: false,
                        message: "Question not found",
                        data: {}
                    });
                } else {
                    let alreadyAnswered = await models.answers.findOne({ userId: req.userInfo._id});
                    if(alreadyAnswered) {
                        return response.status(400).send({
                            success: false,
                            message: "You have already answered the questions.",
                            data: {}
                        });
                    }
                    await models.answers.insertMany({ userId: req.userInfo._id, answersArray });
                    await models.users.findOneAndUpdate({ _id: req.userInfo._id }, { $set: { hasAnsweredQuestions: true } });
                    response.status(200).send({
                        success: true,
                        message: "Answers Saved Succesfully",
                        data: {}
                    })
                }
            }
        } catch (error) {
            response.status(400).send({
                message: errorHandler.getErrorMessage(error),
                success: false,
            })
        }
    },


    async deleteQuestion(req, response) {
        try {
            let questionId = req.params.questionId
            if (!questionId) 
            {
                response.status(400).send({
                    success: false,
                    message: "Missing Field"
                })
            }
            else {
                let exist = await models.questions.findOne({ _id: questionId })
                if (!exist) {
                    response.status(400).send({
                        success: false,
                        message: "Question Not Found"
                    })
                }
                else {
                    models.questions.findOneAndUpdate({ _id: questionId }, { $set: { isDeleted: true } }, { new: true }, (err, res) => {
                        if (err) {
                            response.status(400).send({
                                success: false,
                                message: errorHandler.getErrorMessage(err)
                            })

                        }
                        else {
                            response.status(200).send({
                                success: true,
                                message: "Question Deleted"
                            })

                        }
                    })
                }

            }

        }
        catch (error) {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })

        }
    }


};

module.exports = questions;

