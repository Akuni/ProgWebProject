var conversation, data, datasend, users;

var socket = io.connect();

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    socket.emit('adduser', "user#"+socket.id.toString().slice(1,5));
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


// on load of page
window.addEventListener("load", function(){

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

var map, addedMarker;

function pan(x,y) {
    var panPoint = new google.maps.LatLng(x, y);
    map.setCenter(panPoint);
    var marker = new google.maps.Marker({
        position: panPoint,
        map: map,
        icon : 'http://icons.iconarchive.com/icons/icons8/windows-8/32/Sports-Walking-icon.png'
    });
}

function placeMarker(location) {
    if (addedMarker != null && addedMarker.position != location) {
        addedMarker.setMap(null);
    }

    // document.querySelector("#latitude").value = location.lat();
    // document.querySelector("#longitude").value = location.lng();

    addedMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon : 'https://cdn4.iconfinder.com/data/icons/e-commerce-icon-set/48/FAQ-32.png'
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    // var latlon = position.coords.latitude + "," + position.coords.longitude;

    // var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
    //
    pan(position.coords.latitude , position.coords.longitude);
    // document.getElementById('message').innerHTML = "Lat:" + position.coords.latitude + ", long:" +position.coords.longitude;
}