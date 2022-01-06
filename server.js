const dbc = require('./utils/dbConnection.js');
const util = require('./utils/utils');
const mongodb = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  
  res.sendFile(__dirname + '/views/index.html');
  
});


app.get('/api/users', async (req, res) => {
  
  const db = await dbc.databaseConnection();
  const users = await db.collection('users').find({}, { projection: { _id: 1, username: 1 } }).toArray();
  res.json(users);
  
});


app.get('/api/users/:_id/logs', async (req, res) => {

  const filter = { _id: mongodb.ObjectId(req.params._id) };
  const db = await dbc.databaseConnection();
  const user = await db.collection('users').findOne(filter);
  const logs = util.filterLogs(user.log, req.query.from, req.query.to, req.query.limit);
  res.json({ _id: user._id, username: user.username, count: logs.length, log: logs });

});


app.post('/api/users', async (req, res) => {

  const db = await dbc.databaseConnection();
  const user = await db.collection('users').insertOne({ username: req.body.username });
  res.json({ _id: user.insertedId, username: req.body.username });

});


app.post('/api/users/:_id/exercises', async (req, res) => {

  const filter = { _id: mongodb.ObjectId(req.body[':_id']) };
  const db = await dbc.databaseConnection();
  const exercise = await db.collection('users').updateOne(filter, util.exercisesUpdate(req.body));
  const user = await db.collection('users').findOne(filter);
  res.json(util.exercisesFormatResponse(user));

});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('app is listening on port ' + listener.address().port + ', pid: ' + process.pid);
});
