' use strict '

const { StatusCodes, ReasonPhrases } = require('../httpStatusCode/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
        super(message, status)
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message= ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, status)
    }
}

class ForbidenRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status)
    }
}

class NotFoundRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
        super(message, status)
    }
}

class UnauthorizedRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status)
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    InternalServerError,
    ForbidenRequestError,
    NotFoundRequestError,
    UnauthorizedRequestError
}