var createError = require('http-errors');
var express = require('express');
var bodyParser=require('body-parser')
var cors=require('cors')
var path = require('path')
var expressLayout= require('express-ejs-layouts')
var session=require('express-session')
var db=require('./config/connection')

 
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const router = require('./routes/user');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayout)
app.use(bodyParser());
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/public-asset')));
app.use(session({secret:'key',cookie:{maxAge:60000000}}));
require('.dotenv').config()
app.use('/', usersRouter);
app.use('/admin', adminRouter);
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
