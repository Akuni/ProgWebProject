/**
 * Created by Nicolas on 30/01/17.
 */
var CryptoJS = require("crypto-js");
const fs = require('fs');

var security ={};

function readTextFile(file)
{
    return fs.readFileSync(/*"/app/project/" + */__dirname+"/"+file).toString();
}

var encryptString = function(message){
    var key = readTextFile("dump.txt");
    return CryptoJS.AES.encrypt(message.toString(), key);
};

var decryptString = function(message){
    var key = readTextFile("dump.txt");
    return CryptoJS.AES.decrypt(message.toString(), key);
};

var decryptClientString = function(message){
    var key = readTextFile("client_dump.txt");
    return CryptoJS.AES.decrypt(message.toString(), key);
};



security.encryptTeam = function(team){
    team.password = encryptString(team.password).toString();
};

security.decryptTeam = function(team){
    var code= decryptString(team.password);
    team.password = hex2a(code);
};

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

security.decryptClientTeam = function(team){
    var code = decryptClientString(team.password).toString();
    team.password = hex2a(code);
};

module.exports = security;