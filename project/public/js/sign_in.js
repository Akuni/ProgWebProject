var tname, pwd;
var my_ip;

var socket = io.connect();

var julien = "CL13NT_K3Y";

/*
 * Send authentication request
 */
var onConnectionClick = function()
{
    tname = document.getElementById("name");
    pwd = document.getElementById("password");

    if (pwd.value.length <= 0)
    {
        window.alert("Password ?");
        return;
    }
    var tmp = pwd.value;
    pwd.value = CryptoJS.AES.encrypt(pwd.value, julien);
    socket.emit('signin', {"name": tname.value, "password": pwd.value} );
    pwd.value = tmp;
};


/*
 * On page loading
 */
window.addEventListener("load", function() {

    socket.emit('getteams');

    document.querySelector("#connection").onclick = onConnectionClick;
    $("#name").focus();

    document.addEventListener("keypress", function (evt) {
        // if pressed ENTER, then send
        if (evt.keyCode == 13) {
            onConnectionClick();
        }
    });
});

/*
 * When we receive an authentication response
 */
socket.on('signin', function(data){
    if (data.status)
    {
        var redirect = (data.admin)?"admin":"team";

        var sessionip = {};
        sessionip.ip = my_ip;
        sessionip.name = document.getElementById("name").value;
        socket.emit('addsessionip', sessionip);
        window.location.pathname = window.location.pathname.replace("sign_in", redirect);
    }
    else
    {
        window.alert("ACCESS DENIED !! Invalid login. Are you OK ?!")
    }
});