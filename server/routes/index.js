'use strict';


var users = require('./auth.server.routes'),
    questions = require("./question.server.route.js"),
    swipe = require('./swipe.server.route'),
    profiles= require('./profile.server.routes'),
    categories = require('./category.server.routes'),
    eventlocation = require('./eventlocation.server.routes'),
    events = require('./event.server.routes'),
    admin = require('./admin.server.routes'),
    privacy= require('./privacy.server.routes'),
    promotion = require('./promotion.server.routes'),
    feedback=require('./feedback.server.route'),
    subscription = require('./subscription.server.routes'),
    routes = { 
        users,
        questions,
        swipe,
        profiles,
        categories,
        eventlocation,
        events,
        admin,
        privacy,
        promotion,
        feedback,
        subscription
    };

module.exports = routes;
