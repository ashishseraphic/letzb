'use strict';
let models = require('../models'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller');
const bodyParser = require('body-parser');
const mongoose = require('../models/db.server.connect');
let mongoosse = require('mongoose'),
    constant = require('../constansts');
const constansts = require('../constansts');


var promotions = {

    async addPromotion(req, response) {
        try {
            let body = req.body

            if (!body.promotionImage || !body.promotionTitle || !body.promotionAddress || !body.promotionLocation || !body.promotionDate || !body.promotionDescription) {
                console.log(body)
                response.status(401).send({
                    success: false,
                    message: "Missing Fields"
                })
            }
            else {
                body.promotionCreator = mongoosse.Types.ObjectId(req.userInfo._id)
                body.promotionLocation = mongoosse.Types.ObjectId(body.promotionLocation)
                body.promotionBy = constansts.EVENT_ROLE.VENDOR

                if(req.userInfo.roles[0]===3)
                {
                    let createPromotion = await models.promotions.create(body)    
                    response.status(200).send({
                        success: true,
                        message: "Request Sent Successfully",
                    })

                }
                else
                {
                    response.status(500).send({
                        success: false,
                        message: "User is not allowed to add promotions",
                    })
                }
            }
        }
        catch (error) {
            response.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(error),

            })
        }
    },

    async editPromotion(req, response) {
        try {
            let body = req.body
            let id = req.query.promotionId
            if (body.promotionLocation) {
                body.promotionLocation = mongoosse.Types.ObjectId(body.promotionLocation)
            }
        console.log(id)
            let promotion = await models.promotions.findOne({ _id: id })
            // console.log(promotion)
            if (!promotion) {
                response.status(400).send({
                    success: false,
                    message: "No Promotions Found"
                })
            }
            else {
                let updatedPrmotion = await models.promotions.findOneAndUpdate({ _id: id }, body)
                console.log(updatedPrmotion)
                response.status(200).send({
                    success: true,
                    message: "Promotion Edited Successfully",
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

    async getPromotions(req, response) {
        try {
            console.log(req.userInfo)
          if(req.userInfo.roles[0]===3)
          {
              console.log(req.userInfo._id)
            let { text, limit = 10, offset = 0 } = req.query;
            let aggigate =
                [
                    {
                       "$match": {
                            $and: [
                            {
                                promotionCreator: { $eq: mongoosse.Types.ObjectId(req.userInfo._id) }
                            }
                        ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'eventlocations',
                            as: 'promotionLocation',
                            let: 
                            {
                            promotionLocation: '$promotionLocation'
                            },
                            pipeline: [
                                {
                                    "$match": { "$expr": { "$eq": ["$_id", "$$promotionLocation"] } }
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
                        $unwind: ('$promotionLocation')
                    },
                    {
                        $lookup: {
                            from: 'users',
                            as: 'promotionCreator',
                            let: {
                                promotionCreator: '$promotionCreator'
                            },
                            pipeline: [
                                {
                                    "$match": { "$expr": { "$eq": ["$_id", "$$promotionCreator"] } }
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
                        $unwind: ('$promotionCreator')
                    },
                    {
                        $match: {
                            $or: [{
                                "promotionTitle": {
                                    $regex: new RegExp(text, 'i')
                                }
                            },
                            ]
                        }
                    },
                    {
                        $project: {
                            "_id": 0,
                            "promotionId": "$_id",
                            "promotionImage": 1,
                            "promotionTitle": 1,
                            "promotionAddress": 1,
                            "promotionLocation": 1,
                            "promotionDate": 1,
                            "promotionDescription": 1,
                            // "promotionBy": 1,
                            "promotionCreator":1,
                            'isPromotionEnabled':1
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

            let [promotions, count] = await Promise.all([
                models.promotions.aggregate(aggigate),
                models.promotions.aggregate(aggigateForCount)
            ]);
           
            promotions = _.orderBy(promotions, ['promotionDate'], ['desc'])
            response.status(200).send({
                success: true,
                message: "Promotions",
                data: promotions,
                totalRecords: (count && count[0] && count[0].count) || 0
            })      
        }
          else
          {
            let { text, limit = 10, offset = 0 } = req.query;
                let aggigate =
                    [
                        {
                           "$match": {
                                $and: [
                                {
                                    isPromotionEnabled:true
                                },
                                {

                                }
                            ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'eventlocations',
                                as: 'promotionLocation',
                                let: 
                                {
                                promotionLocation: '$promotionLocation'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$promotionLocation"] } }
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
                            $unwind: ('$promotionLocation')
                        },
                        {
                            $lookup: {
                                from: 'users',
                                as: 'promotionCreator',
                                let: {
                                    promotionCreator: '$promotionCreator'
                                },
                                pipeline: [
                                    {
                                        "$match": { "$expr": { "$eq": ["$_id", "$$promotionCreator"] } }
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
                            $unwind: ('$promotionCreator')
                        },
                        {
                            $match: {
                                $or: [{
                                    "promotionTitle": {
                                        $regex: new RegExp(text, 'i')
                                    }
                                },
                                ]
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                "promotionId": "$_id",
                                "promotionImage": 1,
                                "promotionTitle": 1,
                                "promotionAddress": 1,
                                "promotionLocation": 1,
                                "promotionDate": 1,
                                "promotionDescription": 1,
                                // "promotionBy": 1,
                                "promotionCreator":1,
                                'isPromotionEnabled':1
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

                let [promotions, count] = await Promise.all([
                    models.promotions.aggregate(aggigate),
                    models.promotions.aggregate(aggigateForCount)
                ]);
               
                promotions = _.orderBy(promotions, ['promotionDate'], ['desc'])
                response.status(200).send({
                    success: true,
                    message: "Promotions",
                    data: promotions,
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

    async approvePromotion(req, response)
    {
        try
        {
            let id = req.params.id
            let enablePromotion = await models.promotions.findOneAndUpdate({_id:id},{$set:{isPromotionEnabled:true}},{new: true})
            if(!enablePromotion)
            {
                response.status(400).send({
					success: false,
					message: "Something Went Wrong"
				});
            }
            else
            {
                response.status(200).send({
					success: true,
					message: "Promotion Approved Success"
				});
            }
        }
        catch(error)
        {
            response.status(500).send({
                success: false,
                message: errorHandler.getErrorMessage(error)
            });

        }

    }
}

module.exports = promotions