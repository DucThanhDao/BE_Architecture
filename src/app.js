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


module.exports = app;