'use strict'
const express = require('express');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/handlerError');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))
// authentication
router.use(authenticationV2);

//#region POST/PUT
router.post('/', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShop))
//#endregion

//#region Query
router.get('/draft/all', asyncHandler(productController.getAllDraftForShop))
router.get('/pulished/all', asyncHandler(productController.getAllPulishForShop))
//#endregion

module.exports = router