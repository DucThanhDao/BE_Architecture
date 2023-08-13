const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();

// Init Middleware
// app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// Init DB
require("./dbs/init.mongodb")

// Init Router
app.use('/', require('./routes'))

// Handling Error
app.use((req, res, next) => { // Error handler will have 4 props
    const error = new Error('NOT FOUND');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => { // Error handler will have 4 props
    console.log('error:::', error);
    const status = error.status || 500
    return res.status(status).json({
        status: 'error',
        code: status, // dev-seft-define
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app;