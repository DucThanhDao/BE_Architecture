'use strict'
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/handlerError');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

// Signup
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authenticationV2)
router.post('/shop/handleRequestToken', asyncHandler(accessController.handleRefreshToken))
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router