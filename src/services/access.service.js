'use strict'

const shopModel = require("../models/shop.model");
const bscypt = require ("bcrypt");
const crypto = require ("crypto");
const KeyToken = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, InternalServerError } = require("../core/err.response");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN', //--> Normally the value will be encode to hide tthe logic in the system
}

class AccessService { 
    // Service will be used multiple time --> write fn as static fn for quick access without initialize (new Service())
    static signUp = async ({name, email, password}) => {
        //step1: check valid email
        const holderlShop = await shopModel.findOne({email: email}).lean() // reduce size obj of response --> improve performance
        if(holderlShop) {
            throw new BadRequestError('Err: Shop already registered!')
        }
        
        // Hash pw
        const passwordHash = await bscypt.hash(password, 10); // 10 is best practice for performance and security
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP],
        })
        // Provide access token for auto redirect to main page (instead of redirect to login and force user to login again)
        if(newShop) {
            // created private key (sign new token) & public key (verify token)
            /* const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type:'pkcs1', //public key crypto standard // Max hoa bat doi xung
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type:'pkcs1', //public key crypto standard // Max hoa bat doi xung
                    format: 'pem'
                }
            }) */
            //------Public key CryptoGraphy Standart------
            //With smaller system
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            console.log({privateKey, publicKey}); // save collection KeyStore
            const keyStore = await KeyToken.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if(!keyStore) {
                throw new InternalServerError('Internal server error. An unexpected error occurred on the server')
            }
            
            // const publicKeyObject = crypto.createPublicKey(publicKeyString)
            //create token pair
            const tokens = await createTokenPair({userId: shopModel._id, email}, publicKey, privateKey);
            console.log('Created Token Success::', tokens);

            return {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop}),
                tokens,
            }
        }
        return {
            code: 201,
            metadata: null
        }
    }
}

module.exports = AccessService