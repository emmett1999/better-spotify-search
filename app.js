// .env import
require('dotenv').config();

// imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// routers
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var albumsRouter = require('./routes/albums');
var allAlbumsRouter = require('./routes/all-albums');
var summaryRouter = require('./routes/summary');

var app = express();

// global variables
app.locals.title = 'better-spotify-search';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session setup
// TODO: investigate these session properties and determine the best settings to use
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true only if behind HTTPS
    httpOnly: true, // protect against XSS
    sameSite: 'lax' // helps CSRF protection
  }
}));
// ---------------------

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/albums', albumsRouter);
app.use('/all-albums', allAlbumsRouter);
app.use('/summary', summaryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
