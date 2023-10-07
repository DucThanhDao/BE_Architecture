' use strict '

const {Schema, model} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';
// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'pending', 'failed'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: [],
        /**
         * [
         *  {
         *      productId,
         *      shopId,
         *      quantity,
         *      name,
         *      price, --> have to check price before payment because some hacker can overwrite
         *                  price on HTTP request
         *  }
         * ]
         */
    },
    cart_count_product: {
        type: Number,
        default: 0,
    },
    cart_userId: {
        type: Number,
        required: true,
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt:'createdOn',
        updateAt: 'modifyOn'
    },
});

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);