'use strict';
let mongoose = require('mongoose'),
    async = require('async'),
    models = require('../../models'),
    config = require('../../../config.server'),
    jwt = require("jsonwebtoken"),
    multer = require('multer'),
    path = require('path'),
    ffmpeg = require('fluent-ffmpeg'),
    _ = require('lodash'),
    Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(process.env.PWD, 'uploads'));
        },
        filename: function (req, file, callback) {
            // console.log("file",file)
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    }),
    uploadAllTypeOfFiles = multer({
        storage: Storage
    }),
    documentImage = uploadAllTypeOfFiles.single('videoUrl'),
    errorHandler = require('../errors.server.controller');



var crud = {


    saveResponse(req, response){
        let questionId = req.body.questionId,
        answerId = req.body.answerId
        models.answers.findOne({userId:req.userInfo},(err, resOne)=>{
            if(err)
            {
                response.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                })

            }
            else if(resOne)
            {

                models.answers.update({userId:req.userInfo},{$addToSet:{answersArray:{questionId: questionId,answerId:answerId}}},(err,res)=>{
                    if(err)
                    {
                        response.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        })
    
                    }
                    else
                    {
                        response.status(200).send({
                            message:"SUCCESS"
                        })
    
                    }
                })

            }
            else if(!resOne)
            {
                let answer =  models.answers.create({
                    userId: req.userInfo
                          
                },(err,resTwo)=>{
                    if(err)
                    {
                        response.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        })
    
                    }
                    else
                    {
                        models.answers.update({userId:req.userInfo},{$addToSet:{answersArray:{questionId: questionId,answerId:answerId}}},(err,res)=>{
                            if(err)
                            {
                                response.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                })
            
                            }
                            else
                            {
                                response.status(200).send({
                                    message:"Answer Saved Successfully"
                                })
            
                            }
                        })
                    }
    
                });

            }
        })
		
            
     
    },
    getAllQuestions(req, response) {
        let arr = [
            {
                id: 1,
                questionNo: 1,
                type: '2-Block',
                question: 'I like meeting up for…',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion1/Coffee.png",
                        title: 'Coffee',
                    },
                    {
                        id: 2,
                        image: "/Qusetion1/Drinks.png",
                        title: 'Drinks',
                    },
                    {
                        id: 3,
                        image: "/Qusetion1/Marijuana.png",
                        title: 'Marijuana',
                    },
                    {
                        id: 4,
                        image: "/Qusetion1/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 2,
                questionNo: 2,
                type: '3-Block',
                question: 'What is your horoscope?',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion2/Aquarius.png",
                        title: 'Aquarius',
                    },
                    {
                        id: 2,
                        image: "/Qusetion2/Pisces.png",
                        title: 'Pisces',
                    },
                    {
                        id: 3,
                        image: "/Qusetion2/Aries.png",
                        title: 'Aries',
                    },
                    {
                        id: 4,
                        image: "/Qusetion2/Taurus.png",
                        title: 'Taurus',
                    },
                    {
                        id: 5,
                        image: "/Qusetion2/Gemini.png",
                        title: 'Gemini',
                    },
                    {
                        id: 6,
                        image: "/Qusetion2/Cancer.png",
                        title: 'Cancer',
                    },
                    {
                        id: 7,
                        image: "/Qusetion2/Leo.png",
                        title: 'Leo',
                    },
                    {
                        id: 8,
                        image: "/Qusetion2/Virgo.png",
                        title: 'Virgo',
                    },
                    {
                        id: 9,
                        image: "/Qusetion2/Libra.png",
                        title: 'Libra',
                    },
                    {
                        id: 10,
                        image: "/Qusetion2/Scorpio.png",
                        title: 'Scorpio',
                    },
                    {
                        id: 11,
                        image: "/Qusetion2/Sagittarius.png",
                        title: 'Sagittarius',
                    },
                    {
                        id: 12,
                        image: "/Qusetion2/Capricorn.png",
                        title: 'Capricorn',
                    },
                ]
            },
            {
                id: 3,
                questionNo: 3,
                type: '2-Block',
                question: 'My Schedule is',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion3/Student.png",
                        title: 'Student',
                    },
                    {
                        id: 2,
                        image: "/Qusetion3/Entrepreneur.png",
                        title: 'Entrepreneur',
                    },
                    {
                        id: 3,
                        image: "/Qusetion3/Nightlife.png",
                        title: 'Nightlife',
                    },
                    {
                        id: 4,
                        image: "/Qusetion3/BusinessOwner.png",
                        title: 'Business Owner',
                    },
                    {
                        id: 5,
                        image: "/Qusetion3/9-5Professional.png",
                        title: '9-5 Professional',
                    },
                    {
                        id: 6,
                        image: "/Qusetion3/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 4,
                questionNo: 4,
                type: '2-Block',
                question: 'I am searching for',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion4/Friendship.png",
                        title: 'Friendship',
                    },
                    {
                        id: 2,
                        image: "/Qusetion4/Relationship.png",
                        title: 'Relationship',
                    },
                    {
                        id: 3,
                        image: "/Qusetion4/Networking.png",
                        title: 'Networking',
                    },
                    {
                        id: 4,
                        image: "/Qusetion4/MeetTonight.png",
                        title: 'Meet Tonight',
                    },
                    {
                        id: 5,
                        image: "/Qusetion4/OpenRelationship.png",
                        title: 'Open Relationship',
                    },
                    {
                        id: 6,
                        image: "/Qusetion4/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 5,
                questionNo: 5,
                type: '2-Block',
                question: 'My ideal fist date',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion5/Netflix&Chill.png",
                        title: 'Netflix & Chill',
                    },
                    {
                        id: 2,
                        image: "/Qusetion5/RomanticDinner.png",
                        title: 'Romantic Dinner',
                    },
                    {
                        id: 3,
                        image: "/Qusetion5/OutdoorAdventures.png",
                        title: 'Outdoor Adventures',
                    },
                    {
                        id: 4,
                        image: "/Qusetion5/MuseumTour.png",
                        title: 'Museum Tour',
                    },
                    {
                        id: 5,
                        image: "/Qusetion5/Theater.png",
                        title: 'Theater',
                    },
                    {
                        id: 6,
                        image: "/Qusetion5/Concert.png",
                        title: 'Concert',
                    },
                ]
            },
            {
                id: 6,
                questionNo: 6,
                type: '2-Block',
                question: 'My body type',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion6/Skinny.png",
                        title: 'Skinny',
                    },
                    {
                        id: 2,
                        image: "/Qusetion6/Athletic.png",
                        title: 'Athletic',
                    },
                    {
                        id: 3,
                        image: "/Qusetion6/Plus.png",
                        title: 'Plus',
                    },
                    {
                        id: 4,
                        image: "/Qusetion6/Average.png",
                        title: 'Average',
                    },
                    {
                        id: 5,
                        image: "/Qusetion6/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 7,
                questionNo: 7,
                type: '2-Block',
                question: 'My love language is',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion7/ActsofService.png",
                        title: 'Acts of Service',
                    },
                    {
                        id: 2,
                        image: "/Qusetion7/PhysicalTouch.png",
                        title: 'Physical Touch',
                    },
                    {
                        id: 3,
                        image: "/Qusetion7/WordsofAffirmation.png",
                        title: 'Words of Affirmation',
                    },
                    {
                        id: 4,
                        image: "/Qusetion7/GiftGiving.png",
                        title: 'Gift Giving',
                    },
                    {
                        id: 5,
                        image: "/Qusetion7/QualityTime.png",
                        title: 'Quality Time',
                    },
                ]
            },
            {
                id: 8,
                questionNo: 8,
                type: '2-Block',
                question: 'Lifestyle',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion8/EarlyBird.png",
                        title: 'Early Bird',
                    },
                    {
                        id: 2,
                        image: "/Qusetion8/NightOwl.png",
                        title: 'Night Owl',
                    },
                    {
                        id: 3,
                        image: "/Qusetion8/GymRat.png",
                        title: 'Gym Rat',
                    },
                    {
                        id: 4,
                        image: "/Qusetion8/BookWorm.png",
                        title: 'Book Worm',
                    },
                    {
                        id: 5,
                        image: "/Qusetion8/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 9,
                questionNo: 9,
                type: '2-Block',
                question: 'Sexual Preference',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion9/Bottom.png",
                        title: 'Bottom',
                    },
                    {
                        id: 2,
                        image: "/Qusetion9/Top.png",
                        title: 'Top',
                    },
                    {
                        id: 3,
                        image: "/Qusetion9/Verse.png",
                        title: 'Verse',
                    },
                    {
                        id: 4,
                        image: "/Qusetion9/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 10,
                questionNo: 10,
                type: '2-Block',
                question: 'My sexuality',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion10/Pansexual.png",
                        title: 'Pansexual',
                    },
                    {
                        id: 2,
                        image: "/Qusetion10/Lesbian.png",
                        title: 'Lesbian',
                    },
                    {
                        id: 3,
                        image: "/Qusetion10/Bisexual.png",
                        title: 'Bisexual',
                    },
                    {
                        id: 4,
                        image: "/Qusetion10/Asexual.png",
                        title: 'Asexual',
                    },
                    {
                        id: 5,
                        image: "/Qusetion10/Genderqueer.png",
                        title: 'Genderqueer',
                    },
                    {
                        id: 6,
                        image: "/Qusetion10/Other.png",
                        title: 'Other',
                    },
                ]
            },
            {
                id: 11,
                questionNo: 11,
                type: '2-Block',
                question: 'Relationship Status',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion11/Single.png",
                        title: 'Single',
                    },
                    {
                        id: 2,
                        image: "/Qusetion11/Polyamorous.png",
                        title: 'Polyamorous',
                    },
                    {
                        id: 3,
                        image: "/Qusetion11/Monogymous.png",
                        title: 'Monogymous',
                    },
                    {
                        id: 4,
                        image: "/Qusetion11/Married.png",
                        title: 'Married',
                    },
                    {
                        id: 5,
                        image: "/Qusetion11/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 12,
                questionNo: 12,
                type: '3-Block',
                question: 'Gender Identity?',
                options: [
                    {
                        id: 1,
                        image: "/Qusetion12/CisWoman.png",
                        title: 'CisWoman',
                    },
                    {
                        id: 2,
                        image: "/Qusetion12/Intersex.png",
                        title: 'Intersex',
                    },
                    {
                        id: 3,
                        image: "/Qusetion12/TransWoman.png",
                        title: 'Trans Woman',
                    },
                    {
                        id: 4,
                        image: "/Qusetion12/TransMan.png",
                        title: 'Trans Man',
                    },
                    {
                        id: 5,
                        image: "/Qusetion12/NonBinary.png",
                        title: 'Non-Binary',
                    },
                    {
                        id: 6,
                        image: "/Qusetion12/Genderqueer.png",
                        title: 'Genderqueer',
                    },
                    {
                        id: 7,
                        image: "/Qusetion12/Androgynous.png",
                        title: 'Androgynous',
                    },
                    {
                        id: 8,
                        image: "/Qusetion12/Gender-fluid.png",
                        title: 'Gender-fluid',
                    },
                    {
                        id: 9,
                        image: "/Qusetion12/Gender-neutral.png",
                        title: 'Gender-neutral',
                    },
                    {
                        id: 10,
                        image: "/Qusetion12/Butch.png",
                        title: 'Butch',
                    },
                    {
                        id: 11,
                        image: "/Qusetion12/LipstickLesbian.png",
                        title: 'Lipstick Lesbian',
                    },
                    {
                        id: 12,
                        image: "/Qusetion12/ChapsticLesbian.png",
                        title: 'ChapsticLesbian',
                    },
                    {
                        id: 13,
                        image: "/Qusetion12/PreferNottoSay.png",
                        title: 'Prefer Not to Say',
                    },
                ]
            },
            {
                id: 13,
                questionNo: 13,
                type: 'description',
                question: {
                    title: "Tell us something we don’t already know",
                    placeholder: "Hello my name is..and i like to",
                },
            },
            {
                id: 14,
                questionNo: 14,
                type: 'photosection',
                question: {
                    title: "Add some photos",
                    subtitle: "Minimum of 2"
                },
                images: {
                    i1: {
                        uri: '',
                        response: [],
                    },
                    i2: {
                        uri: '',
                        response: [],
                    },
                    i3: {
                        uri: '',
                        response: [],
                    },
                    i4: {
                        uri: '',
                        response: [],
                    },
                    i5: {
                        uri: '',
                        response: [],
                    },
                }
            },
        ]
        response.status(200).send({
            message: "Success",
            data: {
                Questions: arr
            }
        })
    },

};

module.exports = crud;