
const Models = require('../models');
const errorHandler = require('./errors.server.controller')
const getPrivacyPolicy = async (req, res) => {

    try {
        let privacyPolicyObj = await Models.privacy.findOne(Models.privacyPolicy)
        if (!privacyPolicyObj) {
            res.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(err)
            })
        }
        else {
            return res.status(400).send(
                privacyPolicyObj.privacyPolicyHtml
            )
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: errorHandler.getErrorMessage(error)
        })

    }
}

const getTermsAndConditions = async (req, res) => {
    try {

        let termsObj = await Models.terms.findOne(Models.term)
        if (!termsObj) {
            res.status(400).send({
                success: false,
                message: errorHandler.getErrorMessage(err)
            })
        }
        else {
            return res.status(400).send(

                termsObj.termsHtml
            )
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: errorHandler.getErrorMessage(error)
        })

    }
}

module.exports = {
    getPrivacyPolicy,
    getTermsAndConditions
}