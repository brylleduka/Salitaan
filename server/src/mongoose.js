const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function (app) {
  const mongodb = app.get('mongodb');
  const connectionString = `mongodb://${mongodb.localhost}:${mongodb.port}/${mongodb.dbName}`;

  mongoose.connect(
    connectionString,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
};
