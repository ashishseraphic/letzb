"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    subscription = require('../controllers/subscription.server.controller');

    router.route('/savereceipt')
    .post(auth.hasAuthentcation(), subscription.saveReceipt)

    router.route('/verify')
    .get(auth.hasAuthentcation(),subscription.verifyReceipt)

    router.route('/subscriptions')
    .get(auth.hasAuthentcation(),subscription.getAllSubscriptions),

    // router.route('/validate')
    // .post(subscription.validate)

module.exports = router