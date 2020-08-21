'use strict';
let
    models = require('../models'),

    _ = require('lodash'),
    errorHandler = require('./errors.server.controller');
const bodyParser = require('body-parser');
const mongoose = require('../models/db.server.connect');
let mongoosse = require('mongoose'),
    constant = require('../constansts');
const { constants } = require('crypto');
const constansts = require('../constansts');
const moreFunctions = require('../fixtures/users.server.fixture');


var events = {
    async addEvent(req, response) {
        try {
            let body = req.body

            if (!body.eventImage || !body.eventTitle || !body.eventCategory || !body.eventFee || !body.eventAddress || !body.eventLocation || !body.eventTime || !body.eventDescription) {
                console.log(body)
                response.status(401).send({
                    success: false,
                    message: "Missing Fields"
                })
            }
            else {
                body.eventCreator = mongoosse.Types.ObjectId(req.userInfo._id)
                body.eventCategory = mongoosse.Types.ObjectId(body.eventCategory)
                body.eventLocation = mongoosse.Types.ObjectId(body.eventLocation)
                
                let role = req.userInfo.roles
                if (req.userInfo.roles[0] === 2) {
                    body.eventBy = constansts.EVENT_ROLE.USER
                }
                else if (req.userInfo.roles[0] === 3) {
                    body.eventBy = constansts.EVENT_ROLE.VENDOR

                }
                let createEvent = await models.events.create(body)
                console.log(createEvent)

                response.status(200).send({
                    success: true,
                    message: "Request Sent Successfully",
                })
            }
        }
        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),

            })
        }
    },

    async editEvent(req, response) {
        try {
            let body = req.body
            let id = req.params.eventId
            if (body.eventCategory || body.eventLocation) {
                body.eventCategory = mongoosse.Types.ObjectId(body.eventCategory)
                body.eventLocation = mongoosse.Types.ObjectId(body.eventLocation)
            }

            let event = await models.events.findOne({ _id: id })
            if (!event) {
                response.status(400).send({
                    success: false,
                    message: "No Events Found"
                })
            }
            else {
                let updatedEvent = await models.events.findOneAndUpdate({ _id: id }, body)
                console.log(updatedEvent)
                response.status(200).send({
                    success: true,
                    message: "Event Edited Successfully",
                })
            }
        }
        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

    async getEventsUser(req, response) {
        try {
            let date = req.body.date
            let { text, limit = 10, offset = 0, locationId } = req.query;
            console.log(req.userInfo.roles[0])
            if (!locationId || !date) {
                response.status(401).send({
                    success: false,
                    message: "LocationId and date is required",
                })

            }
            else {
                
                let aggigate =
                    [
                        {
                            $match: {
                                $and: [{
                                    eventLocation: { $eq: mongoosse.Types.ObjectId(locationId) }
                                },
                                {
                                    eventBy:{$eq:constant.EVENT_ROLE.USER}
                                },
                                {
                                    eventTime:{$gt:date}
                                },
                            ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'eventlocations',
                                as: 'eventLocation',
                                let: {
                                    eventLocation: '$eventLocation'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventLocation"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            locationId: '$_id',
                                            locationName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventLocation')
                        },
                        {
                            $lookup: {
                                from: 'categories',
                                as: 'eventCategory',
                                let: {
                                    eventCategory: '$eventCategory'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCategory"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            categoryId: '$_id',
                                            categoryName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCategory')
                        },
                        {
                            $lookup: {
                                from: 'users',
                                as: 'eventCreator',
                                let: {
                                    eventCreator: '$eventCreator'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCreator"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            userId: '$_id',
                                            username: 1,
                                            firstName:1,
                                            lastName:1,
                                            profileImages:1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCreator')
                        },
                        {
                            $match: {
                                $or: [{
                                    "eventTitle": {
                                        $regex: new RegExp(text, 'i')
                                    }
                                },
                                ]
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                "eventId": "$_id",
                                "eventImage": 1,
                                "eventTitle": 1,
                                "eventCategory": 1,
                                "eventFee": 1,
                                "eventAddress": 1,
                                "eventLocation": 1,
                                "eventTime": 1,
                                "eventDescription": 1,
                                "eventBy": 1,
                                "eventCreator":1,
                                "eventLink":1  
                            }
                        }

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

                let [events, count] = await Promise.all([
                    models.events.aggregate(aggigate),
                    models.events.aggregate(aggigateForCount)
                ]);

                response.status(200).send({
                    success: true,
                    message: "Events",
                    data: events,
                    totalRecords: (count && count[0] && count[0].count) || 0


                })
            }
        }

        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

    async getMyEvents(req, response) {
        try {
            
            let { text, limit = 10, offset = 0 } = req.query;
            let aggigate =
                [
                    {
                        $match: {
                            $and: [{
                                eventCreator: { $eq: mongoosse.Types.ObjectId(req.userInfo._id) }
                            },
                            
                        ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'eventlocations',
                            as: 'eventLocation',
                            let: {
                                eventLocation: '$eventLocation'
                            },
                            pipeline: [
                                {
                                    "$match": { "$expr": { "$eq": ["$_id", "$$eventLocation"] } }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        locationId: '$_id',
                                        locationName: 1
                                    }
                                },

                            ],
                        }

                    },
                    {
                        $unwind: ('$eventLocation')
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            as: 'eventCategory',
                            let: {
                                eventCategory: '$eventCategory'
                            },
                            pipeline: [
                                {
                                    "$match": { "$expr": { "$eq": ["$_id", "$$eventCategory"] } }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        categoryId: '$_id',
                                        categoryName: 1
                                    }
                                },

                            ],
                        }
                    },
                    {
                        $unwind: ('$eventCategory')
                    },
                    {
                        $lookup: {
                            from: 'users',
                            as: 'eventCreator',
                            let: {
                                eventCreator: '$eventCreator'
                            },
                            pipeline: [
                                {
                                    "$match": { "$expr": { "$eq": ["$_id", "$$eventCreator"] } }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        userId: '$_id',
                                        username: 1,
                                        firstName:1,
                                        lastName:1,
                                        profileImages:1
                                    }
                                },

                            ],
                        }

                    },
                    {
                        $unwind: ('$eventCreator')
                    },
                    {
                        $match: {
                            $or: [{
                                "eventTitle": {
                                    $regex: new RegExp(text, 'i')
                                }
                            },
                            ]
                        }
                    },
                    {
                        $project: {
                            "_id": 0,
                            "eventId": "$_id",
                            "eventImage": 1,
                            "eventTitle": 1,
                            "eventCategory": 1,
                            "eventFee": 1,
                            "eventAddress": 1,
                            "eventLocation": 1,
                            "eventTime": 1,
                            "eventDescription": 1,
                            "eventBy": 1,
                            "eventCreator":1,
                            "eventLink":1
                           
                        }
                    }

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

            let [events, count] = await Promise.all([
                models.events.aggregate(aggigate),
                models.events.aggregate(aggigateForCount)
            ]);

            response.status(200).send({
                success: true,
                message: "Events",
                data: events,
                totalRecords: (count && count[0] && count[0].count) || 0


            })

        }

        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }

    },

    async getEventsVendor(req, response) {
        try {
            let date = req.body.date
            let { text, limit = 10, offset = 0, locationId } = req.query;
            console.log(req.userInfo.roles[0])
            if (!date || !locationId) {
                response.status(401).send({
                    success: false,
                    message: "Data and LocationId are required",
                })
            }

            else {
                let aggigate =
                    [
                        {
                            $match: {
                                $and: [{
                                    eventLocation: { $eq: mongoosse.Types.ObjectId(locationId) }
                                },
                                {
                                    eventBy:{$eq:constant.EVENT_ROLE.VENDOR}
                                },
                                {
                                    eventTime:{$gt:date}
                                },
                                {
                                    isEventEnabled:true
                                }
                            ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'eventlocations',
                                as: 'eventLocation',
                                let: {
                                    eventLocation: '$eventLocation'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventLocation"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            locationId: '$_id',
                                            locationName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventLocation')
                        },
                        {
                            $lookup: {
                                from: 'categories',
                                as: 'eventCategory',
                                let: {
                                    eventCategory: '$eventCategory'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCategory"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            categoryId: '$_id',
                                            categoryName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCategory')
                        },
                        {
                            $lookup: {
                                from: 'users',
                                as: 'eventCreator',
                                let: {
                                    eventCreator: '$eventCreator'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCreator"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            userId: '$_id',
                                            username: 1,
                                            firstName:1,
                                            lastName:1,
                                            profileImages:1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCreator')
                        },
                        {
                            $match: {
                                $or: [{
                                    "eventTitle": {
                                        $regex: new RegExp(text, 'i')
                                    }
                                },
                                ]
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                "eventId": "$_id",
                                "eventImage": 1,
                                "eventTitle": 1,
                                "eventCategory": 1,
                                "eventFee": 1,
                                "eventAddress": 1,
                                "eventLocation": 1,
                                "eventTime": 1,
                                "eventDescription": 1,
                                "eventBy": 1,
                                "eventCreator":1,
                                "eventLink":1
                              
                            }
                        }

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

                let [events, count] = await Promise.all([
                    models.events.aggregate(aggigate),
                    models.events.aggregate(aggigateForCount)
                ]);

                response.status(200).send({
                    success: true,
                    message: "Events",
                    data: events,
                    totalRecords: (count && count[0] && count[0].count) || 0
                })
            }
        }

        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

    async vendorFutureEvents(req, response) {
        try {
            let date = req.body.date
            let { text, limit = 10, offset = 0, locationId } = req.query;
            console.log(req.userInfo.roles[0])
            if (!locationId || !date) {
                response.status(401).send({
                    success: false,
                    message: "LocationId and Date is required",
                })

            }
            else {
                let aggigate =
                    [
                        {
                            $match: {
                                $and: [{
                                    eventLocation: { $eq: mongoosse.Types.ObjectId(locationId) }
                                },
                                {
                                    eventBy:{$eq:constant.EVENT_ROLE.VENDOR}
                                },
                                {
                                    eventTime:{$gte:date}
                                },
                                {
                                    isEventEnabled:true
                                }
                            ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'eventlocations',
                                as: 'eventLocation',
                                let: {
                                    eventLocation: '$eventLocation'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventLocation"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            locationId: '$_id',
                                            locationName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventLocation')
                        },
                        {
                            $lookup: {
                                from: 'categories',
                                as: 'eventCategory',
                                let: {
                                    eventCategory: '$eventCategory'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCategory"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            categoryId: '$_id',
                                            categoryName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCategory')
                        },
                        {
                            $lookup: {
                                from: 'users',
                                as: 'eventCreator',
                                let: {
                                    eventCreator: '$eventCreator'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCreator"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            userId: '$_id',
                                            username: 1,
                                            firstName:1,
                                            lastName:1,
                                            profileImages:1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCreator')
                        },
                        {
                            $match: {
                                $or: [{
                                    "eventTitle": {
                                        $regex: new RegExp(text, 'i')
                                    }
                                },
                                ]
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                "eventId": "$_id",
                                "eventImage": 1,
                                "eventTitle": 1,
                                "eventCategory": 1,
                                "eventFee": 1,
                                "eventAddress": 1,
                                "eventLocation": 1,
                                "eventTime": 1,
                                "eventDescription": 1,
                                "eventBy": 1,
                                "eventCreator":1,
                                "eventLink":1
                              
                            }
                        }

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

                let [events, count] = await Promise.all([
                    models.events.aggregate(aggigate),
                    models.events.aggregate(aggigateForCount)
                ]);

                response.status(200).send({
                    success: true,
                    message: "Events",
                    data: events,
                    totalRecords: (count && count[0] && count[0].count) || 0


                })
            }
        }

        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

    async vendorPastEvents(req, response) {
        try {
            let date = req.body.date
            let { text, limit = 10, offset = 0, locationId } = req.query;
            console.log(req.userInfo.roles[0])
            if (!locationId || !date) 
            {
                response.status(401).send({
                    success: false,
                    message: "LocationId is and date required",
                })
            }
            else {
                let aggigate =
                    [
                        {
                            $match: {
                                $and: [
                                    {
                                    eventLocation: { $eq: mongoosse.Types.ObjectId(locationId) }
                                },
                                {
                                    eventBy:{$eq:constant.EVENT_ROLE.VENDOR}
                                },
                                {
                                    eventTime:{$lt:date}
                                },
                                {
                                    isEventEnabled:true
                                }
                            ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'eventlocations',
                                as: 'eventLocation',
                                let: {
                                    eventLocation: '$eventLocation'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventLocation"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            locationId: '$_id',
                                            locationName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventLocation')
                        },
                        {
                            $lookup: {
                                from: 'categories',
                                as: 'eventCategory',
                                let: {
                                    eventCategory: '$eventCategory'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCategory"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            categoryId: '$_id',
                                            categoryName: 1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCategory')
                        },
                        {
                            $lookup: {
                                from: 'users',
                                as: 'eventCreator',
                                let: {
                                    eventCreator: '$eventCreator'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$eventCreator"] } }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            userId: '$_id',
                                            username: 1,
                                            firstName:1,
                                            lastName:1,
                                            profileImages:1
                                        }
                                    },

                                ],
                            }

                        },
                        {
                            $unwind: ('$eventCreator')
                        },
                        {
                            $match: {
                                $or: [{
                                    "eventTitle": {
                                        $regex: new RegExp(text, 'i')
                                    }
                                },
                                ]
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                "eventId": "$_id",
                                "eventImage": 1,
                                "eventTitle": 1,
                                "eventCategory": 1,
                                "eventFee": 1,
                                "eventAddress": 1,
                                "eventLocation": 1,
                                "eventTime": 1,
                                "eventDescription": 1,
                                "eventBy": 1,
                                "eventCreator":1,
                                "eventLink":1
                              
                            }
                        }

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

                let [events, count] = await Promise.all([
                    models.events.aggregate(aggigate),
                    models.events.aggregate(aggigateForCount)
                ]);

                response.status(200).send({
                    success: true,
                    message: "Events",
                    data: events,
                    totalRecords: (count && count[0] && count[0].count) || 0


                })
            }
        }

        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },


    async interestedEvent(req,response)
    {
        try
        {
            let eventId = req.query.eventId
            if(!eventId)
            {
                response.status(401).send({
                    success: false,
                    message: "Event Id is required",
                })
            }
            else
            {
           let userId = mongoosse.Types.ObjectId(req.userInfo._id)
            eventId = mongoosse.Types.ObjectId(eventId)


            let event = await models.events.findOne({_id:eventId})
            if(!event)
            {
                response.status(400).send({
                    success: false,
                    message: "Event Not Found",
                })

            }
            else
            {
            let filter = {
                    $and:[
                        {
                            userId : {$eq:userId}
                        },
                        {
                            eventId:{$eq:eventId}
                        }
                    ]
                
            
        }
            let alreadyExist = await models.eventinterest.findOne(filter)
            console.log(alreadyExist)
            if(alreadyExist)
            {
                response.status(400).send({
                    success: false,
                    message: "Already Added",
                })

            }
            else
            {
            let interestToCreate ={
                userId:userId,
                eventId:eventId
            }
            let intrested = await models.eventinterest.create(interestToCreate)

            response.status(200).send({
                success: true,
                message: "Interest Saved",
            })
        }
    }
    }
}
        catch(error)
        {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

    async attendEvent(req,response)
    {
        try{
            let eventId = req.query.eventId
            if(!eventId)
            {
                response.status(401).send({
                    success: false,
                    message: "Event Id is required",
                })
            }
            else
            {
            let userId = mongoosse.Types.ObjectId(req.userInfo._id)
            eventId = mongoosse.Types.ObjectId(eventId)

            let event = await models.events.findOne({_id:eventId})
            if(!event)
            {
                response.status(400).send({
                    success: false,
                    message: "Event Not Found",
                })

            }
            else
            {
            let filter = {
                
             
                $and:[
                    {
                        userId : {$eq:userId}
                    },
                    {
                        eventId:{$eq:eventId}
                    }
                ]
            
        
    }
            let alreadyExist = await models.eventattend.findOne(filter)
            if(alreadyExist)
            {
                response.status(400).send({
                    success: false,
                    message: "Already Added",
                })
            }
            else
            {
            let interestToCreate =
            {
                userId:userId,
                eventId:eventId
            }
            let attend = await models.eventattend.create(interestToCreate)
            let event = await models.events.findOne({_id:eventId})
            let initialAttendees = event.eventAttendees
            let newAttendees = initialAttendees + 1
            let updateEvent = await models.events.findOneAndUpdate({_id:eventId},{$set:{eventAttendees:newAttendees}},{new:true})
            response.status(200).send({
                success: true,
                message: "Status Saved",

            })
        }
    }
  }
}
        catch(error)
        {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

 async getCount(req,response)
    {
        try
        {
            let eventId = req.query.eventId
            if(!eventId)
            {
                response.status(401).send({
                    success: false,
                    message: "Event Id is required",
                })
            }
            else
            {
            let event = await models.events.findOne({_id:eventId})
            if(!event)
            {
                response.status(400).send({
                    success: false,
                    message: "No Events Found",
                })
            }
            else
            {
                response.status(200).send({
                    success: true,
                    message: "Attendees",
                    data:{
                     Attendees: event.eventAttendees || {}
                    }
                })
            }
        }
        }
        catch(error)
        {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error),
            })
        }
    },

  
}

module.exports = events