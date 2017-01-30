/**
 * Created by Nicolas on 30/01/17.
 */
var CryptoJS = require("crypto-js");
const fs = require('fs');

var security ={};

function readTextFile(file)
{
    console.log("DIR NAME : " + __dirname);
    console.log("OPENNING : " + file);
    return fs.readFileSync(file).toString();
}

var encryptString = function(message){
    var key = readTextFile("dump.txt");
    console.log("KEY : " + key);
    return CryptoJS.AES.encrypt(message.toString(), key);
};

var decryptString = function(message){
    var key = readTextFile("dump.txt");
    console.log("KEY : " + key);
    return CryptoJS.AES.decrypt(message.toString(CryptoJS.enc.Utf8), key);
};

var decryptClientString = function(message){
    var key = readTextFile("client_dump.txt");
    console.log("KEY : " + key);
    return CryptoJS.AES.decrypt(message.toString(CryptoJS.enc.Utf8), key);
};



security.encryptTeam = function(team){
    team.password = encryptString(team.password);
};

security.decryptTeam = function(team){
    team.password = decryptString(team.password);
};

security.decryptClientTeam = function(team){
    team.password = decryptClientString(team.password);
};

module.exports = security;