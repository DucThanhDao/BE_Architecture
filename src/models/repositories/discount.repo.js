' use strict '
const {
    getUnSelectData, getSelectData
} = require('../../utils')

const findAllDiscountCodeUnselect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1)*limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean()
    return documents
}

const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1)*limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean()
    return documents
}

const checkDiscountExists = async({model, filter}) => {
    return await model.findOne(filter).lean();
}   

module.exports = {
    findAllDiscountCodeUnselect,
    findAllDiscountCodeSelect,
    checkDiscountExists
}