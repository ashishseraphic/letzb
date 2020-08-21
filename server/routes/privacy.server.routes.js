'use strict';

var express = require('express');
var router = express.Router();

var privacy = require('../controllers/static.server.controller')


router.route('/privacy')
	.get(privacy.getPrivacyPolicy);

router.route('/terms')
	.get(privacy.getTermsAndConditions);



module.exports = router;
