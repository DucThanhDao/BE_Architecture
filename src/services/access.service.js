'use strict'

const shopModel = require("../models/shop.model");
const bscypt = require ("bcrypt");
const crypto = require ("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, InternalServerError, UnauthorizedRequestError, ForbidenRequestError } = require("../core/err.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN', //--> Normally the value will be encode to hide tthe logic in the system
}

class AccessService { 

    /*
        check this token used?
    */
    static handleRefreshTokenV2  = async ({refreshToken, user, keyStore}) => {
        const {userId, email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbidenRequestError('Someting wrong happened. Please login again');
        }

        if(keyStore.refreshToken != refreshToken) {
            throw new UnauthorizedRequestError('Shop is not registered!');
        }

        //check userId
        const foundShop = await findByEmail({email});
        if(!foundShop){
            throw new UnauthorizedRequestError('Shop is not registered!');
        }
        
        // Create new AT & RT
        const tokens = await createTokenPair({userId: foundShop._id, email}, keyStore.publicKey, keyStore.privateKey);

        // Update old token
        await KeyTokenService.findByRefreshTokenAndUpdate( refreshToken, {
            refreshToken: tokens.refreshToken,
            $push: {
                refreshTokensUsed: refreshToken, //used to get new token
            }
        })
        return {
            user: {userId, email},
            tokens
        }
    }

    static handleRefreshToken  = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            // decode who send this request?
            console.log("token reused")
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey);
            // --> refresh token are reused --> delete all keystore
            console.log(userId);
            await KeyTokenService.deleteKeyByUserId(userId);
            throw new ForbidenRequestError('Someting wrong happened. Please login again');
        }
        
        //Find refresh token in db
        const holderToken =  await KeyTokenService.findByRefreshToken(refreshToken);
        if(!holderToken) {
            throw new UnauthorizedRequestError('Shop is not registered!');
        }
        // verify token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey);
        
        //check userId
        const foundShop = await findByEmail({email});
        if(!foundShop){
            throw new UnauthorizedRequestError('Shop is not registered!');
        }

        // Create new AT & RT
        const tokens = await createTokenPair({userId: foundShop._id, email}, holderToken.publicKey, holderToken.privateKey);

        // Update old token
        const response = await KeyTokenService.findByRefreshTokenAndUpdate( refreshToken, {
            refreshToken: tokens.refreshToken,
            $push: {
                refreshTokensUsed: refreshToken, //used to get new token
            }
        })
        console.log('res:::', response);
        return {
            user: {userId, email},
            tokens
        }
    }

    static logout = async ({keyStore}) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey
    }

    //Signin
    /*
        1- check email
        2- match pw
        3- create AT & PT and save
        4- generate token
        5- get data and return login
    */
    static login = async ({ email, password, refreshToken}) => {
        //1.
        const foundShop = await findByEmail({email});
        if(!foundShop) {
            throw new BadRequestError('Shop not registered!'); // For security, dev can change the message into the code which is defined internally
        }
        //2.
        const match = bscypt.compare(password, foundShop.password);
        if(!match) {
            throw new UnauthorizedRequestError('Authentication error');
        }
        //3.
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const {_id: userId} = foundShop
        const tokens = await createTokenPair({userId: userId, email}, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId: userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens,
        }
    }


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