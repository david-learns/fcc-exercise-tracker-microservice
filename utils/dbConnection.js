'use strict';

const { MongoClient } = require('mongodb');
require('dotenv').config();

let cachedDb = null;
let client = null;

async function databaseConnection() {
    
    if (cachedDb) {
        return cachedDb;
    }

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_URL}?retryWrites=true&w=majority`;
    client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db(process.env.DB_NAME);
    cachedDb = db;
    return db;

}

function closeDatabaseConnection() {
    if (client) client.close();
}

module.exports = {
    databaseConnection,
    closeDatabaseConnection,
}