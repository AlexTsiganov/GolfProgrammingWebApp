var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var toplist = require('./routes/toplist');
var login = require('./routes/login');
var task = require('./routes/task');

var log = require('./libs/log/log')(module);
var execFile = require('child_process').execFile;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//--- Sessions and cookie configuration ---
var config = require('config');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var options = config.get('dbConfig');

app.use(session({
    secret: "BrownTeamTheBest",
    key: "sid",
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: null
    },
    store: new SessionStore(options)
}));

// Code for cookies testing. Will delete it sometime later. For now I need it.
//app.use(function(req, res, next) {
//    req.session.CountofVisits = req.session.CountofVisits + 1 || 1;
//    log.info(req.session.CountofVisits);
//    res.send("visits: " + req.session.CountofVisits);
//});

//------------------------------

app.use('/', routes);
app.use('/users', users);
app.use('/toplist', toplist);
app.use('/login', login);
app.use('/task', task);

app.use('/git',function(req, res, next) {
  console.log(req.body);
  res.sendStatus(200);
  execFile("./github-hook", function(error, stdout, stderr) {
                    //
                    res.send(stdout);
                    console.log('error', error);
                    console.log('stdout', stdout);
                    console.log('stderr', stderr);
                    console.log( 'exec complete' );
            });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
