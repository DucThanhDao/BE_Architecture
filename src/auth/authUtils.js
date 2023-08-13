' use strict '
const JWT = require("jsonwebtoken");
const { InternalServerError } = require("../core/err.response");

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

module.exports = {
    createTokenPair
}