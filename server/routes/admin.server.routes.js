"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    admin = require('../controllers/admin.server.controllers')

    router.route('/loginadmin')
	.post(admin.signInAdmin);

    router.route('/usersadmin')
    .get(auth.hasAuthentcation(),admin.getUsersAdmin);
    
    router.route('/deleteuser/:id')
    .patch(auth.hasAuthentcation(),admin.deleteUser);
    
    router.route('/vendors')
    .get(auth.hasAuthentcation(), admin.getVendors);

    router.route('/approvedevents')
    .get(auth.hasAuthentcation(), admin.getApprovedEvents)

    router.route('/pendingevents')
    .get(auth.hasAuthentcation(), admin.getUnApprovedEvents)

    router.route('/approveevent/:id')
    .patch(auth.hasAuthentcation(), admin.approveEvent)

    router.route('/disapproveevent/:id')
    .patch(auth.hasAuthentcation(), admin.disapproveEvent)

    router.route('/deleteevent/:id')
    .patch(auth.hasAuthentcation(),admin.deleteEvent);
    

    router.route('/approvedpromotions')
    .get(auth.hasAuthentcation(), admin.getApprovedPromotions)

    router.route('/pendingpromotions')
    .get(auth.hasAuthentcation(), admin.getUnApprovedPromotions)


    router.route('/approvepromotion/:id')
    .patch(auth.hasAuthentcation(), admin.approvePromotion)

    router.route('/disapprovepromotion/:id')
    .patch(auth.hasAuthentcation(), admin.disapprovePromotion)

    router.route('/deletepromotion/:id')
    .patch(auth.hasAuthentcation(),admin.deletePromotion);
    
    router.route('/feedbacks')
    .get(auth.hasAuthentcation(),admin.getFeedbacks);

    router.route('/deletefeedback/:id')
    .patch(auth.hasAuthentcation(),admin.deleteFeedback);



    

module.exports = router