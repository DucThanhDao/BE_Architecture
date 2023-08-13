' use strict '

const { ForbidenRequestError, NotFoundRequestError, UnauthorizedRequestError } = require("../core/err.response");
const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async(req, res, next) => {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if(!key) {
        throw new ForbidenRequestError('Missing API Key')
    }
    //checkObject
    const objKey = await findById(key);
    if(!objKey) {
        throw new NotFoundRequestError('Api key not found')
    }
    req.objKey = objKey;
    return next()
}

// Closure func: return a fn which can use all props of its parent's func
const permission = (permission) => {
    return (req, res, next) => {
        if(!req?.objKey?.permissions) {
            throw new NotFoundRequestError('Permissions not found')
        }
        console.log('permission:::', req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if(!validPermission){
            throw new UnauthorizedRequestError('Permission Denied')
        }
        return next();
    }
}
module.exports = {
    apiKey,
    permission
}