' use strict '

const asyncHandler = fn => {
    console.log("fn::::", fn);
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    asyncHandler
}