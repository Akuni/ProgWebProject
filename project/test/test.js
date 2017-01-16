var request = require("request"),
    assert = require('assert'),
    //test = require('selenium-webdriver/testing'),
    //webdriver = require('selenium-webdriver'),
    base_url = "http://serversidejan.herokuapp.com/";
var $ = require("jquery")(require("jsdom").jsdom().defaultView);

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
                /*var map = body.getElementById('map');
                 assert.notEqual(null, map);
                 assert.notEqual(undefined, map);*/
            });
            // exit
            done();
        });
    });

    describe("Test on Team page", function () {
        get_options.url = base_url + 'team';
        describe("GET /team", function () {
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
                    console.log("laure je t'aime");
                    var map = $(body).getElementById('map');
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
                request.get(get_options, function (error, response, body) {

                    //var elt = body.getElementById("");
                });
                assert.equal(false, true);
                // exit
                done();
            });
        });

    });

    describe("Test on Signup page", function () {
        get_options.url = base_url + 'sign_up';
        describe("GET /sign_up", function () {
            it("returns status code 200", function (done) {
                request.get(get_options, function (error, response, body) {
                    assert.equal(200, response.statusCode);
                });
                // exit
                done();
            });





            it("has a form", function (done) {
                request.get(get_options, function (error, response, body) {
                    var elt = $(body).getElementById("register");
                     assert.notEqual(null, elt);
                     assert.notEqual(undefined, elt);
                     //console.log(elt);
                     assert.equal(button, elt);
                     console.log("yes?");
                });


                // exit
                done();
            });
        });
    });
});

