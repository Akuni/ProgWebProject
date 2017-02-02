var conversation, data, datasend, users;
var my_ip;
var enigma_list = null;
var answered_enigma = false;
var g_won = false;
var current_enigma = null;
var current_team = null;
var current_rank = null;
var map_initialized = false;

var socket = io.connect();

var threshold = 0.0001;

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){}
);

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
    document.querySelector("#submitEnigma").onclick = checkAnswer;
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

var onDisconnect = function()
{
    socket.emit('removesessionip', {ip: my_ip});
};

function initEnigmaMap()
{
    if (map_initialized || current_team == null || enigma_list == null)
        return;

    for(var i = 0; i < enigma_list.length; i++)
    {
        var loc = new google.maps.LatLng(enigma_list[i].location.latitude, enigma_list[i].location.longitude);
        var isDone = isEnigmaDone(enigma_list[i]._id);
        var title = ((isDone)?(enigma_list[i].question + " - "):"") + enigma_list[i].award + " point(s)";
        placeMarker(loc, isDone, title);
    }

    map_initialized = true;
}

socket.on('getenigmas', function(data){
    initEnigmaMap();
    enigma_list = data;
    checkEnigmaWithMyPosition(userLocation.position.lat(), userLocation.position.lng());
});

socket.on('getsessionip', function(data){
    if (data.status) {
        // Loading info
        socket.emit('adduser', data.name + "#" + socket.id.toString().slice(1,5));
        socket.emit('getenigmas');
        socket.emit('getteams', {name: data.name}, true);
    } else {
        window.location.pathname = window.location.pathname.replace("team", "sign_in");
    }
});

socket.on('getteams', function(data){
    console.log(JSON.stringify(data));
    if (data.length == 1)
    {
        current_team = data[0];
      console.log(data[0].rank);
        updateInfo();
        initEnigmaMap();
        if (saved_position != null)
            checkEnigmaWithMyPosition(saved_position.coords.latitude , saved_position.coords.longitude);
    } else {
        socket.emit('getteams', {name: current_team.name});
    }
});

function compareRank(a, b) {
  return a.score - b.score;
}

var getRank = function(name, data){
  data.sort(compareRank);
  for(var i = 0; i < data.length; i++)
    if(name === data[i].name)
      return i;
};

var updateInfo = function()
{
    if(answered_enigma){
        answered_enigma = false;
        var msg = "Invalid response\nThe answer was: " + current_enigma.valid_response + ".";
        var img = "img/animations/loser.gif";
        if(g_won){
            msg = "Congratulations !! Your team earns " + current_enigma.award + " point(s).";
            img = "img/animations/money.gif";
        }
        $("#enigmaModal .modal-body div")[0].innerHTML = msg;
        $("#enigmaModal .modal-body img")[0].src = img;
    }

    document.querySelector("#pagename").innerHTML = "EnigMap - " + ((current_team.name || 0) ? current_team.name : "Unknown");
    document.querySelector("#tname").innerHTML = (current_team.name || 0) ? "Hello " + current_team.name : "Hi there !";
    document.querySelector("#rank").innerHTML = (current_team.rank || 0) ? current_team.rank : "L0S3R";
    document.querySelector("#score").innerHTML = ((current_team.score || 0) ? current_team.score : "0");
    document.querySelector("#enigma_count").innerHTML = ((current_team.list_enigma_done) ? current_team.list_enigma_done.length : "0") + "/" + enigma_list.length;
};

var checkAnswer = function()
{
    var answer = document.querySelector('input[name="answer"]:checked').value;
    $("#enigmaModal").modal('show');
    answered_enigma = true;
    var correct_answer = current_enigma.valid_response;

    var won = (answer == correct_answer);

    var req = {};
    req.enigma_id = current_enigma._id;
    req.team_name = current_team.name;
    req.won = won;

    socket.emit('solveenigma', req);

    hideEnigma();

    g_won = won;
};

var map, addedMarker, watchId, userLocation;
var saved_position = null;

function pan(x,y) {

    var panPoint = new google.maps.LatLng(x, y);
    map.setCenter(panPoint);

    if (userLocation != null && userLocation.position != location) {
        userLocation.setMap(null);
    }

    userLocation = new google.maps.Marker({
        position: panPoint,
        map: map,
        title: "You are here",
        icon : 'http://icons.iconarchive.com/icons/icons8/windows-8/32/Sports-Walking-icon.png'
    });
}

function placeMarker(location, isDone, title) {
    console.log("placeMarker --> " + isDone);
    addedMarker = new google.maps.Marker({
        title: title,
        position: location,
        map: map,
        icon : (isDone)?
            'https://www.materialui.co/materialIcons/action/done_black_32x32.png'
            :'https://maxcdn.icons8.com/windows8/PNG/26/Messaging/star-26.png'
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
    saved_position = position;
    pan(position.coords.latitude , position.coords.longitude);
    checkEnigmaWithMyPosition(position.coords.latitude , position.coords.longitude);
}

function checkEnigmaWithMyPosition(lat, lng)
{
    if (enigma_list == null || current_team == null)
        return;

    for(var i = 0; i < enigma_list.length; i++){

        var diffLat = Math.abs(lat - enigma_list[i].location.latitude);
        var diffLng = Math.abs(lng - enigma_list[i].location.longitude);

        //console.log("Checking {" + lat + " ; " + lng + "} & {"+ enigma_list[i].location.latitude + " ; " + enigma_list[i].location.longitude + "}");

        if (diffLat < threshold && diffLng < threshold)
        {
            if (!isEnigmaDone(enigma_list[i]._id))
            {
                console.log("ENIGMA NOT DONE YET");
                current_enigma = enigma_list[i];
                return showEnigma(enigma_list[i]);
            }
        }
    }

    return hideEnigma();
}

function isEnigmaDone(id)
{

    // if(!(current_team || 0))
    //     return false;

    if (current_team.list_enigma_done || 0)
    {
        var res = current_team.list_enigma_done.indexOf(id) > -1;
        console.log("isEnigmaDone(" + id + ") -> " + res);
        return res;
    }

    return false;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function hideEnigma(){
    document.querySelector("#enigma").classList.add("collapse");
}

function showEnigma(enigma){
    var enigma_section = document.querySelector("#enigma");
    var question = document.querySelector("#question");

    var rl1 = document.querySelector("#response1");
    var rl2 = document.querySelector("#response2");
    var rl3 = document.querySelector("#response3");
    var rl4 = document.querySelector("#response4");

    var r1 = document.querySelector("#radio1");
    var r2 = document.querySelector("#radio2");
    var r3 = document.querySelector("#radio3");
    var r4 = document.querySelector("#radio4");


    var irs = enigma.invalid_responses;
    irs.push(enigma.valid_response);
    shuffle(irs);

    question.innerHTML = enigma.question + " -- " + enigma.award + "point(s)";

    rl1.innerHTML = irs[0];
    r1.value = irs[0];

    rl2.innerHTML = irs[1];
    r2.value = irs[1];

    rl3.innerHTML = irs[2];
    r3.value = irs[2];

    rl4.innerHTML = irs[3];
    r4.value = irs[3];

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