' use strict '

const _ = require('lodash');
const {Types} = require('mongoose');

const convertToObjectMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,1]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if(obj[key]===null) {
            delete obj[key];
        }
    });
    return obj;
}

const updateNestedObjectParser = obj => {
    const parsedObj  = {};
    Object.keys(obj).forEach(key => {
        if(typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach(nestedKey => {
                parsedObj[`${key}.${nestedKey}`] = response[nestedKey];
            })
        } else {
            parsedObj[key] = obj[key]
        }
    });
    return parsedObj
}
module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectMongodb,
}