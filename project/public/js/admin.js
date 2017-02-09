var conversation, data, datasend, users;
var my_ip;
var socket = io.connect();

/*
 * When we connect to the server
 */
socket.on('connect', function(){
    // Do nothing
});

/*
 * When we receive a message in chat
 */
socket.on('updatechat', function (username, data) {
    var chatMessage = "<b>" + username + ":</b> " + data + "<br>";
    conversation.innerHTML += chatMessage;
    conversation.scrollTop = conversation.scrollHeight;
    document.querySelector("#data").focus();
});

/*
 * When a user connects the chat
 */
socket.on('updateusers', function(listOfUsers) {
    users.innerHTML = "";
    for(var name in listOfUsers) {
        var userLineOfHTML = '<div>' + name + '</div>';
        users.innerHTML += userLineOfHTML;
    }
});

/*
 * When we receive our team info or teams list
 */
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
            + '<td><i class="fa fa-times" onclick="onRemove(\'' + data[i]._id + '\');"></i></td>'
            + '</tr>';
    }

    teams_table.innerHTML = content;
});

/*
 * Send remove team request according to an id
 */
var onRemove = function(id) {
    socket.emit('removeteam', id);
};

/*
 * When we disconnect from admin interface
 */
var onDisconnect = function()
{
    socket.emit('removesessionip', {ip: my_ip});
};

/*
 * On page load
 */
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
        if(data.value === "")
            return;
        var message = data.value;
        data.value = "";
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
    }
});

/*
 * Redirect if no session created
 */
socket.on('getsessionip', function(data){
    if (data.status && data.name == "admin") {
        socket.emit('getteams');
        socket.emit('adduser', "admin#"+socket.id.toString().slice(1,5));
    } else {
        if(data.status)
            window.location.pathname = window.location.pathname.replace("admin", "team");
        else
            window.location.pathname = window.location.pathname.replace("admin", "sign_in");
    }
});