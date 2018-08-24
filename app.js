const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const events = require('./routes/events');
const vision = require('./routes/vision');

const app = express();
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

// DB Testing
// mongoose.connect('mongodb://arief:08november@ds229312.mlab.com:29312/eva-db', {useNewUrlParser: true})

// DB Development
mongoose.connect('mongodb://arief:08november@ds145121.mlab.com:45121/blog-test', {useNewUrlParser: true})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', index);
app.use('/users', users);
app.use('/events', events);
app.use('/vision', vision);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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
