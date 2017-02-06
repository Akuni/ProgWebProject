var conversation, data, datasend, users;
var my_ip;
var socket = io.connect();

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
    var chatMessage = "<b>" + username + ":</b> " + data + "<br>";
    conversation.innerHTML += chatMessage;
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(listOfUsers) {
    users.innerHTML = "";
    for(var name in listOfUsers) {
        var userLineOfHTML = '<div>' + name + '</div>';
        users.innerHTML += userLineOfHTML;
    }
});

socket.on('getteams', function (data) {
    var teams_table = document.querySelector("#teams_table");

    var content = "";
    for (var i = 0; i < data.length; i++)
    {
        content += '<tr>'
            + '<td>' + data[i].name + '</td>';

        var score = (data[i].score || 0) ? data[i].score: "0";
            content+= '<td>' + score + '</td>';

        var count = (data[i].list_enigma_done) ? data[i].list_enigma_done.length : "0";
        content += '<td>' + count + '</td>'
            + '<td>' + data[i].email + '</td>'
            + '</tr>';
    }

    teams_table.innerHTML = content;
});

var onDisconnect = function()
{
    socket.emit('removesessionip', {ip: my_ip});
};

// on load of page
window.addEventListener("load", function(){
    document.querySelector("#disconnect").onclick = onDisconnect;

    socket.emit('getsessionip', {ip: my_ip});

    // get handles on various GUI components
    conversation = document.querySelector("#conversation");
    data = document.querySelector("#data");
    datasend = document.querySelector("#datasend");
    users = document.querySelector("#users");

    // Listener for send button
    datasend.addEventListener("click", function(evt) {
        sendMessage();
    });

    // detect if enter key pressed in the input field
    data.addEventListener("keypress", function(evt) {
        // if pressed ENTER, then send
        if(evt.keyCode == 13) {
            this.blur();
            sendMessage();
        }
    });

    // sends the chat message to the server
    function sendMessage() {
        var message = data.value;
        data.value = "";
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
    }
});

socket.on('getsessionip', function(data){
    if (data.status && data.name == "admin") {
        socket.emit('getteams');
        socket.emit('adduser', "admin#"+socket.id.toString().slice(1,5));
    } else {
        window.location.pathname = window.location.pathname.replace("admin", "sign_in");
    }
});