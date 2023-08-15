'use strict'

const { CREATED, SuccessRespone } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    login = async (req, res, next) => {
        new SuccessRespone ({
            message: 'Log in successfully',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        console.log(req.keyStore);
        new SuccessRespone({
            message: 'Log out success',
            metadata: await AccessService.logout({keyStore: req.keyStore}),
        }).send(res)
    }
    signUp = async (req, res, next) => {
        console.log(`[P]::signUp::`, req.body);
        new CREATED({
            message: 'Create Shop successfully',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))
    }
}

module.exports = new AccessController()