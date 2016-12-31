var tname, pwd;

var socket = io.connect();

var onConnectionClick = function()
{
    tname = document.getElementById("name");
    pwd = document.getElementById("password");

    if (pwd.value.length <= 0)
    {
        window.alert("Password ?");
        return;
    }

    socket.emit('signin', {"name": tname.value, "password": pwd.value} );
};

// On page load
window.addEventListener("load", function() {

    document.querySelector("#connection").onclick = onConnectionClick;

    document.addEventListener("keypress", function (evt) {
        // if pressed ENTER, then send
        if (evt.keyCode == 13) {
            onConnectionClick();
        }
    });


});

socket.on('signin', function(data){
    console.log("[Sign In] Received : " + JSON.stringify(data));

    if (data.status)
    {
        window.location.pathname = window.location.pathname.replace("sign_in", "admin");
    }
    else
    {
        window.alert("ACCESS DENIED !! Invalid password. Are you OK ?!")
    }
});