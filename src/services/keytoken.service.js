' use strict '

const keytokenModel = require("../models/keytoken.model");

class KeyToken {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        // public key gen by asymmetric algorithm will be a buffer
        // const publicKeyString = publicKey.toString();
        //lv0
        // const token = await keytokenModel.create({
            // user: userId,
            // publicKey: publicKey,
            // privateKey: privateKey,
        // })
        // return token ? token.publicKey : null;

        //lv xxx
        const filter = {user: userId}, update = {
            publicKey: publicKey, privateKey: privateKey, refreshTokensUsed: [], refreshToken: refreshToken
        }, options = { upsert: true, new: true };
        const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
        return tokens ? tokens.publicKey : null
    }
}

module.exports = KeyToken