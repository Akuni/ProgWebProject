var app = require('../app');

// routing
app.get('/', function (req, res) {
  res.sendfile('./views/simpleChat.html');
});
