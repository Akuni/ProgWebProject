/**
 * Created by user on 28/12/16.
 */
var express = require('express');
//var GoogleMapsLoader = require('google-maps'); // only for common js environments
var router = express.Router();


/*GoogleMapsLoader.load(function(google) {
    new google.maps.Map(el, options);
});*/

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('play');
});

module.exports = router;
