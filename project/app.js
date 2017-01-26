var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var play = require('./routes/play');
var signup = require('./routes/sign_up');
var signin = require('./routes/sign_in');
var admin = require('./routes/admin');
var team = require('./routes/team');
var session_test = require('./routes/session_test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Comment top line and uncomment the 2 bottom line to switch between html and jade
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
/** ----- SESSION STUFF START ----- */
/* OLD SHIAT : app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
})); */
var passport = require('passport');
var passportInit = passport.initialize();
var passportSession = passport.session();
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(port);

var sessionMiddleware = session({
  secret: 'some secret',
  key: 'express.sid',
  resave: false,
  httpOnly: false,
  saveUninitialized: true,
  cookie: {}
});

app.use(sessionMiddleware);

io.use(function(socket, next){
  socket.client.request.originalUrl = socket.client.request.url;
  cookieParser(socket.client.request, socket.client.request.res, next);
});

io.use(function(socket, next){
  socket.client.request.originalUrl = socket.client.request.url;
  sessionMiddleware(socket.client.request,   socket.client.request.res, next);
});

io.use(function(socket, next){
  passportInit(socket.client.request, socket.client.request.res, next);
});

io.use(function(socket, next){
  passportSession(socket.client.request, socket.client.request.res, next);
});
/** ----- SESSION STUFF END ----- */
app.use('/', index);
app.use('/play', play);
app.use('/sign_up', signup);
app.use('/sign_in', signin);
app.use('/admin', admin);
app.use('/team', team);
app.use('/session', session_test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
  if(err.status != 404)
    res.render('debug', { err : err.stack });
  else
    res.render('error');
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// module.exports = app;
module.exports = {app:app, server:server, io:io};
