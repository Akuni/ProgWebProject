/**
 * Created by user on 16/01/2017.
 */
var mongodb = require('mongodb');
var security = require('./security');

var dbmanager = {teams : {}, enigmas : {}};

var hideAdminTeam = function(teams){
  // Remove admin 'team'
  for (var i = 0; i < teams.length; i++)
  {
    if (teams[i].name == 'admin')
    {
      teams.splice(i, 1);
      break;
    }
  }
};

// Database urls on mLab :
//var db_url = 'mongodb://admin:superpass@ds131878.mlab.com:31878/progwebjan';
var db_test_url = 'mongodb://admin:superpass@ds141937.mlab.com:41937/progwebjan_test';
var db_url = 'mongodb://localhost:27017/pwdb';

console.log("/!\\ Database : " + db_url);

/** ----- TEAMS ----- **/
dbmanager.teams.get = function (callback, filter, test, withRank) {
  /** CORE **/
  // default filter parameter
  filter = typeof filter !== 'undefined' ? filter : {};
  // function
  var MongoClient = mongodb.MongoClient;
  var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
  MongoClient.connect(connection
    , function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongodb server', err);
        return callback(false);
      } else {
        var collection = db.collection('teams');
        collection.find(filter).toArray(function (err, result) {
          if (err) {
            console.log('Unable to get teams', err);
            return callback(false);
          } else {
            hideAdminTeam(result);
            if(withRank)
              // Number of team with higher score
              collection.count(({name : {$ne : "admin"}, score : {$gt : result[0].score}}), function (err, count) {
                if (err) {
                  console.log('Unable to count higher teams', err);
                  return callback(false);
                } else {
                  collection.count(({name : {$ne : "admin"}}), function (err, teamsCount) {
                    if (err) {
                      console.log('Unable to count teams', err);
                      return callback(false);
                    } else {
                      result[0].rank = (count + 1) + "/" + teamsCount;
                      return callback(result);
                    }
                  });
                }
              });
            else
             return callback(result);
          }
        });
      }
    });
};

dbmanager.teams.add = function (team, callback, test) {
  /** CORE **/
  var MongoClient = mongodb.MongoClient;
    var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
    MongoClient.connect(connection
    , function (err, db) {
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

dbmanager.teams.solve = function(enigma_id, team_name, won, callback, test){
  /** CORE **/
  var MongoClient = mongodb.MongoClient;
  var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
  MongoClient.connect(connection
    , function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongodb server', err);
        return callback(false);
      } else {
        dbmanager.enigmas.get(function(neasted_result){
          if(neasted_result.length == 0){
            console.log('Unable to get enigma ', enigma_id);
            return callback(false);
          }
          var collection = db.collection('teams');
          collection.update({"name": team_name},
            {$inc:{score: won ? parseInt(neasted_result[0].award) : 0},
              $push:{list_enigma_done:neasted_result[0]._id}},
            function (err, result) {
             if (err) {
                console.log('Unable to add score to team', err);
                return callback(false);
              } else {
                return callback(result);
              }
          });
        }, {"_id" : new mongodb.ObjectId(enigma_id)}, test);
      }
    });
};

dbmanager.teams.remove = function (id, callback, test) {
  /** CORE **/
  var MongoClient = mongodb.MongoClient;
  var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
  MongoClient.connect(connection
    , function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongodb server', err);
        return callback(false);
      } else {
        var collection = db.collection('teams');
        collection.removeOne({_id : new mongodb.ObjectId(id)}, function (err, result) {
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

dbmanager.teams.exists = function (team, callback, test) {
  /** CORE **/
  var MongoClient = mongodb.MongoClient;
  var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
  MongoClient.connect(connection
    , function (err, db) {
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
            return callback(result);
          }
        });
      }
    });
};

/** ----- ENIGMAS ----- **/
dbmanager.enigmas.get = function (callback, filter, test) {
  /** CORE **/
  // default filter parameter
  filter = typeof filter !== 'undefined' ? filter : {};
  // function
  var MongoClient = mongodb.MongoClient;
  var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
  MongoClient.connect(connection
    , function (err, db) {
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

dbmanager.enigmas.add = function (enigma, callback, test) {
  /** CORE **/
  var MongoClient = mongodb.MongoClient;
  var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
  MongoClient.connect(connection
    , function (err, db) {
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

dbmanager.enigmas.remove = function (id, callback, test) {
  /** CORE **/
  var MongoClient = mongodb.MongoClient;
  var connection = /** TEST TRICK **/ (typeof test !== 'undefined') ? db_test_url : db_url /** TEST TRICK **/;
  MongoClient.connect(connection
    , function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongodb server', err);
        return callback(false);
      } else {
        var collection = db.collection('enigmas');
        collection.removeOne({_id : new mongodb.ObjectId(id)}, function (err, result) {
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
