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
  
  console.log('GET ' + req.path);
  res.sendFile(__dirname + '/views/index.html');
  
});


app.get('/api/users', async (req, res) => {

  console.log('GET ' + req.path);
  const db = await dbc.databaseConnection();
  const users = await db.collection('users').find({}, { projection: { _id: 1, username: 1 } }).toArray();
  res.json(users);
  
});


app.get('/api/users/:_id/logs', async (req, res) => {

  console.log('GET ' + req.path);
  const filter = { _id: mongodb.ObjectId(req.params._id) };
  const db = await dbc.databaseConnection();
  const user = await db.collection('users').findOne(filter);
  console.log('user: ' + util.printObj(user));
  if (user) {
    const logs = (user.log) ? util.filterLogs(user.log, req.query.from, req.query.to, req.query.limit) : [];
    res.json({ _id: user._id, username: user.username, count: logs.length, log: logs });
  } else {
    res.send('Unknown userId');
  }

});


app.post('/api/users', async (req, res) => {

  console.log('POST ' + req.path);
  console.log('body: ' + util.printObj(req.body));
  const db = await dbc.databaseConnection();
  const user = await db.collection('users').insertOne({ username: req.body.username });
  console.log('user: ' + util.printObj(user));
  res.json({ username: req.body.username, _id: user.insertedId });

});


app.post('/api/users/:_id/exercises', async (req, res) => {

  console.log('POST ' + req.path);
  console.log('body: ' + util.printObj(req.body));
  const filter = { _id: mongodb.ObjectId(req.params._id) };
  const db = await dbc.databaseConnection();
  const exercise = await db.collection('users').updateOne(filter, util.exercisesUpdate(req.body));
  console.log('exercise: matched: ' + Boolean(exercise.matchedCount) + ', modified: ' + Boolean(exercise.modifiedCount));
  if (exercise.matchedCount) {
    const user = await db.collection('users').findOne(filter);
    console.log('user: ' + util.printObj(user));
    res.json(util.exercisesFormatResponse(user._id, user));
  } else {
    res.send('Unknown userId');
  }

});


const listener = app.listen(process.env.PORT || 3000, () => {

  console.log('app is listening on port ' + listener.address().port + ', pid: ' + process.pid);

});


