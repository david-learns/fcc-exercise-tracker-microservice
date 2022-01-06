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
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000,
        monitorCommands: true,
    });

    dbLog();
    const db = client.db(process.env.DB_NAME);
    cachedDb = db;
    return db;

}

function dbLog() {
    client.on('commandStarted', event => console.log('commandStarted: ' + commandStartedEvent(event)));
    client.on('commandSucceeded', event => console.log('commandSucceeded: ' + commandSucceededEvent(event)));
    client.on('commandFailed', event => console.log('commandFailed: ' + event));
}

function commandStartedEvent(event) {
    switch (event.commandName) {
        case 'find': return event.requestId + ', ' + event.commandName + ', ' + event.command.find + ', ' + event.command.filter._id;
        case 'insert': return event.requestId + ', ' + event.commandName + ', ' + event.command.insert;
        case 'update': return event.requestId + ', ' + event.commandName + ', ' + event.command.update;
    }
}

function commandSucceededEvent(event) {
    switch (event.commandName) {
        case 'find': return event.requestId + ', ' + event.commandName + ', ' + 'dur:' + event.duration;
        case 'insert': return event.requestId + ', ' + event.commandName + ', ' + 'dur:' + event.duration;
        case 'update': return event.requestId + ', ' + event.commandName + ', ' + 'dur:' + event.duration;
    }
}

function closeDatabaseConnection() {
    if (client) client.close();
}

module.exports = {
    databaseConnection,
    closeDatabaseConnection,
    dbLog,
}