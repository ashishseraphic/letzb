'use strict';
let
    models = require('../models'),
    mongoosse= require('mongoose'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller');
const bodyParser = require('body-parser');



var feedback = {
   
    async addFeedback(req, response) {
        try {
            let body = req.body

            if (!body.name || !body.email || !body.subject || !body.message) 
            {
            
                response.status(401).send({
                    success: false,
                    message: "Missing Fields"
                })
            }
            else {
                body.userId = mongoosse.Types.ObjectId(req.userInfo._id)

                   let createFeedback = await models.feedback.create(body)
                       
                    response.status(200).send({
                        success: true,
                        message: "Feedback Saved Successfully",
                    })
                }
        }
        catch (error) {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),

            })
        }
    },    
};

module.exports = feedback;
