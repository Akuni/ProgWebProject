var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  /* var rights = req.session.rights;
  if (!rights) { rights = req.session.rights = {}; }
  rights.isAdmin = true; */
  res.render('sign_in');
});

module.exports = router;
