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

    findAllProduct = async(req, res, next) => {
        new SuccessRespone({
            message: 'Get Search List Succesfully',
            metadata: await ProductService.findAllProduct(req.query)
        }).send(res)
    }

    //#endregion

    
}

module.exports = new ProductController()