' use strict '

const keytokenModel = require("../models/keytoken.model");
const {Types} = require("mongoose")

class KeyTokenService {
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

    static findByUserId = async(userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean();
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.findByIdAndRemove(id);
    }
}

module.exports = KeyTokenService