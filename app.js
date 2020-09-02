var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var models = require('./models/db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var cors = require('cors')
var app = express();

// Link the backend and the frontend


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'front/build')));


// --> https://www.npmjs.com/package/cors#installation

app.use(cors())
 

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

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




// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/front/build/index.html'));
})


//
const port = process.env.PORT || 5000;
app.listen(port);


module.exports = app;
