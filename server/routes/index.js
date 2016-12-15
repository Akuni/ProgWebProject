var app = require('../app');

// routing
app.get('/', function (req, res, next) {
  res.render('simpleChat');
});
