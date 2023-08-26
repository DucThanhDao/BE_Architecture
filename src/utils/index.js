' use strict '

const _ = require('lodash');

const getInfoData = ({fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getunSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,0]))
}
module.exports = {
    getInfoData,
    getunSelectData
}