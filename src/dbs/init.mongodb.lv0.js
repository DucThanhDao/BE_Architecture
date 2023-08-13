'use strict'

const mongoose = require('mongoose'); 
// `require` in Node, when 1 module loaded, it will be cache --> No longer called again
// Other: reload module and create new
const connectionString = "mongodb://localhost:27017/shopDEV";

mongoose.connect(connectionString)
.then( _ => {
    console.log("Naive Connected succesfully");
})
.catch(error => console.log("Error connect"));

// Set up env for each stage of project
//dev
if(1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', {color: true});
}

module.exports = mongoose; 
//In other languages, each `mongoose` will create a new connection to DB --> multiple connection
// are created --> can cause err about traffic in connection

//-------------------------------------
//------------> SINGLETON <------------
//-------------------------------------