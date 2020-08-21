"use strict"

var express = require('express'),
    router = express.Router();

let auth = require('../controllers/users/users.authorization.server.controller'),
    category = require('../controllers/categories.server.controller')

    router.route('/addcategory')
    .post(auth.hasAuthentcation(), category.addCategory)

    router.route('/editcategory/:id')
    .post(auth.hasAuthentcation(), category.editCategory)


    router.route('/getcategories')
    .get(auth.hasAuthentcation(), category.getCategories)

    router.route('/deletecategory/:id')
    .patch(auth.hasAuthentcation(), category.deleteCategory)

    router.route('/category/:id')
    .get(auth.hasAuthentcation(), category.getCategory)

    
module.exports = router