'use strict'

const { CREATED, SuccessRespone } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessRespone({
            message: 'Add new Cart Succefully',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessRespone({
            message: 'Update Cart Succefully',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessRespone({
            message: 'Delete Cart Succefully',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessRespone({
            message: 'List Cart Succefully',
            metadata: await CartService.getListUserCart(req.query )
        }).send(res)
    }
}

module.exports = new CartController()