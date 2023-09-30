' use strict '
/**
 * Discount Service
 * - Generator discount Code [Shop| Admin]
 * - Get discount amount [User]
 * - Get all discount codes [User| Shop]
 * - Verify discount code [User]
 * - Delete discount code [Shop| Admin]
 * - Cancel discount [User]
*/
const { BadRequestError, NotFoundRequestError } = require("../core/err.response");
const discount = require('../models/discount.model');
const { findAllDiscountCodeUnselect, findAllDiscountCodeSelect, checkDiscountExists } = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectMongodb } = require("../utils");

class DiscountService {
    /**
     * 
     * @param {*} payload 
     * @returns 
     */
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, users_used, max_uses, uses_count, max_uses_per_user, max_value
        } = payload;
        // Check INPUT
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError('DiscountCode has expired!')
        }
        
        if(new Date(start_date) > new Date(end_date)){
            throw new BadRequestError('Start date must be before end date!')
        }
        // Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectMongodb(shopId),
        }).lean();
        console.log(foundDiscount);
        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })
        return newDiscount;
    }

    static async updateDiscountCode(){

    }

    /**
     * @des Get all discount codes availables with product
     * @param {code, shopId, userId, limit, page} 
     * @returns JSON
     */
    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page,
    }){
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectMongodb(shopId),
        }).lean();

        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new NotFoundRequestError('Discount not exist!')
        }
        const {discount_applies_to, discount_product_ids} = foundDiscount;
        console.log({discount_applies_to, discount_product_ids});
        let products = [];
        if(discount_applies_to === 'all'){
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if(discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products;
    }

    /**
     * @Des Get all discount code of shop
     * @param {*} payload 
     * @returns 
     */
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }){
        const discounts = await findAllDiscountCodeUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })
        return discounts;
    }

    /**
     * @des get Amount of discount
     * @param {*} {code, userId, shopId, products} 
     * @returns 
     */
    static async getDiscountAmount({
        codeId, userId, shopId, products
    }){
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: shopId,
            }
        });
        if (!foundDiscount) {
            throw new NotFoundRequestError('Discount Not Found');
        }
        const { 
            discount_is_active, 
            discount_max_uses, 
            discount_start_date, 
            discount_end_date, 
            discount_min_order_value,
            discount_type,
            discount_value,
            discount_max_uses_per_user,
            discount_users_used
        } = foundDiscount;
        
        if(!discount_is_active) {
            throw new NotFoundRequestError('Discount expired!');
        }

        if(discount_max_uses === 0) {
            throw new NotFoundRequestError('Discount are out');
        }

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundRequestError('Discount expired!');
        }

        // Check min required value
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product)=> {
                return acc + product.quantity* product.price
            }, 0)
            if(totalOrder < discount_min_order_value){
                throw new NotFoundRequestError(`Discount requires a minimum value of ${discount_min_order_value}`)
            }
        }

        // Check uses time of user
        if(discount_max_uses_per_user > 0){
            const userUserDiscount = discount_users_used.find(user => userId === user.userId);
            if (userUserDiscount){
                 
            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder*(discount_value/100);
        return {
            totalOrder: totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,    
        }
    }

    static async deleteAccountCode({
        shopId,
        codeId,
    }){
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectMongodb(shopId),
        })
        return deleted;
    }


    static async cancelDiscountCode({
        codeId,
        shopId,
        userId,
    }){
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter:{
                discount_code: codeId,
                discount_shopId: shopId,
            }
        })
        if(!foundDiscount){
            throw new NotFoundRequestError('Discount doesnot exist');
        }
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            },
        })

        return result
    }
}

module.exports = DiscountService