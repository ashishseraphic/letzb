'use strict'
let models = require('../models'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    mongoose = require('mongoose'),
    constants = require('../constansts'),
    moment = require('moment'),
    request = require('request');
const { model } = require('../models/users.server.model');

// let Verifier = require('google-play-billing-validator');
// let serviceAccount = require('../../../../api-7757670881433143686-20705-2ee5aa03dee0.json');
// let products = [{ transactionId: '1000000677260100',0
// originalTransactionId: '1000000674872578',
// bundleId: 'com.light.inc',
// productId: 'com.light.annualPackage',
// purchaseDate: 1591766664000,
// expirationDate: 1591770264000,
// quantity: 1 }]
let moreFunctions = {

    async saveReceipt(req, response) {
        try {
            let body = req.body
            body.userId = mongoose.Types.ObjectId(req.userInfo._id);
            let user = await models.users.findOne({ _id: req.userInfo._id })
            if (!user) {

                response.status(400).send({
                    success: false,
                    message: "User Not Found",
                })
            }

            if (body["receipt-data"]) {
                const options = {
                    method: 'POST',
                    url: 'https://sandbox.itunes.apple.com/verifyReceipt',
                    body: {
                        "receipt-data": body["receipt-data"],
                        "password": "b831cfbf6f574bb0b032f8dfeb7ef404",
                        "exclude-old-transactions": true
                    },
                    json: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
                request(options, async function (error, res) {
                    if (error) {
                        response.status(500).send({
                            success: false,
                            message: "Cannot Save Receipt",
                            data: error
                        })
                    }
                    else {

                        let len = res.body.latest_receipt_info.length
                        let receipt = res.body.latest_receipt_info[len - 1]

                        console.log(res.body)

                        let receiptType = receipt.product_id
                        console.log(receiptType)

                        if (receiptType === constants.PURCHASE.BASIC) {
                            let basic = constants.SUBSCRIPTION_TYPES.BASIC

                            let jsonToCreate = {
                                userId: body.userId,
                                subscriptionType: 'ios',
                                iosReceiptDetails: {
                                    productId: receipt.product_id,
                                    transactionId: receipt.transaction_id,
                                    originalTransactionId: receipt.original_transaction_id,
                                    purchaseDate: receipt.purchase_date,
                                    expirationDate: receipt.expires_date,
                                    quantity: receipt.quantity
                                }
                            }

                            let newSubscription = await models.subscription.create(jsonToCreate)

                            let updateUser = await models.users.findOneAndUpdate({ _id: req.userInfo._id }, { $set: { subscriptionType: basic } }, { new: true })

                            response.status(200).send({
                                success: true,
                                message: "Receipt Successfully Saved",
                            })
                        }

                        else if (receiptType === constants.PURCHASE.BRONZE) {
                            let bronze = constants.SUBSCRIPTION_TYPES.BRONZE
                            let jsonToCreate = {
                                userId: body.userId,
                                subscriptionType: 'ios',
                                iosReceiptDetails: {
                                    productId: receipt.product_id,
                                    transactionId: receipt.transaction_id,
                                    originalTransactionId: receipt.original_transaction_id,
                                    purchaseDate: receipt.purchase_date,
                                    expirationDate: receipt.expires_date,
                                    quantity: receipt.quantity
                                }
                            }

                            let jsonToCreateOne = {
                                userId: body.userId,
                                subscriptionType: bronze,
                            }

                            let newSubscription = await models.subscription.create(jsonToCreate)

                            let newCurrentSubscription = await models.currentsubscription.create(jsonToCreateOne)

                            let date = newCurrentSubscription.created_at
                            let expireDate = moment(date).add(1, 'M').format('YYYY-MM-DD hh:mm')


                            // let milisec = receipt.expires_date_ms
                            // console.log(milisec)

                            // let expireDate = moment(milisec, "x").format("YYYY-MM-DD hh:mm")
                            // let expireDate = new Date(milisec).toISOString()

                            console.log(expireDate)

                            let updateCurrentSubscription = await models.currentsubscription.findOneAndUpdate({ _id: newCurrentSubscription._id }, { $set: { expireAt: expireDate } }, { new: true })

                            let updateUser = await models.users.findOneAndUpdate({ _id: req.userInfo._id }, { $set: { subscriptionType: 2 } }, { new: true })

                            response.status(200).send({
                                success: true,
                                message: "Receipt Successfully Saved",
                            })
                        }

                        else if (receiptType === constants.PURCHASE.SILVER) {
                            let silver = constants.SUBSCRIPTION_TYPES.SILVER

                            let jsonToCreate = {
                                userId: body.userId,
                                subscriptionType: 'ios',
                                iosReceiptDetails: {
                                    productId: receipt.product_id,
                                    transactionId: receipt.transaction_id,
                                    originalTransactionId: receipt.original_transaction_id,
                                    purchaseDate: receipt.purchase_date,
                                    expirationDate: receipt.expires_date,
                                    quantity: receipt.quantity
                                }
                            }
                            let jsonToCreateOne = {
                                userId: body.userId,
                                subscriptionType: silver,
                            }

                            let newSubscription = await models.subscription.create(jsonToCreate)

                            let newCurrentSubscription = await models.currentsubscription.create(jsonToCreateOne)

                            let date = newCurrentSubscription.created_at
                            let expireDate = moment(date).add(1, 'M').format('YYYY-MM-DD hh:mm')

                            console.log(expireDate)

                            let updateCurrentSubscription = await models.currentsubscription.findOneAndUpdate({ _id: newCurrentSubscription._id }, { $set: { expireAt: expireDate } }, { new: true })

                            let updateUser = await models.users.findOneAndUpdate({ _id: req.userInfo._id }, { $set: { subscriptionType: silver } }, { new: true })

                            response.status(200).send({
                                success: true,
                                message: "Receipt Successfully Saved",
                            })
                        }
                    }
                })
            }
            else {

                //     console.log("in else part")
                // let options = {
                //     email: serviceAccount.client_email,
                //     key: serviceAccount.private_key
                // }

                // let verifier = new Verifier(options)
                // let receipt = {
                //     packageName: body.metaData.packageName,
                //     productId: body.metaData.productId,
                //     purchaseToken: body.metaData.purchaseToken
                // };


                // let promiseData = verifier.verifySub(receipt)

                // promiseData.then(async function (res) {

                //     let subscriptionToCreate = {
                //         userId: body.userId,
                //         metaData: body.metaData,
                //         subscriptionType: 'android',
                //         androidReceiptDetails: res.payload
                //     }

                //     let currentToCreate = {
                //         userId: body.userId,
                //         subscriptionType: constants.SUBSCRIPTION_TYPES.BRONZE
                //     }

                //     let sub = await models.subscription.create(subscriptionToCreate)

                //     let curr = await models.currentsubscription.create(currentToCreate)

                //     let date = curr.created_at


                //     response.status(200).send({
                //         success: true,
                //         message: "Receipt Successfully Saved",
                //     })
                // })
                //     .catch(function (error) {
                //         response.status(400).send({
                //             success: false,
                //             message: "Cannot Save Receipt",
                //             data: error
                //         })
                //     })
            }
        }
        catch (error) {
            return response.status(500).send({
                success: false,
                message: error.message || "Something went wrong"
            })
        }
    },

    async verifyReceipt(req, response) {
        try {
            let userInfo = req.userInfo
            let currentSubscription = await models.currentsubscription.findOne({ userId: req.userInfo._id })

            let basic = constants.SUBSCRIPTION_TYPES.BASIC

            if (currentSubscription) {
                response.status(200).send({
                    success: true,
                    message: "Verified Successfully.",
                    data: {
                        firstName: userInfo.firstName || "",
                        lastName: userInfo.lastName || "",
                        fullName: userInfo.fullName || "",
                        username: userInfo.username || "",
                        birthday: userInfo.birthday || "",
                        roles: userInfo.roles,
                        email: userInfo.email || "",
                        phoneNumber: userInfo.phoneNumber || "",
                        venueName: userInfo.venueName || "",
                        hasAnsweredQuestions: userInfo.hasAnsweredQuestions || false,
                        location: userInfo.location || "",
                        userId: userInfo._id,
                        subscriptionType: currentSubscription.subscriptionType
                    }
                })
            }

            else if (!currentSubscription) {
                let changeType = await models.users.findOneAndUpdate({ _id: req.userInfo._id }, { $set: { subscriptionType: basic } }, { new: true })
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
                        venueName: userInfo.venueName || "",
                        hasAnsweredQuestions: userInfo.hasAnsweredQuestions || false,
                        location: userInfo.location || "",
                        userId: userInfo._id,
                        subscriptionType: changeType.subscriptionType
                    }
                })
            }
        }
        catch (error) {
            return response.status(500).send({
                success: false,
                message: error.message || "Something went wrong"
            })
        }
    },

    // async validate(req, response) {

    //     console.log("respomse here", response.body)
    //     try {
    //         if (response.body) {

    //             let findSubscription = await models.subscription.findOne({ 'iosReceiptDetails.originalTransactionId': response.body.original_transaction_id })

    //             let user = findSubscription.userId


    //             if (response.body.notificationType === constants.STATUS.RENEWAL) {

    //                 let receiptType = response.body.product_id

    //                 if (receiptType === constants.PURCHASE.BRONZE) {

    //                     let jsonToCreateOne = {
    //                         userId: user,
    //                         subscriptionType: 2,
    //                     }

    //                     let currentSub = await models.currentsubscription.create(jsonToCreateOne)


    //                     let date = currentSub.created_at
    //                     let expireDate = moment(date).add(1, 'M').format('YYYY-MM-DD hh:mm')

    //                     let updateCurrentSubscription = await models.currentsubscription.findOneAndUpdate({ _id: newCurrentSubscription._id }, { $set: { expireAt: expireDate } }, { new: true })

    //                 }
    //                 else if (receiptType === constants.PURCHASE.SILVER) {
    //                     let jsonToCreateOne = {
    //                         userId: user,
    //                         subscriptionType: 3,
    //                     }
    //                     let currentSub = await models.currentsubscription.create(jsonToCreateOne)
    //                 }
    //             }
    //             else if (response.body.notificationType === constants.STATUS.CANCEL) {
    //                 let findUser = await models.subscription.findOne({ 'iosReceiptDetails.originalTransactionId': response.body.original_transaction_id })

    //                 let user = findUser.userId

    //                 let updateUser = await models.users.findOneAndUpdate({ _id: user }, { $set: { subscriptionType: 1 } }, { new: true })

                    // let date = currentSub.created_at
                    // let expireDate = moment(date).add(1, 'M').format('YYYY-MM-DD hh:mm')

                    // let updateCurrentSubscription = await models.currentsubscription.findOneAndUpdate({ _id: newCurrentSubscription._id }, { $set: { expireAt: expireDate } }, { new: true })
    //             }
    //         }
    //         else {
    //             response.status(400).send({
    //                 success: false,
    //                 message: 'No Response'
    //             });
    //         }

    //     }
    //     catch (error) {
    //         return response.status(500).send({
    //             success: false,
    //             message: error.message || "Something went wrong"
    //         })

    //     }
    // },


    async getAllSubscriptions(req, response) {
        let params = req.query;
        if (req.userInfo.roles[0] != 1) {
            response.status(400).send({
                success: false,
                message: "Not allowed to access data"
            });
        }
        else {
            await models.subscription.aggregate([{
                $lookup: {
                    from: 'users',
                    as: 'user',
                    let: {
                        userId: '$userId'
                    },
                    pipeline: [
                        {
                            "$match": { "$expr": { "$eq": ["$_id", "$$userId"] } }
                        },
                        {
                            $project: {
                                "firstName": 1,
                                "lastName": 1,
                                "email": 1
                            }
                        }
                    ],
                }
            },
            {
                $unwind: ("$user")
            },
            {
                $project: {
                    userId: 0,
                    modified_at: 0,
                    created_at: 0,
                    __v: 0
                }
            }
            ])
                .exec((err, result) => {

                    if (err) {
                        response.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        response.status(200).send({
                            success: true,
                            data: result
                        });
                    }
                })
        }
    }
}

module.exports = moreFunctions;