'use strict'

const { CREATED, SuccessRespone } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
    //#region  POST
    createProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Create Product successfully',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessRespone({
            message: 'Publish Product Successfully',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessRespone({
            message: 'Publish Product Successfully',
            metadata: await ProductService.unpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }
    //#endregion

    //#region  Query
    /**
     * @des Get all draft product for shop
     * @param {Number} limit 
     * @return {JSON} 
     */
    getAllDraftForShop = async(req, res, next) => {
        new SuccessRespone({
            message: 'Get Draft List Succesfully',
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    /**
     * @des Get all pulish product for shop
     * @param {Number} limit 
     * @return {JSON} 
     */
    getAllPulishForShop = async(req, res, next) => {
        new SuccessRespone({
            message: 'Get Publish List Succesfully',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    getListSearchProduct = async(req, res, next) => {
        new SuccessRespone({
            message: 'Get Search List Succesfully',
            metadata: await ProductService.searchProductByUser(req.params)
        }).send(res)
    }

    findAllProducts = async(req, res, next) => {
        new SuccessRespone({
            message: 'Get Products List Succesfully',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async(req, res, next) => {
        new SuccessRespone({
            message: 'Get Specific Product Succesfully',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id,
            })
        }).send(res)
    }

    //#endregion
    //#region PUT
    updateProduct =  async(req, res, next) => {
        new SuccessRespone({
            message: 'Update Product Succesfully',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }
    //#endregion
    
}

module.exports = new ProductController()