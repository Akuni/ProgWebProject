var tname, mail, p1, p2, p3, p4;

var crypto = require('crypto-js');
var julien = "CL13NT_K3Y";

var socket = io.connect();

var onRegisterClick = function()
{
    tname = document.getElementById("name");
    mail = document.getElementById("email");
    p1 = document.getElementById("password1");
    p2 = document.getElementById("password2");
    p3 = document.getElementById("password3");
    p4 = document.getElementById("password4");

    clearStatusCorrectnessStyle();

    if (tname.value.length <= 0)
    {
        setStatusCorrectnessStyle(name, true);
        return;
    }

    if (mail.value.length <= 0)
    {
        setStatusCorrectnessStyle(mail, true);
        return;
    }

    if (p1.value.length <= 0)
    {
        setStatusCorrectnessStyle(p1, true);
        return;
    }

    if ((p1.value != p2.value)
        || (p1.value != p3.value)
        || (p1.value != p4.value))
    {
        setStatusCorrectnessStyle(p1, true);
        setStatusCorrectnessStyle(p2, true);
        setStatusCorrectnessStyle(p3, true);
        setStatusCorrectnessStyle(p4, true);
        return;
    }

    console.log("[Sign Up] Emiting...");
    p1.value = crypto.AES.encrypt(p1.value, julien);
    socket.emit('signup', {"name": tname.value, "email": mail.value, "password": p1.value} );
};

var clearStatusCorrectnessStyle = function()
{
    setStatusCorrectnessStyle(tname, false);
    setStatusCorrectnessStyle(mail, false);
    setStatusCorrectnessStyle(p1, false);
    setStatusCorrectnessStyle(p2, false);
    setStatusCorrectnessStyle(p3, false);
    setStatusCorrectnessStyle(p4, false);
};

var setStatusCorrectnessStyle = function(elem, isWrong){

    if (isWrong)
        elem.classList.add("my-sign-up-wrong");
    else
        elem.classList.remove("my-sign-up-wrong");
};

// On page load
window.addEventListener("load", function() {

    document.querySelector("#register").onclick = onRegisterClick;

    document.addEventListener("keypress", function (evt) {
        // if pressed ENTER, then send
        if (evt.keyCode == 13) {
            onRegisterClick();
        }
    });
});

socket.on('signup', function(data){
    console.log("[Sign Up] Received : " + JSON.stringify(data));
    if (data.status)
    {
        //socket.handshake.session.SIGNIN_DATA = data;
        window.location.pathname = window.location.pathname.replace("sign_up", "sign_in");
    }
    else
    {
        window.alert("Too bad ! This team name is already taken. :/")
    }
});