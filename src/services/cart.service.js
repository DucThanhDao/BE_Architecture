/**
 * Key features: Cart service
 * - Add product to cart [User]
 * - Reduce product quantity by one [User]
 * - increase product quantity by one [User]
 * - get cart [User]
 * - Delete All [User]
 * - Delete Cart item [User]
 */
'use strict'
const { NotFoundRequestError } = require('../core/err.response');
const cartModel = require('../models/cart.model');
const cart = require('../models/cart.model');
const { getProductById } = require('../models/repositories/product.repo');

class CartService {
    // start repo
    static async createUserCart({userId, product}){
        const query = {
            cart_userId: userId,
            cart_state: 'active',
        },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        },
        options = {upsert: true, new: true}
        // Check whether cart is exist
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({userId, product}){
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        },
        updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity,
            }
        },
        options = {upsert: true, new: true}
        // Check whether cart is exist
        return await cart.findOneAndUpdate(query, updateSet, options);
    }

    //end repo
    
    /**
     * Use case: Add new item
     * - If exist --> increase quantity by  1
     * - If not --> adding in cart
     */
    static async addToCart({userId, product = {}}){
        console.log(cartModel);
        const userCart = await cart.findOne({cart_userId: userId})
        if(!userCart) {
            // create Cart for user 
            return await CartService.createUserCart({userId, product});
        }
        // Empty cart
        if(!userCart.cart_products.length){
            userCart.cart_products = [product];
            return await userCart.save()
        }
        // Exist chosen item in cart --> update quantity
        return await CartService.updateUserCartQuantity({userId, product})
    }

    /*
    shop_order_ids:[
        {
            shopId,
            item_products: [
                quantity,
                price,
                shopId,
                old_quantity,
                productId,
            ],
            version
        }
    ]
     */
    static async addToCartV2({userId, shop_order_ids}){
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0];
        //check product 
        const foundProduct = await getProductById(productId);
        if(!foundProduct){
            throw new NotFoundRequestError('Product not found')
        };
        if(foundProduct.product_shop.toString()!==shop_order_ids[0]?.shopId){
            throw new NotFoundRequestError('Product do not belong to this shop')
        };
        if(quantity === 0){
            //delete
        };
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            }
        })
    }

    static async deleteUserCart({userId, productId}){
        const query = {cart_userId: userId, cart_state: 'active'};
        const updateSet = {
            $pull: {
                cart_products: {
                    productId,
                }
            }
        }
        const options = {
            new: true
        }
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async getListUserCart({userId}){
        return await cart.findOne({
            cart_userId: +userId
        })
    }
}

module.exports = CartService;