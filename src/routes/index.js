'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

/*
Need to check whether current system use our API or not:
--> check API key
--> Check permission
*/
// check api key
router.use(apiKey)
// check permission
router.use(permission('0000'))


router.use('/v1/api', require('./access'))

module.exports = router