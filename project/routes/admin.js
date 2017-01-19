var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.teamName = "Un nom de team mais j'ai la flemme de prendre de la db";
d
  res.render('admin');
});

router.get('/enigma', function(req, res, next) {
  res.render('admin_enigma');
});

module.exports = router;
