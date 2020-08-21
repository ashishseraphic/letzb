'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    // User = mongoose.model('User'),
    config = require('../../config.server'),
    models = require('../../models'),
    jwt = require('jsonwebtoken'),
    errorHandler = require('../errors.server.controller');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
    models.users.findOne({
        _id: id
    }).exec(function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    });
};

/**
 * Passport Authentication
 */
exports.hasAuthentcation = function async(req, res, next) {
    return (req, res, next) => {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token) {
            //Decode the token
            token = token.replace(/^Bearer\s/, '')
            jwt.verify(token, config.secret, (err, decod) => {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: "Wrong Token"
                    });
                }
                else {
                    if (!decod.data) {
                        res.status(403).json({
                            success: false,
                            message: "Invalid Token"
                        });
                    } else {
                        models.users.findOne({ _id: decod.data })
                            .then((user) => {
                                if (!user) {
                                    res.status(403).json({
                                        success: false,
                                        message: "User Not Found"
                                    });
                                } else {
                                    user = JSON.parse(JSON.stringify(user));
                                    delete user.deviceDetails
                                    req.userInfo = user;
                                    next();
                                }
                            })
                            .catch((error) => {
                                res.status(403).json({
                                    success: false,
                                    message: errorHandler.getErrorMessage(error)
                                });
                            })
                    }
                }
            });
        }
        else {
            res.status(403).json({
                success: false,
                message: "No Token"
            });
        }
    }
};

exports.hasAuthorization = function (action) {
    var _this = this;
    return function (req, res, next) {
        if (req.user) {
            let canDo = hasPermission(req.user, action);
            if (canDo) next()
            else return res.status(401).send({
                message: 'Unauthorised'
            });
        } else {
            return res.status(401).send({
                success: false,
                message: 'Unauthorised'
            });
        }
    };
};


/**
 * Function to check if particular user have particular permission
 */
function hasPermission(user, operation) {

    // If have super admin then allowed to do every action
    if (user && user.isSuperAdmin) {
        return true;
    }

    // If user is not a super admin then check if user have permission to-do an action
    if (user && user.permissions && user.permissions.indexOf(operation) !== -1) {
        return true;
    }

    return false;
}
