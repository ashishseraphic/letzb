'use strict';

var express = require('express');
var router = express.Router();

var auth = require('../controllers/users/users.authorization.server.controller'),
    swipe = require('../controllers/swipe.server.controller')


router.route('/leftswipe/:id')
    .post(auth.hasAuthentcation(), swipe.leftSwipe);
    
router.route('/rightswipe/:id')
    .post(auth.hasAuthentcation(), swipe.rightSwipe);

router.route('/users')
    .get(auth.hasAuthentcation(), swipe.getUsers);

    router.route('/matches')
    .get(auth.hasAuthentcation(), swipe.getAllMatches);

module.exports = router;
