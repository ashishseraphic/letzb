"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    event = require('../controllers/event.server.controller');


    router.route('/addevent')
    .post(auth.hasAuthentcation(), event.addEvent)

    router.route('/editevent/:eventId')
    .post(auth.hasAuthentcation(), event.editEvent)

    router.route('/geteventsuser')
    .post(auth.hasAuthentcation(), event.getEventsUser)

    router.route('/geteventsvendor')
    .post(auth.hasAuthentcation(), event.getEventsVendor)

    router.route('/myevents')
    .get(auth.hasAuthentcation(), event.getMyEvents)

    router.route('/futureevents')
    .post(auth.hasAuthentcation(),event.vendorFutureEvents)

    router.route('/pastevents')
    .post(auth.hasAuthentcation(), event.vendorPastEvents)

    router.route('/interested')
    .get(auth.hasAuthentcation(), event.interestedEvent)

    router.route('/attending')
    .get(auth.hasAuthentcation(), event.attendEvent)

    router.route('/eventcount')
    .get(auth.hasAuthentcation(), event.getCount)

    
    
module.exports = router