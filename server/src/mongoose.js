const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function (app) {
  const mongodb = app.get('mongodb');
  // const connectionString = `mongodb://${mongodb.localhost}:${mongodb.port}/${mongodb.dbName}`;
  const connectionString = `mongodb+srv://${mongodb.rootUser}:${mongodb.rootPassword}@cluster0.d8usk.mongodb.net/${mongodb.dbName}?retryWrites=true&w=majority`
  mongoose.connect(
    connectionString,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
};
