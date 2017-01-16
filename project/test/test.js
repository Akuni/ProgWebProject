var request = require("request"),
    assert = require('assert'),
    base_url = "http://serversidejan.herokuapp.com/";

var get_options = {
  url: base_url + "path",
  headers: {
    'Accept': 'application/json'
  }
};
var saved_list;

describe("Main page", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        // check response status code
        assert.equal(200, response.statusCode);
        
      });
      // exit
      done();
    });
  });

  describe("GET /play", function() {

    it("returns status code 200", function(done) {
      request.get(base_url + "play", function(error, response, body) {
        // check response status code
        assert.equal(200, response.statusCode);
  
      });
      // exit
      done();
    }); 

	it("has a google map", function(done) {
      request.get(base_url + "play", function(error, response, body) {
        // check response status code
        assert.equal(200, response.statusCode);
		var map = body.getElementById('map');
		assert.notEqual(null, map);
		assert.notEqual(undefined, map);
      });
      // exit
      done();
    }); 
  });



});
