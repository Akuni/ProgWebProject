var request = require("request"),
    assert = require('assert'),
    base_url = "http://serversidejan.herokuapp.com/";

var get_options = {
    url: base_url,
    headers: {
        'Accept': 'application/json',
        'behavior': 'test'
    }
};
var saved_list;

describe("Project Tests", function () {
    describe("Test on the main page", function () {
        describe("GET /", function () {
            it("returns status code 200", function (done) {
                request.get(base_url, function (error, response, body) {
                    // check response status code
                    assert.equal(200, response.statusCode);

                });
                // exit
                done();
            });
        });
    });


    describe("GET /play", function () {
        get_options.url = base_url + 'play';
        it("returns status code 200", function (done) {
            request.get(get_options, function (error, response, body) {
                // check response status code
                assert.equal(200, response.statusCode);

            });
            // exit
            done();
        });

        it("has a google map", function (done) {
            request.get(get_options, function (error, response, body) {
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

    describe("Test on Team page", function () {
        describe("GET /team", function () {
            get_options.url = base_url + 'team';
            // check status code
            it("returns code 200", function (done) {
                request.get(get_options, function (error, response, body) {
                    assert.equal(200, response.statusCode);
                });
                done();
            });

            // check content
            it("has the right body", function (done) {
                request.get(get_options, function (error, response, body) {
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

        describe("POST /team", function () {

            // check form send
            it("has the right behavior", function (done) {
                var returned_body;
                request.get(get_options, function (error, response, body) {
                    // check response status code
                    returned_body = body;
                });
                assert.equal(false, true);
                // exit
                done();
            });
        });

    });
});

