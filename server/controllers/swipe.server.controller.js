'use strict'
let models = require("../models"),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    mongoose = require('mongoose'),
    constant = require('../constansts'),
    moment = require('moment')

const { admin } = require('../../service/pushnotification');
const matchServerModel = require("../models/match.server.model");
const { UserList } = require("twilio/lib/rest/chat/v1/service/user");
const { json } = require("body-parser");
const { readSync } = require("fs");
// const { matches } = require("lodash");


var swipe = {
    async getUsers(req, response) {
        try {
            let { latitude, longitude, miles, limit = 10, offset = 0, minAge, maxAge } = req.query;
            let options = req.query.options
            // console.log("BodyType", options)


            if (!latitude || !longitude || !miles) {
                response.status(400).send({
                    success: false,
                    message: "Missing Field"
                })
            } else {

                //TODO Add fileter for Right Swip and Left Swip
                var METERS_PER_MILE = 1609.34
                longitude = parseFloat(longitude);
                latitude = parseFloat(latitude);
                console.log("req.userInfo._id", req.userInfo._id)
                let aggigate = [
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: [longitude, latitude] },
                            distanceField: "dist.calculated",
                            maxDistance: miles * METERS_PER_MILE,
                            includeLocs: "dist.location",
                            spherical: true
                        }
                    },

                    {
                        $match: {
                            $and: [{
                                "roles": 2,
                            },
                            {
                                "_id": { $ne: mongoose.Types.ObjectId(req.userInfo._id) }
                            },
                            ]
                        }

                    },
                    {
                        $lookup: {
                            "localField": "_id",
                            "from": "rightswipes",
                            "foreignField": "toWhomRightSwiped",
                            "as": "right"
                        }
                    },

                    { $match: { "right.whoRightSwiped": { $ne: mongoose.Types.ObjectId(req.userInfo._id) } } },

                    {
                        $lookup: {
                            "localField": "_id",
                            "from": "leftswipes",
                            "foreignField": "toWhomLeftSwiped",
                            "as": "left"
                        }
                    },

                    { $match: { "left.whoLeftSwiped": { $ne: mongoose.Types.ObjectId(req.userInfo._id) } } },
                    {
                        $project: {
                            _id: 1,
                            email: 1,
                            profileImages: 1,
                            hasAnsweredQuestions: 1,
                            username: 1,
                            birthday: 1,
                            phoneNumber: 1,
                            firstName: 1,
                            lastName: 1,
                            fullName: 1,
                            location: 1,
                            description: 1,
                            venueName: 1,
                            // age: {$year: "$birthday"} 
                            age: {
                                $divide: [{ $subtract: [new Date(), "$birthday"] },
                                (31558464000)]
                            }
                        }
                    }, {
                        $project: {
                            "age": { $subtract: ["$age", { $mod: ["$age", 1] }] },
                            _id: 1,
                            email: 1,
                            profileImages: 1,
                            hasAnsweredQuestions: 1,
                            username: 1,
                            birthday: 1,
                            phoneNumber: 1,
                            firstName: 1,
                            lastName: 1,
                            fullName: 1,
                            location: 1,
                            description: 1,
                            venueName: 1,
                        },
                    },
                ];

                if (minAge && maxAge) {
                    minAge = parseInt(minAge);
                    maxAge = parseInt(maxAge);
                    aggigate.push({
                        $match: {
                            $and: [{
                                age: {
                                    $gte: minAge,
                                    $lte: maxAge
                                }
                            }]
                        }
                    })
                }

                aggigate.push({
                    $lookup: {
                        from: "answers",
                        localField: "_id",
                        foreignField: "userId",
                        as: "answers"
                    }
                });

                aggigate.push({
                    $unwind: {
                        path: "$answers",
                        preserveNullAndEmptyArrays: true
                    }
                });

                //Premiun Filter
                if (options) {
                    const resultSplit = options.split(',');
                    aggigate.push({
                        $match: { "answers.answersArray.answerId": { $all: resultSplit.map(id => mongoose.Types.ObjectId(id)) } }
                    }

                    )
                }
                // if (horoscope) {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(horoscope) } } } }
                //     )
                // }
                // if (meetUpFor) {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(meetUpFor) } } } }
                //     )

                // }
                // if (schedule)
                // {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(schedule) } } } }
                //     )

                // }
                // if(searchingFor)
                // {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(searchingFor) } } } }
                //     )
                // }
                // if(firstIdealDate)
                // {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(firstIdealDate) } } } }
                //     )
                // }
                // if(loveLanguage)
                // {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(loveLanguage) } } } }
                //     )
                // }
                // if(lifeStyle)
                // {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(lifeStyle) } } } }
                //     )
                // }
                // if(sexualPrefernce)
                // {   
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(sexualPrefernce) } } } }
                //     )

                // }
                // if(RelationShipStatus)
                // {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(RelationShipStatus) } } } }
                //     )
                // }
                // if(genderIdentity)
                // {
                //     aggigate.push(
                //         { $match: { "answers.answersArray": { $elemMatch: { answerId: mongoose.Types.ObjectId(genderIdentity) } } } }
                //     )
                // }


                let aggigateForCount = [...aggigate]

                aggigateForCount.push({
                    $group: {
                        _id: null,
                        count: {
                            $sum: 1
                        }
                    }
                });

                aggigate.push({
                    $skip: parseInt(offset)
                });

                aggigate.push({
                    $limit: parseInt(limit)
                });

                let [usersList, count] = await Promise.all([
                    models.users.aggregate(aggigate),
                    models.users.aggregate(aggigateForCount)
                ]);
                // console.log(usersList)

                usersList = usersList ? JSON.parse(JSON.stringify(usersList)) : [];
                let questions = await models.questions.find({ isDeleted: false });
                questions = questions ? JSON.parse(JSON.stringify(questions)) : [];
                usersList.map((user) => {
                    let answerToSend = []
                    if (user.answers) {
                        user.answers.answersArray.forEach((ans) => {
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

                    user.answers = answerToSend
                });
                // console.log(usersList)
                response.status(200).send({
                    success: true,
                    message: "Success.",
                    data: {
                        usersList,
                        totalRecords: (count && count[0] && count[0].count) || 0
                    }
                })
            }
        } catch (error) {
            // console.log(err)
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

    async leftSwipe(req, response) {
        try {
            let { id } = req.params
            if (!id) {
                response.status(400).send({
                    success: false,
                    message: "Missing Field"
                })
            }

            let user = await models.users.findOne({ _id: req.userInfo._id })

            if (!user) {
                response.status(400).send({
                    success: false,
                    message: "User Not Found"
                })
            }


            /////////////////////////////////////////////////////
            //CODE WITH VALIDATION
            /////////////////////////////////////////////////////

            let checkSubscription = await models.currentsubscription.findOne({ userId: req.userInfo._id })

            if (!checkSubscription) {
                // USER TYPE BASIC

                let start = moment().startOf('month').format('YYYY-MM-DD hh:mm');
                let end = moment().endOf('month').format('YYYY-MM-DD hh:mm');

                let checkRightCount = await models.rightswipe.find({
                    $and: [
                        {
                            created_at: {
                                $gte: start,
                                $lt: end
                            }
                        },
                        {
                            whoRightSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
                        }

                    ]

                }).count();

                console.log(checkRightCount)

                let checkLeftCount = await models.leftswipe.find({
                    $and: [
                        {
                            created_at: {
                                $gte: start,
                                $lt: end
                            }
                        },
                        {
                            whoLeftSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
                        }
                    ]

                }).count();
                console.log(checkLeftCount)

                let total = checkLeftCount + checkRightCount
                console.log(total)
                if (total >= 5) {
                    response.status(400).send({
                        success: false,
                        message: "Swipe Limit Reached",
                        data: {}
                    })
                }
                else {
                    let exist = await models.leftswipe.findOne({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id });

                    if (!exist) {
                        await models.leftswipe.create({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id })
                    }
                    response.status(200).send({
                        success: true,
                        message: "Left Swipe Success.",
                        data: {}
                    })
                }
            }
            else if (checkSubscription) {

                let type = checkSubscription.subscriptionType

                if (type === constant.SUBSCRIPTION_TYPES.BRONZE) {

                    let subscriptionDate = checkSubscription.created_at

                    let addMonth = moment().add(1, 'M').format('YYYY-MM-DD hh:mm')

                    let checkRightCountBronzr = await models.rightswipe.find({
                        $and: [
                            {
                                created_at: {
                                    $gte: subscriptionDate,
                                    $lt: addMonth
                                }
                            },
                            {
                                whoRightSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
                            }
                        ]
                    }).count();

                    console.log("IN bRONZE PART Right Count", checkRightCountBronzr)

                    let checkLeftCountBronze = await models.leftswipe.find({
                        $and: [
                            {
                                created_at: {
                                    $gte: subscriptionDate,
                                    $lt: addMonth
                                }
                            },
                            {
                                whoLeftSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
                            }
                        ]
                    }).count();
                    console.log("In Bronze Part left Count", checkLeftCountBronze)

                    let total = checkLeftCountBronze + checkRightCountBronzr
                    if (total >= 8) {
                        response.status(400).send({
                            success: false,
                            message: "Swipe Limit Reached",
                            data: {}
                        })
                    }
                    else {
                        let exist = await models.leftswipe.findOne({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id });

                        if (!exist) {
                            await models.leftswipe.create({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id })
                        }
                        response.status(200).send({
                            success: true,
                            message: "Left Swipe Success.",
                            data: {}
                        })
                    }
                }

                // USER WITH SILVER SUBSCRIPTION

                else if (type === constant.SUBSCRIPTION_TYPES.SILVER) {

                    let exist = await models.leftswipe.findOne({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id });

                    if (!exist) {
                        await models.leftswipe.create({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id })
                    }
                    response.status(200).send({
                        success: true,
                        message: "Left Swipe Success.",
                        data: {}
                    })

                }
            }

            /////////////////////////////////////////////////////
            /////////////////////////////////////////////////////
            //CODE WITHOUT VALIDATION
            /////////////////////////////////////////////////////
            ////////////////////////////////////////////////////



            // let exist = await models.leftswipe.findOne({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id });

            // if (!exist) {
            //     await models.leftswipe.create({ toWhomLeftSwiped: id, whoLeftSwiped: req.userInfo._id })
            // }
            // response.status(200).send({
            //     success: true,
            //     message: "Left Swipe Success.",
            //     data: {}
            // })

        }
        catch (error) {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },


    async rightSwipe(req, response) {
        try {
            let { id } = req.params
            if (!id) {
                response.status(400).send({
                    success: false,
                    message: errorHandler.getErrorMessage(err)
                })
            }

            /////////////////////////////////////////////////////
            /////////////////////////////////////////////////////
            //CODE WITH VALIDATION
            /////////////////////////////////////////////////////
            /////////////////////////////////////////////////////


            let user = await models.users.findOne({ _id: req.userInfo._id })

            if (!user) {
                response.status(400).send({
                    success: false,
                    message: "User Not Found"
                })
            }
            ////////////////////////////////////////////////////////
            //Check for user subscription
            /////////////////////////////////////////////////////// 

            // let checkSubscription = await models.currentsubscription.findOne({ userId: req.userInfo._id })

            // if (!checkSubscription) {
            //BASIC USER TYPE 
            // let start = moment().startOf('month').format('YYYY-MM-DD hh:mm');
            // let end = moment().endOf('month').format('YYYY-MM-DD hh:mm');

            // let checkRightCount = await models.rightswipe.find({
            //     $and: [
            //         {
            //             created_at: {
            //                 $gte: start,
            //                 $lt: end
            //             }
            //         },

            //         {
            //             whoRightSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
            //         }

            //     ]

            // }).count();

            // console.log(checkRightCount)

            // let checkLeftCount = await models.leftswipe.find({
            //     $and: [
            //         {
            //             created_at: {
            //                 $gte: start,
            //                 $lt: end
            //             }
            //         },
            //         {
            //             whoLeftSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
            //         }
            //     ]

            // }).count();
            // console.log(checkLeftCount)

            // let total = checkLeftCount + checkRightCount
            // if (total >= 5) {
            //     response.status(400).send({
            //         success: false,
            //         message: "Swipe Limit Reached",
            //         data: {}
            //     })
            // }

            // else {
            //     let exist = await models.rightswipe.findOne({ whoRightSwiped: req.userInfo._id, toWhomRightSwiped: id })

            //     if (!exist) {
            //         await models.rightswipe.create({
            //             whoRightSwiped: req.userInfo,
            //             toWhomRightSwiped: id
            //         })
            //     }

            //     let matchFound = await models.rightswipe.findOne({ whoRightSwiped: id });

            //     if (matchFound) {
            //         let whoMatched = await models.match.findOne({ whoMatched: id, withWhomMatched: req.userInfo._id })
            //         let withWhomMatched = await models.match.findOne({ whoMatched: req.userInfo._id, withWhomMatched: id })

            //         if (!whoMatched && !withWhomMatched) {
            //             await models.match.create({
            //                 whoMatched: req.userInfo,
            //                 withWhomMatched: id
            //             })

            //             await models.match.create({
            //                 whoMatched: id,
            //                 withWhomMatched: req.userInfo
            //             })
            //         }

            // let matchNotif = await models.users.findOne({ _id: matchFound.whoRightSwiped }).populate()
            // console.log("with whom matched ",matchNotif)
            //     let deviceToken = matchNotif.deviceDetails.map((d) => d.deviceToken)
            //     let payload = {
            //         notification: {
            //             title: `It's a match with ${matchNotif.username}`,
            //             body: ""
            //         }
            //     };

            //     let options = {
            //         priority: "high",
            //         timeToLive: 60 * 60 * 24
            //     };

            //     admin.messaging().sendToDevice(deviceToken, payload, options)
            //         .then(function (response) {
            //             console.log("Successfully sent message:", response);
            //         })
            //         .catch(function (error) {
            //             console.log("Error sending message:", error);
            //         });


            // }
            //         response.status(200).send({
            //             success: true,
            //             message: "Right Swipe Success.",
            //             data: {
            //                 match: matchFound ? true : false
            //             }
            //         })



            //     }
            // }

            // else if (checkSubscription) {

            //     let type = checkSubscription.subscriptionType

            //USER WITH BRONZE SUBSCRIPTION

            // if (type === constant.SUBSCRIPTION_TYPES.BRONZE) {

            // let subscriptionDate = checkSubscription.created_at

            // let addMonth = moment().add(1, 'M').format('YYYY-MM-DD hh:mm')

            // let checkRightCount = await models.rightswipe.find({
            //     $and: [
            //         {
            //             created_at: {
            //                 $gte: subscriptionDate,
            //                 $lt: addMonth
            //             }
            //         },
            //         {
            //             whoRightSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
            //         }
            //     ]
            // }).count();

            // console.log("IN bRONZE PART Right Count", checkRightCount)

            // let checkLeftCount = await models.leftswipe.find({
            //     $and: [
            //         {
            //             created_at: {
            //                 $gte: subscriptionDate,
            //                 $lt: addMonth
            //             }
            //         },
            //         {
            //             whoLeftSwiped: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
            //         }
            //     ]
            // }).count();

            //     console.log("In Bronze Partt left Count", checkLeftCount)

            //     let total = checkLeftCount + checkRightCount
            //     if (total >= 8) {
            //         response.status(400).send({
            //             success: false,
            //             message: "Swipe Limit Reached",
            //             data: {}
            //         })
            //     }

            //     else {

            //         let exist = await models.rightswipe.findOne({ whoRightSwiped: req.userInfo._id, toWhomRightSwiped: id })

            //         if (!exist) {
            //             await models.rightswipe.create({
            //                 whoRightSwiped: req.userInfo,
            //                 toWhomRightSwiped: id
            //             })
            //         }

            //         let matchFound = await models.rightswipe.findOne({ whoRightSwiped: id });

            //         if (matchFound) {
            //             let whoMatched = await models.match.findOne({ whoMatched: id, withWhomMatched: req.userInfo._id })
            //             let withWhomMatched = await models.match.findOne({ whoMatched: req.userInfo._id, withWhomMatched: id })

            //             if (!whoMatched && !withWhomMatched) {
            //                 await models.match.create({
            //                     whoMatched: req.userInfo,
            //                     withWhomMatched: id
            //                 })

            //                 await models.match.create({
            //                     whoMatched: id,
            //                     withWhomMatched: req.userInfo
            //                 })
            //             }

            //             let matchNotif = await models.users.findOne({ _id: matchFound.whoRightSwiped }).populate()
            //             // console.log("with whom matched ",matchNotif)
            //             let deviceToken = matchNotif.deviceDetails.map((d) => d.deviceToken)
            //             let payload = {
            //                 notification: {
            //                     title: `It's a match with ${matchNotif.username}`,
            //                     body: ""
            //                 }
            //             };
            //             let options = {
            //                 priority: "high",
            //                 timeToLive: 60 * 60 * 24
            //             };

            //             admin.messaging().sendToDevice(deviceToken, payload, options)
            //                 .then(function (response) {
            //                     console.log("Successfully sent message:", response);
            //                 })
            //                 .catch(function (error) {
            //                     console.log("Error sending message:", error);
            //                 });
            //         }
            //         response.status(200).send({
            //             success: true,
            //             message: "Right Swipe Success.",
            //             data: {
            //                 match: matchFound ? true : false
            //             }
            //         })
            //     }
            // }

            // USER WITH SILVER SUBSCRIPTION

            //     else if (type === constant.SUBSCRIPTION_TYPES.SILVER) {
            //         let exist = await models.rightswipe.findOne({ whoRightSwiped: req.userInfo._id, toWhomRightSwiped: id })

            //         if (!exist) {
            //             await models.rightswipe.create({
            //                 whoRightSwiped: req.userInfo,
            //                 toWhomRightSwiped: id
            //             })
            //         }

            //         let matchFound = await models.rightswipe.findOne({ whoRightSwiped: id });

            //         if (matchFound) {
            //             let whoMatched = await models.match.findOne({ whoMatched: id, withWhomMatched: req.userInfo._id })
            //             let withWhomMatched = await models.match.findOne({ whoMatched: req.userInfo._id, withWhomMatched: id })

            //             if (!whoMatched && !withWhomMatched) {
            //                 await models.match.create({
            //                     whoMatched: req.userInfo,
            //                     withWhomMatched: id
            //                 })

            //                 await models.match.create({
            //                     whoMatched: id,
            //                     withWhomMatched: req.userInfo
            //                 })
            //             }

            //             let matchNotif = await models.users.findOne({ _id: matchFound.whoRightSwiped }).populate()

            //             let deviceToken = matchNotif.deviceDetails.map((d) => d.deviceToken)
            //             let payload = {
            //                 notification: {
            //                     title: `It's a match with ${matchNotif.username}`,
            //                     body: ""
            //                 }
            //             };

            //             let options = {
            //                 priority: "high",
            //                 timeToLive: 60 * 60 * 24
            //             };

            //             admin.messaging().sendToDevice(deviceToken, payload, options)
            //                 .then(function (response) {
            //                     console.log("Successfully sent message:", response);
            //                 })
            //                 .catch(function (error) {
            //                     console.log("Error sending message:", error);
            //                 });


            //         }
            //         response.status(200).send({
            //             success: true,
            //             message: "Right Swipe Success.",
            //             data: {
            //                 match: matchFound ? true : false
            //             }
            //         })
            //     }
            // }

            ////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
            // CODE WITHOUT VALIDATION
            ///////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////


            let exist = await models.rightswipe.findOne({ whoRightSwiped: req.userInfo._id, toWhomRightSwiped: id })

            if (!exist) {
                await models.rightswipe.create({
                    whoRightSwiped: req.userInfo,
                    toWhomRightSwiped: id
                })
            }

            let matchFound = await models.rightswipe.findOne({ whoRightSwiped: id });

            if (matchFound) {
                let whoMatched = await models.match.findOne({ whoMatched: id, withWhomMatched: req.userInfo._id })
                let withWhomMatched = await models.match.findOne({ whoMatched: req.userInfo._id, withWhomMatched: id })

                if (!whoMatched && !withWhomMatched) {
                    await models.match.create({
                        whoMatched: req.userInfo,
                        withWhomMatched: id
                    })

                    await models.match.create({
                        whoMatched: id,
                        withWhomMatched: req.userInfo
                    })
                }

                let matchNotif = await models.users.findOne({ _id: matchFound.whoRightSwiped }).populate()
                // console.log("with whom matched ",matchNotif)
                let deviceToken = matchNotif.deviceDetails.map((d) => d.deviceToken)
                let payload = {
                    notification: {
                        title: `It's a match with ${matchNotif.username}`,
                        body: ""
                    }
                };

                let options = {
                    priority: "high",
                    timeToLive: 60 * 60 * 24
                };

                admin.messaging().sendToDevice(deviceToken, payload, options)
                    .then(function (response) {
                        console.log("Successfully sent message:", response);
                    })
                    .catch(function (error) {
                        console.log("Error sending message:", error);
                    });


            }
            response.status(200).send({
                success: true,
                message: "Right Swipe Success.",
                data: {
                    match: matchFound ? true : false
                }
            })
        }
        catch (error) {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },
    async getAllMatches(req, response) {
        try {
            let { text, limit = 10, offset = 0 } = req.query;
            // console.log('use rinfrp', req.userInfo._id)
            let aggigate =
                [
                    {
                        $match: {
                            $and: [{
                                whoMatched: { $ne: mongoose.Types.ObjectId(req.userInfo._id) }
                            },
                            {
                                withWhomMatched: { $eq: mongoose.Types.ObjectId(req.userInfo._id) }
                            }]
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            as: 'matches',
                            let: {
                                whoMatched: '$whoMatched'
                            },
                            pipeline: [
                                {
                                    "$match": { "$expr": { "$eq": ["$_id", "$$whoMatched"] } }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        email: 1,
                                        profileImages: 1,
                                        hasAnsweredQuestions: 1,
                                        username: 1,
                                        birthday: 1,
                                        phoneNumber: 1,
                                        firstName: 1,
                                        lastName: 1,
                                        fullName: 1,
                                        location: 1,
                                        description: 1,
                                        venueName: 1,
                                        // age: {$year: "$birthday"} 
                                        age: {
                                            $divide: [{ $subtract: [new Date(), "$birthday"] },
                                            (31558464000)]
                                        }
                                    }
                                },

                            ],
                        }

                    },
                    {
                        $match: {
                            $or: [{
                                "matches.username": {
                                    $regex: new RegExp(text, 'i')
                                }
                            },
                            {
                                "matches.firstName": {
                                    $regex: new RegExp(text, 'i')
                                }
                            },
                            {
                                "matches.lastName": {
                                    $regex: new RegExp(text, 'i')
                                }

                            },

                            ]
                        }
                    },

                    {
                        $project: {
                            matches: 1,
                            _id: 0

                        }
                    },
                ]
            let aggigateForCount = [...aggigate]

            aggigateForCount.push({
                $group: {
                    _id: null,
                    count: {
                        $sum: 1
                    }
                }
            });

            aggigate.push({
                $skip: parseInt(offset)
            });

            aggigate.push({
                $limit: parseInt(limit)
            });

            let [matches, count] = await Promise.all([
                models.match.aggregate(aggigate),
                models.match.aggregate(aggigateForCount)
            ]);
            matches = matches.reduce((a, c) => {
                a.push(...c.matches);
                return a;
            }, [])

            response.status(200).send({
                success: true,
                message: "Matches",
                data: matches,
                totalRecords: (count && count[0] && count[0].count) || 0
            })


        }
        catch (error) {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    }
};
module.exports = swipe