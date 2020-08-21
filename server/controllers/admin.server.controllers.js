'use strict';
let
	models = require('../models'),
	jwt = require('jsonwebtoken'),
	_ = require('lodash'),
	config = require('../config.server'),
	errorHandler = require('./errors.server.controller');
const { response } = require('express');
const { feedback } = require('../models');


exports.signInAdmin = async function (req, response) {

	try {
		if (!req.body.email || !req.body.password) {
			response.status(401).json({
				success: false,
				message: 'Authentication failed. Missing credentials.'
			});
		}
		let email = await models.users.findOne({ email: req.body.email })
		console.log(email)
		if (!email) {
			response.status(400).send({
				success: false,
				message: 'Authentication failed. User Not Found.'
			});
		}
		else if (!email.authenticate(req.body.password)) {
			response.status(400).send({
				success: false,
				message: 'Authentication failed. Incorrect Password'
			});

		}
		else if (email.roles[0] != 1) {
			response.status(400).send({
				success: false,
				message: 'Authentication Failed. You Are Not Allowed To Login'
			});
		}
		else {
			let token = jwt.sign({
				data: email
			}, config.secret, {
				expiresIn: config.sessionExpire
			});

			response.status(200).send({
				success: true,
				token: token,
				data: {
					email: email.email,
					roles: email.roles
				}
			})
		}
	}
	catch (error) {
		response.status(401).json({
			success: false,
			message: errorHandler.getErrorMessage(error)
		});

	}

};

exports.getUsersAdmin = async function (req, response) {
	try {
		// let { limit = 10, offset = 0 } = req.query;
		let params = req.query;
		if(req.userInfo.roles[0]!=1)
		{
			responses.status(400).send({
				success:false,
				message:"Not allowed to access data"
			})
		}
		else
		{
	
		models.users.aggregate([
			{
				$match: {
					$and: [
						{
							"roles": 2
						},
						{
							isDeleted: false
						}
					]

				}
			},
			{
				$match: {
					$or: [
						{
						firstName: {
							$regex: new RegExp(params.text, 'i')
						}
					}, {
						email: {
							$regex: new RegExp(params.text, 'i')
						}
					},
					{
						lastName: {
							$regex: new RegExp(params.text, 'i')
						}
					},
					]
				}
			},
			// {
			// 	$skip: parseInt(offset)
			// },

			// {
			// 	$limit: parseInt(limit)
			// }

		])
			.exec((err, result) => {

				if (err) {
					response.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					response.status(200).send(result);
				}
			})
	}
}
	catch (error) {
		response.status(401).send({
			success: false,
			message: errorHandler.getErrorMessage(error)
		});
	}
}



exports.deleteUser = async function (req, response) {
	try {

		let id = req.params.id;
		let user = await models.users.findOne({ _id: id })
		if (!user) {
			response.status(400).send({
				success: false,
				message: "User Not Found"
			});

		}
		else {
			let deleteUser = await models.users.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } })
			if (deleteUser) {
				response.status(200).send({
					success: true,
					message: "User Deleted Successfully"
				});
			}
		}
	}
	catch (error) {
		response.status(500).send({
			success: false,
			message: errorHandler.getErrorMessage(error)
		});
	}
}


exports.getVendors = async function (req, response) {
	try {
		// let { limit = 10, offset = 0 } = req.query;
		let params = req.query;
		if(req.userInfo.roles[0]!=1)
		{
			responses.status(400).send({
				success:false,
				message:"Not allowed to access data"
			})
		}
		else
		{
		models.users.aggregate([
			{
				$match: {
					$and:[
						{
							"roles": 3
						},
						{
							isDeleted: false
						}
					]

				}
			},
			{
				$match: {
					$or: [{
						firstName: {
							$regex: new RegExp(params.text, 'i')
						}
					}, {
						email: {
							$regex: new RegExp(params.text, 'i')
						}
					},
					{
						lastName: {
							$regex: new RegExp(params.text, 'i')
						}
					},
					]
				}
			},
			// {
			// 	$skip: parseInt(offset)
			// },

			// {
			// 	$limit: parseInt(limit)
			// }
			

		])
			.exec((err, result) => {

				if (err) {
					response.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					response.status(200).send(result);
				}
			})
	}
}	
	catch (error) {
		response.status(401).send({
			success: false,
			message: errorHandler.getErrorMessage(error)
		});
	}
}




