var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var path = require('path')
var expressLayout = require('express-ejs-layouts')
var session = require('express-session')
var db = require('./config/connection')
const cartModels = require('./models/cartModels')
var app = express();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const wishlistModels = require('./models/wishlistModels');
app.use(expressLayout);
app.use(session({ secret: 'key', cookie: { maxAge: 600000 } }));

app.use(async function (req, res, next) {// Cart count passed to every views
  try {
    if (req.session.user) {
      let userId = req.session.user._id;
      const data = await cartModels.findOne({ userId });
      let cartItem = data.cartProduct.length;
      if (cartItem < 1) {
        res.locals.cartItem = "!";
      } else {
        res.locals.cartItem = cartItem;
      }
    } else {
      // If there's no user in the session, set cartItem to 0 or handle it as you wish
    res.locals.cartItem = '!';
    }
    next();
  }
  catch (error) {
    console.error(error);
    res.locals.cartItem = '!'; // In case of an error, set cartItem to 0 or handle it as you wish
    next();
  }
})

app.use(async function (req, res, next) { //Whishlist count passed to pages
  try {
    if (req.session.user) {
      let userId = req.session.user._id;
      const data = await wishlistModels.findOne({ userId });
      let wishlistCount = data.Items.length;
      if (wishlistCount < 1) {
        res.locals.wishlistCount = "!";
      } else {
        res.locals.wishlistCount = wishlistCount;
      }
    } else {
      // If there's no user in the session, set wishlistCount to 0 or handle it as you wish
      res.locals.wishlistCount = '!';
    }
    next();
  }
  catch (error) {
    console.error(error);
    res.locals.wishlistCount = '!'; // In case of an error, set wishlistCount to 0 or handle it as you wish
    next();
  }
})
// error handler
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/public-asset')));

app.use('/', usersRouter);
app.use('/admin', adminRouter);
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
