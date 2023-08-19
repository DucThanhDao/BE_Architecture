'use strict'

const { CREATED, SuccessRespone } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    handleRefreshToken = async(req, res, next) => {
        // new SuccessRespone({
        //     message: 'Get tokens success',
        //     metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res)

        //v2
        new SuccessRespone({
            message: 'Get tokens success',
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            })
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessRespone ({
            message: 'Log in successfully',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessRespone({
            message: 'Log out success',
            metadata: await AccessService.logout({keyStore: req.keyStore}),
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Create Shop successfully',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))
    }
}

module.exports = new AccessController()