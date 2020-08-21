"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    profile = require('../controllers/users/users.crud.server.controller')

router.route('/userprofile')
    .get(auth.hasAuthentcation(), profile.userProfile)

router.route('/updateprofile')
    .post(auth.hasAuthentcation(), profile.updateProfile)

router.route('/uploadphoto')
    .post(auth.hasAuthentcation(), profile.uploadPhoto);
    
module.exports = router