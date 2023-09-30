'use strict'

const DiscountService = require("../services/discount.service");
const { CREATED, SuccessRespone } = require("../core/success.response");

class DiscountController {
    createDiscountCode = async(req, res, next) => {
        new SuccessRespone({
            message: 'Successfull Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            })
        }).send(res)
    }

    getAllDiscountCodeByShop= async(req, res, next) => {
        new SuccessRespone({
            message: 'Successfull Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId,
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessRespone({
            message: 'Successfull Getting Code List',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Successfull Code Find',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = new DiscountController();