var tname, pwd;

var socket = io.connect();

var onConnectionClick = function()
{
    tname = document.getElementById("name");
    pwd = document.getElementById("password");

    if (tname.value.length <= 0)
    {
        window.alert("Can't you just select a team ?");
        return;
    }

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
        window.location.pathname = window.location.pathname.replace("sign_in", "play");
    }
    else
    {
        window.alert("ACCESS DENIED !! Are you OK ?!")
    }
});