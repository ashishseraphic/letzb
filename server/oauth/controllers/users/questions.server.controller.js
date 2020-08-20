'use strict';
let 
    models = require('../../models'),
  
    _ = require('lodash'),
    errorHandler = require('../errors.server.controller');



var questions = {

    saveQuestion(req, response)
    {
        let body = req.body
        let question =  models.questions.create({
            questionNumber: body.questionNumber,
            type: body.type,
            question:body.question,
            options:[{
               image:body.image,
               title:body.title
            }]
        });
        response.status(200).send({
            message:"Saved Successfully",
            data:{
                question
            }
        })

    },

    saveOption(req, response)
    {
        let body = req.body
        let questionId = req.params.id
        models.questions.update({_id: questionId},{$push:{options:{image:body.image, title:body.title}}},{new:true},(err,res)=>{
            if(err)
            {
                response.status(400).send({
                    message:errorHandler.getErrorMessage(err)
                })

            }
            else
            {
                response.status(200).send({
                    message:"Saved Successfully",                   
                })

            }
        })

    },
    getAllQuestions(req, response)
    {
        models.questions.find({isDelete: false},(err, res)=>{
            console.log(res)
            if(err)
            {
                
            }
            else
            {
                response.status(200).send({
                    message:"Success",
                    data:{
                        Questions:
                            res
                        
                    }
                })
            }

        })
    }

};

module.exports = questions;