' use strict '

const {product, clothing, electronic, furniture} = require('../models/product.model');
const {BadRequestError} = require('../core/err.response');
const { 
    findAllDraftForShop, 
    publishProductByShop, 
    findAllPublishForShop, 
    unpublishProductByShop, 
    searchProductByUser, 
    findAllProduct,
} = require('../models/repositories/product.repo');

//define Factory class to create Product
class ProductFactory {
    //lv0 Factory Pattern
    // static async createProduct(type, payload) {
    //     switch(type){
    //         case 'Electronics':
    //             return new Electronics(payload).createProduct();
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct();
    //         default:
    //             throw new BadRequestError(`Invalid Product Types: ${type}`)
    //     }
    // }

    static productRegistry = {}; //key-class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    // With many type product are used
    // module.export = {
        // Electronics:  Electronics,
        // Clothing:  Clothing,
        // Furnitures:  Furnitures,
    // }
    // static registerProductTypeFromConfig (config) {
        // for(let key in config){
            // ProductFactory.registerProductType(key, config[key])
        // }
    // }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) {
            throw new BadRequestError(`Invalid Product Types: ${type}`)
        }
        console.log(payload);
        return new productClass(payload).createProduct()
    }

    //#region PUT
    static publishProductByShop = async({product_shop, product_id}) => {
        return await publishProductByShop({product_shop, product_id})
    }

    static unpublishProductByShop = async({product_shop, product_id}) => {
        return await unpublishProductByShop({product_shop, product_id})
    }

    //#endregion
    
    //#region query
    static findAllDraftForShop = async({product_shop, limit = 50, skip = 0}) => {
        const query = {product_shop, isDraft: true};
        return await findAllDraftForShop({query, limit, skip})
    }

    static findAllPublishForShop = async({product_shop, limit = 50, skip = 0}) => {
        const query = {product_shop, isPublished: true};
        return await findAllPublishForShop({query, limit, skip})
    }

    static searchProductByUser = async({keySearch}) => {
        return await searchProductByUser({keySearch})
    }

    static findAllProduct = async({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) => {
        return await findAllProduct({limit, sort, page, filter, 
        select: ['product_name', 'product_price', 'product_thumb'], 
        })
    }

    //#endregion
}


/**
 *  product_name: { type: String, required:  ,},
    product_thumb: { type: String, required:  ,},
    product_description: String,
    product_price: { type: Number, required:  ,},
    product_quantity: { type: Number, required:  ,},
    product_type: { type: String, required: true, enums: ['Electronics', 'Clothing', 'Furni '],},
    product_shop: { type: Schema.Types.ObjectId, ref: ' '},
    product_attributes: { type: Schema.Types.Mixed, required:  ,},
 */
//define base product class
class Product {
    constructor({
        product_name, 
        product_thumb, 
        product_description, 
        product_price, 
        product_quantity, 
        product_type, 
        product_shop, 
        product_attributes
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create new product
    async createProduct(productId){
        return await product.create({
            ...this,
            _id: productId,
        })
    }
}

// Define sub-class for different product type: clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) {
             throw new BadRequestError('Create new Clothing error')
        }
        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) {
        }
        return newProduct;
    }
}


// Define sub-class for different product type: electronic
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) {
             throw new BadRequestError('Create new Electronic error')
        }
        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) {
            throw new BadRequestError('Create new Product Error')
        }
        return newProduct;
    }
}

class Furnitures extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture) {
             throw new BadRequestError('Create new Furniture error')
        }
        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct) {
            throw new BadRequestError('Create new Product Error')
        }
        return newProduct;
    }
}

//register new product type
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furnitures', Furnitures);

module.exports = ProductFactory;