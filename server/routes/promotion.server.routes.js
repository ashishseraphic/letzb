"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    promotion = require('../controllers/promotions.server.controller');

router.route('/addpromotion')
    .post(auth.hasAuthentcation(), promotion.addPromotion)

    router.route('/editpromotion')
    .post(auth.hasAuthentcation(), promotion.editPromotion)

    router.route('/getpromotions')
    .get(auth.hasAuthentcation(), promotion.getPromotions)

    
module.exports = router