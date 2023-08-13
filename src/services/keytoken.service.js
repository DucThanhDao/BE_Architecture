' use strict '

const keytokenModel = require("../models/keytoken.model");

class KeyToken {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        // public key gen by asymmetric algorithm will be a buffer
        // const publicKeyString = publicKey.toString();
        const token = await keytokenModel.create({
            user: userId,
            publicKey: publicKey,
            privateKey: privateKey,
        })
        return token ? token.publicKey : null;
    }
}

module.exports = KeyToken