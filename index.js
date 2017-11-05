// ========== Global Dependencies ============ // 
const express = require('express');
const app = express();
const compression = require('compression');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const cors = require('cors');
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');

// ========== Local Dependencies ============= //
const config = require('./src/config');

// ========== Config Options For Middlewares ============= //
const staticOptions = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
};

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200
};

// ========== Setting Up PORT ============= //
const PORT = process.env.PORT || 3000;

// ========== Setting Up Middlewares ============= //
app.use(cors(corsOptions));
app.use(compression());
app.use(express.static('public', staticOptions));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'secret'
}));
app.use(flash());

app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'pug');

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
// app.use('/api', routes );

// ========== Home Page Routing ============= //
app.get('/', function (req, res) {
  req.flash('errors', 'There are errors');
  req.flash('info', 'There are errors');
  res.render('account/login', {
    title: 'Login'
  });
});

app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
});

/**
 * Error Handler.
 */
app.use(errorHandler());

// ========== Listen to Requests ============= //
app.listen(PORT, () => {
  console.log("App is running at PORT ", PORT);
});
