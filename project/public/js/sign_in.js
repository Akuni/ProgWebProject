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

socket.on('getteams', function (data) {
    console.log(JSON.stringify(data));

    var teams_list = document.querySelector("#name");

    var content = "";
    for(var i = 0; i < data.length; i++){
        content += '<option>' + data[i].name + '</option>';
    }

    teams_list.innerHTML = content + teams_list.innerHTML;
});

// On page load
window.addEventListener("load", function() {

    socket.emit('getteams');

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