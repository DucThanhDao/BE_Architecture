' use strict '
const JWT = require("jsonwebtoken");
const { InternalServerError, UnauthorizedRequestError, NotFoundRequestError } = require("../core/err.response");
const { asyncHandler } = require("../helpers/handlerError");
const { findByUserId } = require("../services/keytoken.service");

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    // access token
    const accessToken = JWT.sign(payload, publicKey, {
        // algorithm: 'RS256',
        expiresIn: '2 days'
    });
    const refreshToken = JWT.sign(payload, privateKey, {
        // algorithm: 'RS256',
        expiresIn: '7 days'
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
        if (err) {
            throw new InternalServerError()
        } else {
            console.log('decode verify:::', decode);
        }
    })
    return {accessToken, refreshToken}
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - check userId missing?
        2 - get access token
        3 - verify token
        4 - check user in db
        5 - check ketStore with userId
        6 - return next()
    */
    // 1
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) {
        throw new UnauthorizedRequestError('Invalid Request');
    }
    // 2
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundRequestError('Keystore not found');
    }
    //3 --> Log out need to check refresh token 
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) {
        throw new UnauthorizedRequestError('Token not Found');
    }
     
    //4
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) {
            throw new UnauthorizedRequestError('Invalid User');
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
})

module.exports = {
    createTokenPair,
    authentication
}