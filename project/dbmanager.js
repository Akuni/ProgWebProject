/**
 * Created by user on 16/01/2017.
 */
var mongodb = require('mongodb');

var dbmanager = {teams:{}, enigmas:{}};


// Database URL on mLab :
var db_url = 'mongodb://admin:superpass@ds131878.mlab.com:31878/progwebjan';

/** ----- TEAMS ----- **/
dbmanager.teams.get = function (callback) {
  var MongoClient = mongodb.MongoClient;
  var url = db_url; //'mongodb://localhost:27017/pwdb';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongodb server', err);
      return callback(false);
    } else {
      var collection = db.collection('teams');
      collection.find({}).toArray(function (err, result) {
        if (err) {
          console.log('Unable to get teams', err);
          return callback(false);
        } else {
          return callback(result);
        }
      });
    }
  });
};

dbmanager.teams.add = function(team, callback){
  var MongoClient = mongodb.MongoClient;
  var url = db_url; //'mongodb://localhost:27017/pwdb';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongodb server', err);
      return callback(false);
    } else {
      var collection = db.collection('teams');
      collection.insertOne(team, function (err, result) {
        if (err) {
          console.log('Unable to add team', err);
          return callback(false);
        } else {
          return callback(result);
        }
      });
    }
  });
};

dbmanager.teams.remove = function(id, callback){
  var MongoClient = mongodb.MongoClient;
  var url = db_url; //'mongodb://localhost:27017/pwdb';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongodb server', err);
      return callback(false);
    } else {
      var collection = db.collection('teams');
      collection.removeOne(id, function (err, result) {
        if (err) {
          console.log('Unable to remove teams', err);
          return callback(false);
        } else {
          return callback(true);
        }
      });
    }
  });
};

dbmanager.teams.exists = function(team, callback){
  var MongoClient = mongodb.MongoClient;
  var url = db_url; //'mongodb://localhost:27017/pwdb';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongodb server', err);
      return callback(false);
    } else {
      var collection = db.collection('teams');
      collection.find(team).toArray(function (err, result) {
        if (err) {
          console.log('Unable to get team', team, err);
          return callback(false);
        } else {
          return callback(result.length);
        }
      });
    }
  });
};

/** ----- ENIGMAS ----- **/
dbmanager.enigmas.get = function (callback, filter) {
  // default param
  filter = typeof filter !== 'undefined' ? filter : {};
  // function
  var MongoClient = mongodb.MongoClient;
  var url = db_url; //'mongodb://localhost:27017/pwdb';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongodb server', err);
      return callback(false);
    } else {
      var collection = db.collection('enigmas');
      collection.find(filter).toArray(function (err, result) {
        if (err) {
          console.log('Unable to get enigmas', err);
          return callback(false);
        } else {
          return callback(result);
        }
      });
    }
  });
};

dbmanager.enigmas.add = function(enigma, callback){
  var MongoClient = mongodb.MongoClient;
  var url = db_url; //'mongodb://localhost:27017/pwdb';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongodb server', err);
      return callback(false);
    } else {
      var collection = db.collection('enigmas');
      collection.insertOne(enigma, function (err, result) {
        if (err) {
          console.log('Unable to add enigmas', err);
          return callback(false);
        } else {
          return callback(result);
        }
      });
    }
  });
};

dbmanager.enigmas.remove = function(id, callback){
  var MongoClient = mongodb.MongoClient;
  var url = db_url; //'mongodb://localhost:27017/pwdb';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongodb server', err);
      return callback(false);
    } else {
      var collection = db.collection('enigmas');
      collection.removeOne({_id:new mongodb.ObjectId(id)}, function (err, result) {
        if (err) {
          console.log('Unable to remove enigma' + id, err);
          return callback(false);
        } else {
          return callback(true);
        }
      });
    }
  });
};


module.exports = dbmanager;