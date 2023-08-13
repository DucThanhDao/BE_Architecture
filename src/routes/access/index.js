'use strict'
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../middlewares/handlerError.middleware');
const router = express.Router();

// Signup
router.post('/shop/signup', asyncHandler(accessController.signUp));

module.exports = router