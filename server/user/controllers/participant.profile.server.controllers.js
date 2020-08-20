'use strict';
let _ = require('lodash'),
    config = require('../../config.server'),
    models = require('../../oauth/models'),
    async = require('async'),
    errorHandler = require('../../oauth/controllers/errors.server.controller');

let moreFunctions = {
    getUser: (req, response) => {
        models.users
            .find()
            .exec((err, results) => {
                if (err) {
                    // console.log("err", err)
                    response.status(400).send({
                        success: false,
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    results = JSON.parse(JSON.stringify(results))
                    response.status(200).send({
                        success: true,
                        data: results
                    })
                }
            })
    }
}
module.exports = _.merge(
    moreFunctions
);
