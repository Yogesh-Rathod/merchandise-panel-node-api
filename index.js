// ========== Global Dependencies ============ // 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const validator = require('express-validator');

// ========== Local Dependencies ============= //
const config = require('./src/config');

const routes = require('./src/controllers');

// ========== Config Options For Middlewares ============= //

const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4300', 'http://localhost:4400'],
  credentials: false,
  optionsSuccessStatus: 200
};

// ========== Setting Up PORT ============= //
const PORT = process.env.PORT || 3000;

// ========== Setting Up Middlewares ============= //
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(validator());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'secret'
}));

// ========== Connect To MongoDB through Mongoose ============= //
mongoose.connect(config.dbConnection(), { useMongoClient: true } );

// MONGOOSE CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + config.dbConnection());
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});


// ========== API Routing ============= //
app.use('/api', routes );

// ========== Home Page Routing ============= //
app.get('/', function (req, res) {
  res.json('Node JS is working Fine !!!');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

// ========== Listen to Requests ============= //
app.listen(PORT, () => {
  console.log("App is running at PORT ", PORT);
});
