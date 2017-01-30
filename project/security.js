/**
 * Created by Nicolas on 30/01/17.
 */
var CryptoJS = require("crypto-js");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');

var security ={};

function readTextFile(file)
{
    fs.readdir(__dirname, function(err, files)  {
        files.forEach(function(file)  {
            console.log(file);
        });
    });
    var rawFile = new XMLHttpRequest();
    console.log("DIR NAME : " + __dirname);
    console.log("OPENNING : " + file);
    rawFile.open("GET", "file://"+ file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                return  rawFile.responseText;
            } else {
                return "NO KEY FOUND";
            }
        }
    };
    rawFile.send(null);
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