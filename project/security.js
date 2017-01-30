/**
 * Created by Nicolas on 30/01/17.
 */
var CryptoJS = require("crypto-js");

var security ={};

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
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

security.encryptString = function(message){
    var key = readTextFile("dump.txt");
    console.log("KEY : " + key);
    return CryptoJS.AES.encrypt(message.toString(), key);
};

security.decryptString = function(message){
    var key =readTextFile("dump.txt");
    console.log("KEY : " + key);
    return CryptoJS.AES.decrypt(message.toString(), key);
};

security.encryptTeam = function(team){
    team.
};

module.exports = security;