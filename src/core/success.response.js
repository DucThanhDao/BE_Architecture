' use strict '

const { StatusCodes, ReasonPhrases } = require('../httpStatusCode/httpStatusCode')

class SuccessRespone {
    constructor({message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {}}) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessRespone {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}

class CREATED extends SuccessRespone {
    constructor({message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata}) {
        super({message, statusCode, reasonStatusCode, metadata})
    }
}

module.exports = {
    OK,
    CREATED,
    SuccessRespone
}