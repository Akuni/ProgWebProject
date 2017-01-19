var express = require('express');
var router = express.Router();
var dbmanager = require('../dbmanager');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('team');
});

module.exports = router;
