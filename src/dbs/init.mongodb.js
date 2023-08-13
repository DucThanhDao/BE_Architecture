'use strict'

const mongoose = require('mongoose'); 
// config - lv0
const {db: {host, port, name}} = require('../configs/config.mongodb')
const connectionString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor(){
        this.connect();
    }
    connect(type = 'mongodb'){
        if(1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(connectionString)
        .then( _ => {
            console.log("Connected succesfully");
        })
        .catch(error => console.log("Error connect"));
    }

    // Implement Singleton for the DB Instance --> Improve more about 
    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;   