var request = require("request"),
    assert = require('assert'),
    //test = require('selenium-webdriver/testing'),
    //webdriver = require('selenium-webdriver'),
    base_url = "http://serversidejan.herokuapp.com/";


var io = require('socket.io-client');
var socketURL = 'https://serversidejan.herokuapp.com';
var options = {
    transports: ['websocket'],
    'force new connection': true,
    extraHeaders: {
        'behavior' : 'test'
    }
};


//var $ = require("jquery")(require("jsdom").jsdom().defaultView);

var jsdom = require('jsdom').jsdom;

var get_options = {
    url: base_url,
    headers: {
        'Accept': 'application/json'
    }, extraHeaders: {
        'behavior' : 'test'
    }
};
var saved_list;

describe("Project Tests", function () {
    this.timeout(0);

    describe("Test on the main page", function () {
        describe("GET /", function () {
            it("returns status code 200", function (done) {
                request.get(base_url, function (error, response, body) {
                    // check response status code
                    assert.equal(200, response.statusCode);
                    // exit
                    done();

                });
            });
        });
    });


    describe("GET /play", function () {
        get_options.url = base_url + 'play';
        it("returns status code 200", function (done) {
            request.get(get_options, function (error, response, body) {
                // check response status code
                assert.equal(200, response.statusCode);
                // exit
                done();

            });
        });

        it("has a google map", function (done) {
            request.get(get_options, function (error, response, body) {
                var document = jsdom(body, {});
                var window = document.defaultView;
                var $ = require('jquery')(window);
                var map = $('#map');
                 assert.notEqual(null, map);
                 assert.notEqual(undefined, map);
                // exit
                done();
            });
        });
    });

    describe("Test on Team page", function () {
        get_options.url = base_url + 'team';
        describe("GET /team", function () {
            // check status code
            it("returns code 200", function (done) {
                request.get(get_options, function (error, response, body) {
                    assert.equal(200, response.statusCode);
                    done();
                });
            });

            // check content
            it("has the right body", function (done) {
                request.get(get_options, function (error, response, body) {

                    var document = jsdom(body, {});
                    var window = document.defaultView;
                    var $ = require('jquery')(window);

                    var map = $('#map'); //.html(body);
                    //console.log(map);
                    //map = map.getElementById('map');
                    assert.notEqual(null, map);
                    assert.notEqual(undefined, map);
                    done();
                });
            });
        });

    });

    describe("Test on Signup page", function () {
        get_options.url = base_url + 'sign_up';
        describe("GET /sign_up", function () {
            it("returns status code 200", function (done) {
                request.get(get_options, function (error, response, body) {
                    assert.equal(200, response.statusCode);
                    // exit
                    done();
                });
            });





            it("has a form", function (done) {
                request.get(get_options, function (error, response, body) {
                    var document = jsdom(body, {});
                    var window = document.defaultView;
                    var $ = require('jquery')(window);

                    var elt = $('#register').html(body); //.html(body);
                    //console.log(elt);
                     assert.notEqual(null, elt);
                     assert.notEqual({}, elt);
                     assert.notEqual(undefined, elt);
                     //assert.equal(button, elt);
                     done();
                });

            });
        });
    });
});

describe("Socket tests", function(){
    this.timeout(0);
    describe("Team test", function(){
        /*it('Teams length should be greater than 0', function(done){
            var client1 = io.connect(socketURL, options);

            client1.on('connect', function(){
                client1.emit('getteams');
            });

            client1.on('getteams', function(teams){
                var jteams = JSON.stringify(teams);
                assert.notEqual(jteams.length, 0);
                client1.disconnect();
                done();
            });

        });
*/
        it('Can register team', function(done){
            var client1 = io.connect(socketURL, options);
            //console.log(options);
            var team = {"email":"test@gmail.com", "password":"4W350M3_P455", "name":"team_test"};
            client1.on('connect', function(){
               client1.emit('signup', team);
            });

            client1.on('signup', function(result){
               //console.log(result);
               client1.emit('getteams');
            });

            client1.on('getteams', function(teams){
               var jteams = JSON.parse(JSON.stringify(teams));
               //console.log(jteams);
               assert.notEqual(0, jteams.length);
               var found= false;
               for(var i = 0; i < jteams.length; i++){
                   if(jteams[i].email === team.email
                       //&& jteams[i].password === team.password
                       && jteams[i].name === team.name){
                       found = true;
                   }
                }
               assert.equal(true, found);
                client1.disconnect();
                done();
            });
        });
    });


    describe("Enigmas test", function(){

        var enigma = {};
        enigma.location = {};
        enigma.location.latitude = 4.815162342;
        enigma.location.longitude = 6.66;
        enigma.question = "Question?";
        enigma.valid_response =  "A";
        enigma.invalid_responses = ["B", "C", "D"];
        enigma.award = 42;

        it('Should register an enigma', function(done){
            var client1 = io.connect(socketURL, options);

            client1.on('connect', function(){
                client1.emit('addenigma', enigma);
            });

            client1.on('addenigma', function(){
                client1.emit('getenigmas');
            });

            client1.on('getenigmas', function(enigmas){
                var jenigma = enigmas[0];
                client1.emit('removeenigma', jenigma._id);
                assert.equal(jenigma.location.latitude, enigma.location.latitude);
                assert.equal(jenigma.location.longitude, enigma.location.longitude);
                assert.equal(jenigma.question, enigma.question);
                assert.equal(jenigma.valid_response, enigma.valid_response);
                assert.equal(jenigma.invalid_responses[0], enigma.invalid_responses[0]);
                assert.equal(jenigma.invalid_responses[1], enigma.invalid_responses[1]);
                assert.equal(jenigma.invalid_responses[2], enigma.invalid_responses[2]);
                assert.equal(jenigma.award, enigma.award);
                client1.disconnect();
                done();
            });

            client1.on('removeenigma', function(){
               // do nothing
            });
        });

        it('Should get all the enigmas', function(done){
            done();
        });
    });
});

