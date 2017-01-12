var conversation, data, datasend, users;

var socket = io.connect();

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    socket.emit('adduser', "admin#"+socket.id.toString().slice(1,5));
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
    console.log(JSON.stringify(data));

    var teams_table = document.querySelector("#teams_table");

    var content = "";
    for (var i = 0; i < data.length; i++)
    {
        content += '<tr>'
            + '<td>' + data[i].name + '</td>'
            + '<td>' + data[i].score + '</td>';

        var list = "";
        for (var j = 0; j < data[i].list_enigma_done.length; j++)
            list += ((j>0)?"/":"") + data[i].list_enigma_done[j];

        content += '<td>' + list + '</td>'
            + '<td>' + data[i].email + '</td>'
            + '</tr>';
    }

    teams_table.innerHTML = content;
});

// on load of page
window.addEventListener("load", function(){

    socket.emit('getteams');

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