const mongoose = require('mongoose');
const config = {};
config['mongoOptions'] = {
    auth: '',
    user: '',
    pass: '',
    connectTimeoutMS: 30000,
    keepAlive: 1000,
    reconnectTries: Number.MAX_VALUE,
    autoReconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  };
  config['database'] = 'mongodb://localhost:27017/Sfund';

let isConnectedBefore = false;
const connect = function() {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.database, config.mongoOptions);
};
connect();

mongoose.connection.on('error', function() {
  console.log('Could not connect to MongoDB');
});

mongoose.connection.on('disconnected', function() {
  console.log('Lost MongoDB connection...');
  if (!isConnectedBefore) connect();
});

mongoose.connection.on('connected', function() {
  isConnectedBefore = true;
  console.log('Connection established to MongoDB');
});

mongoose.connection.on('reconnected', function() {
  console.log('Reconnected to MongoDB');
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Force to close the MongoDB conection');
    process.exit(0);
  });
});

module.exports = mongoose;
