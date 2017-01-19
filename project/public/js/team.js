var conversation, data, datasend, users;
var enigma_list = null;
var socket = io.connect();

var threshold = 0.0001;

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    socket.emit('adduser', "user#"+socket.id.toString().slice(1,5));
});

// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
    var chatMessage = "<b>" + username + ":</b> " + data + "<br>";
    conversation = document.querySelector("#conversation");
    conversation.innerHTML += chatMessage;
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(listOfUsers) {
    users = document.querySelector("#users");
    users.innerHTML = "";
    for(var name in listOfUsers) {
        var userLineOfHTML = '<div>' + name + '</div>';
        users.innerHTML += userLineOfHTML;
    }
});


// on load of page
window.addEventListener("load", function(){

    socket.emit('getenigmas');

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

socket.on('getenigmas', function(data){
    console.log("[Get enigmas] " + JSON.stringify(data));
    for(var i = 0; i < data.length; i++){
        var loc = new google.maps.LatLng(data[i].location.latitude, data[i].location.longitude);
        placeMarker(loc);
    }

    enigma_list = data;
    console.log(userLocation.position.lat(), userLocation.position.lng());
    checkEnigmaWithMyPosition(userLocation.position.lat(), userLocation.position.lng());
});

var map, addedMarker, watchId, userLocation;

function pan(x,y) {
    var panPoint = new google.maps.LatLng(x, y);
    map.setCenter(panPoint);
    if (userLocation != null && userLocation.position != location) {
        userLocation.setMap(null);
    }
    userLocation = new google.maps.Marker({
        position: panPoint,
        map: map,
        icon : 'http://icons.iconarchive.com/icons/icons8/windows-8/32/Sports-Walking-icon.png'
    });
}

function placeMarker(location) {
    addedMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon : 'https://cdn4.iconfinder.com/data/icons/e-commerce-icon-set/48/FAQ-32.png'
    });
}

function getLocation() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(showPosition, errorCallback, {
            enableHighAccuracy: true,
            maximumAge:5
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    pan(position.coords.latitude , position.coords.longitude);
    checkEnigmaWithMyPosition(position.coords.latitude , position.coords.longitude);
}

function checkEnigmaWithMyPosition(lat, lng)
{
    if (enigma_list == null)
        return;

    for(var i = 0; i < enigma_list.length; i++){

        var diffLat = Math.abs(lat - enigma_list[i].location.latitude);
        var diffLng = Math.abs(lng - enigma_list[i].location.longitude);

        console.log("Checking {" + lat + " ; " + lng + "} & {"+ enigma_list[i].location.latitude + " ; " + enigma_list[i].location.longitude + "}");

        if (diffLat < threshold && diffLng < threshold)
        {
            console.log("ENIGMA DETECTED --> " + JSON.stringify(enigma_list[i]));
            showEnigma(enigma_list[i]);
            return showEnigma(enigma_list[i]);
        }
    }

    return hideEnigma();
}

function hideEnigma(){
    document.querySelector("#enigma").classList.add("collapse");
}

function showEnigma(enigma){
    var enigma_section = document.querySelector("#enigma");
    var question = document.querySelector("#question");

    var r1 = document.querySelector("#response1");
    var r2 = document.querySelector("#response2");
    var r3 = document.querySelector("#response3");
    var r4 = document.querySelector("#response4");

    question.innerHTML = enigma.question;
    r1.innerHTML = enigma.valid_response;
    r2.innerHTML = enigma.invalid_responses[0];
    r3.innerHTML = enigma.invalid_responses[1];
    r4.innerHTML = enigma.invalid_responses[2];

    enigma_section.classList.remove("collapse");

    scroll(0,0);
}

function errorCallback(error){
    var msg;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            msg = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            msg = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            msg = "An unknown error occurred.";
            break;
    }

    window.alert(msg);
}