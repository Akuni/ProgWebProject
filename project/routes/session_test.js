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

  console.log('ta mere le fou');
  res.render('foo', { n : req.session.views[req.url] });
});
router.get('/bar', function(req, res, next) {
  var sess = req.session;
  var views = sess.views;
  if (!views) { views = req.session.views = {}; }
  // get the url pathname
  if (sess.views['bleh'] || 0) {
    sess.views['bleh']++;
    console.log(sess.cookie);
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + sess.views['bleh'] + '</p>');
    res.write('<p>expires in: ' + (sess.cookie.maxAge) + 'ms</p>');
    res.end();
  } else {
    sess.views['bleh'] = 1;
    res.end('welcome to the session demo. refresh!');
  }
});
module.exports = router;