exports.getApprovedEvents = async function (req, response) {
	try {
		// let { limit = 10, offset = 0 } = req.query;
		let params = req.query;
		if(req.userInfo.roles[0]!=1)
		{
			responses.status(400).send({
				success:false,
				message:"Not allowed to access data"
			})
		}
		else
		{
			let aggigate =
                    [
                        {
                            $match: {
                                $and: [                           
                                {
                                    isDeleted:false
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
                                        $regex: new RegExp(params.text, 'i')
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
				// 	if(offset)
				// 	{
				// 	aggigate.push({
				// 		$skip: parseInt(offset)
				// 	});
				// }
				// if(limit)
				// {
				// 	aggigate.push({
				// 		$limit: parseInt(limit)
				// 	});
				// }
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
		response.status(401).send({
			success: false,
			message: errorHandler.getErrorMessage(error)
		});
	}
}

exports.getUnApprovedEvents = async function (req, response) {
	try {
		// let { limit = 10, offset = 0 } = req.query;
		let params = req.query;
		if(req.userInfo.roles[0]!=1)
		{
			responses.status(400).send({
				success:false,
				message:"Not allowed to access data"
			})
		}
		else
		{
			let aggigate =
                    [
                        {
                            $match: {
                                $and: [
                              
                                {
                                    isDeleted:false
                                },
                                {
                                    isEventEnabled:false
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
                                        $regex: new RegExp(params.text, 'i')
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
				// 	if(offset)
				// 	{
				// 	aggigate.push({
				// 		$skip: parseInt(offset)
				// 	});
				// }
				// if(limit)
				// {
				// 	aggigate.push({
				// 		$limit: parseInt(limit)
				// 	});
	
				// }
	
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
		response.status(401).send({
			success: false,
			message: errorHandler.getErrorMessage(error)
		});
	}
}

exports.getApprovedPromotions = async function(req, response)
{
	try {
		// let { text, limit = 10, offset = 0 } = req.query;
	let params = req.query
			let aggigate =
				[
					{
					   "$match": {
							$and: [
								{
									isDeleted:false
								},
							{
								isPromotionEnabled:true
							},
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
									$regex: new RegExp(params.text, 'i')
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
	// 		if(offset)
	// 		{
	// 		aggigate.push({
	// 			$skip: parseInt(offset)
	// 		});
	// 	}
	// 	if(limit)
	// {
	// 		aggigate.push({
	// 			$limit: parseInt(limit)
	// 		});
	// 	}
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
	catch (error) {
		response.status(400).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}

}


exports.getUnApprovedPromotions = async function(req, response)
{
	try {
	
		// let { text, limit = 10, offset = 0 } = req.query;
		let params = req.query
			let aggigate =
				[
					{
					   "$match": {
							$and: [
								{
									isDeleted:false
								},
							{
								isPromotionEnabled:false
							},
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
									$regex: new RegExp(params.text, 'i')
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
		// 	if(offset)
		// 	{
		// 	aggigate.push({
		// 		$skip: parseInt(offset)
		// 	});
		// 	}
		// 	if(limit)
		// 	{
		// 	aggigate.push({
		// 		$limit: parseInt(limit)
		// 	});
		// }
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
	catch (error) {
		response.status(400).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}

}

exports.approveEvent = async function(req, response)
{
	try
	{
		let id = req.params.id
		let enableEvent = await models.events.findOneAndUpdate({_id:id},{$set:{isEventEnabled:true}},{new: true})
		if(!enableEvent)
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
				message: "Event Approval Success"
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

exports.approvePromotion = async function(req, response)
{
	try
	{
		let id = req.params.id
		let enableEvent = await models.promotions.findOneAndUpdate({_id:id},{$set:{isPromotionEnabled:true}},{new: true})
		if(!enableEvent)
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
				message: "Event Approval Success"
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

exports.disapproveEvent = async function(req, response)
{
	try
	{
		let id = req.params.id
		let enableEvent = await models.events.findOneAndUpdate({_id:id},{$set:{isEventEnabled:false}},{new: true})
		if(!enableEvent)
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
				message: "Event Approval Success"
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

exports.disapprovePromotion = async function(req, response)
{
	try
	{
		let id = req.params.id
		let enableEvent = await models.promotions.findOneAndUpdate({_id:id},{$set:{isPromotionEnabled:false}},{new: true})
		if(!enableEvent)
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
				message: "Event Approval Success"
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

exports.deleteEvent = async (req, response)=>
{
	try
	{
		let id = req.params.id
		let deleteEvent = await models.events.findOneAndUpdate({_id:id},{$set:{isDeleted:true}},{new: true})
		if(!deleteEvent)
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
				message: "Event Deleted Successfully"
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

exports.deletePromotion = async (req, response)=>
{
	try
	{
		let id = req.params.id
		let deletePromotion = await models.promotions.findOneAndUpdate({_id:id},{$set:{isDeleted:true}},{new: true})
		if(!deletePromotion)
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
				message: "Promotion Deleted Successfully"
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




exports.getFeedbacks = async function(req, response)
{
	try {
	
		// let { text, limit = 10, offset = 0 } = req.query;
		
			let aggigate =
				[
					{
					   "$match": {
										isDeleted:false
								}
						
						
					},
					{
						$lookup: {
							from: 'users',
							as: 'user',
							let: {
								user: '$userId'
							},
							pipeline: [
								{
									"$match": { "$expr": { "$eq": ["$_id", "$$user"] } }
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
						$unwind: ('$user')
					},
					// {
					// 	$match: {
					// 		$or: [{
					// 			"promotionTitle": {
					// 				$regex: new RegExp(text, 'i')
					// 			}
					// 		},
					// 		]
					// 	}
					// },
					{
						$project: {
							"_id": 0,
							"feedbackId": "$_id",
							"name": 1,
							"email": 1,
							"subject": 1,
							"message": 1,
				
							"user":1,
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
			// if(offset)
			// {

			// aggigate.push({
			// 	$skip: parseInt(offset)
			// });
			// }
			// }
			// aggigate.push({
			// 	$skip: parseInt(offset)
			// });
			// if(limit)
			// {
			// 	aggigate.push({
			// 		$limit: parseInt(limit)
			// 	});			
			// }
			// aggigate.push({
			// 	$limit: parseInt(limit)
			// });

			let [feedbacks, count] = await Promise.all([
				models.feedback.aggregate(aggigate),
				models.feedback.aggregate(aggigateForCount)
			]);
		   
			// feed = _.orderBy(promotions, ['promotionDate'], ['desc'])

			response.status(200).send({
				success: true,
				message: "Feedbacks",
				data: feedbacks,
				totalRecords: (count && count[0] && count[0].count) || 0
			})
		}
	catch (error) {
		response.status(400).send({
			success: false,
			message: errorHandler.getErrorMessage(error),
		})
	}

}

exports.deleteFeedback = async (req, response)=>
{
	try
	{
		let id = req.params.id
		let deleteFeedback = await models.feedback.findOneAndUpdate({_id:id},{$set:{isDeleted:true}},{new: true})
		if(!deleteFeedback)
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
				message: "Feedback Deleted Successfully"
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

