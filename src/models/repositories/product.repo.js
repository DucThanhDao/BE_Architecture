' use strict '
const { getUnSelectData, convertToObjectMongodb } = require('../../utils');
const {product, electronic, clothing, furniture} = require('../product.model');
const {Types} = require('mongoose');
//Query
const findAllDraftForShop = async({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async({query, limit, skip}) => {
    console.log(query)
    return await queryProduct({query, limit, skip})
}

const queryProduct = async({query, limit = 50, skip = 0}) => {
    console.log(query);
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
}

const searchProductByUser = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch);
    const results = product.find({
        isPublished: true,
        $text: {$search: regexSearch},
    }, {score: {$meta: 'textScore'}}).lean()
    return results
}

const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1)*limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()
    return products
}

const findProduct = async ({product_id, unselect}) => {
    const products = await product.findById(product_id)
    .select(getUnSelectData(unselect))
    .lean()
    return products
}

const getProductById = async (productId) => {
    return await product.findOne({_id: convertToObjectMongodb(productId)}).lean();
}

//#region PUT
const publishProductByShop = async({product_shop,product_id}) => {
    const foundShop = await product.findOneAndUpdate({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    }, {
        $set: {
            isDraft: false,
            isPublished: true,
        }
    })
    if(!foundShop) {
        return null
    }
    return foundShop;
}

const unpublishProductByShop = async({product_shop,product_id}) => {
    const foundShop = await product.findOneAndUpdate({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    }, {
        $set: {
            isDraft: true,
            isPublished: false,
        }
    })
    if(!foundShop) {
        return null
    }
    return foundShop;
}

const updateProductById = async ({productId, bodyUpdate, model, isNew = true}) => {
    return model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew,
    })
}

//#endregion PUT

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unpublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
}