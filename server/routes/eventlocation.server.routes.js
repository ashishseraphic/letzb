"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    eventlocation = require('../controllers/eventlocation.server.controller');

     router.route('/addlocation')
    .post(auth.hasAuthentcation(), eventlocation.addLocation)

    router.route('/editlocation/:id')
    .post(auth.hasAuthentcation(), eventlocation.editLocation)

    router.route('/getlocations')
    .get(auth.hasAuthentcation(), eventlocation.getLocations)

    router.route('/deletelocation/:id')
    .patch(auth.hasAuthentcation(), eventlocation.deleteLocation)


    router.route('/location/:id')
    .get(auth.hasAuthentcation(), eventlocation.getLocation)

    
module.exports = router