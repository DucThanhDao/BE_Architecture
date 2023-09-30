'use strict'
const express = require('express');
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helpers/handlerError');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

//get amount of discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/listProductCode', asyncHandler(discountController.getAllDiscountCodeWithProduct));

// authentication
router.use(authenticationV2);
router.post('/', asyncHandler(discountController.createDiscountCode))
router.get('/', asyncHandler(discountController.getAllDiscountCodeByShop))

module.exports = router