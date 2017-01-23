var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/foo', function(req, res, next) {
  var views = req.session.views;
  if (!views) { views = req.session.views = {}; }
  // get the url pathname
  var pathname = req.url;
  // count the views
  views[pathname] = (views[pathname] || 0) + 1;

  res.render('foo', { n : req.session.views[req.url] });
});
router.get('/bar', function(req, res, next) {
  var sess = req.session;
  var views = sess.views;
  if (!views) { views = req.session.views = {}; }
  // get the url pathname
  if (sess.views['bleh'] || 0) {
    sess.views['bleh']++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + sess.views['bleh'] + '</p>');
    res.end();
  } else {
    sess.views['bleh'] = 1;
    res.end('welcome to the session demo. refresh!');
  }
});
router.get('/team', function(req, res, next){
  var teamName = req.session.teamName;
  if(!teamName) { teamName = "Not logged"; }
  res.setHeader('Content-Type', 'text/html');
  res.write('<p>Team name: ' + teamName + '</p>');
  res.end();
});
module.exports = router;
