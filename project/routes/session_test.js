var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/foo', function(req, res, next) {
  var views = req.session.views;
  if (!views) { views = req.session.views = {}; }
  // get the url pathname
  var pathname = parseurl(req).pathname;
  // count the views
  views[pathname] = (views[pathname] || 0) + 1;

  console.log('ta mere le fou');
  // render('foo', { n : req.session.views[parseurl(req).pathname] });
});
router.get('/bar', function(req, res, next) {
  var views = req.session.views;
  if (!views) { views = req.session.views = {}; }
  // get the url pathname
  var pathname = parseurl(req).pathname;
  // count the views
  views[pathname] = (views[pathname] || 0) + 1;

  console.log('ta mere le bar');
  render('bar', { n : req.session.views[parseurl(req).pathname] });
});
module.exports = router;
