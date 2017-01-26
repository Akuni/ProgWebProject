var latitude, longitude, question, vr, ir1, ir2, ir3, award;

var socket = io.connect();

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){});

socket.on('getenigmas', function (data) {
    var teams_table = document.querySelector("#enigmas_list_content");

    var content = "";

    for(var i = 0; i < data.length; i++){
        content += '<tr>';
        // content += '<td>' + data[i]._id.slice(-6) + '</td>';
        // content += '<td>' + data[i].location.latitude + "<br/>" + data[i].location.longitude + '</td>'

        content += '<td>' + data[i].question + '</td>'
            + '<td>' + data[i].valid_response + '</td>';

        var irs = "<ul class=\"text-justify\">";
        for(var j = 0; j < data[i].invalid_responses.length; j++)
            irs += '<li>' + data[i].invalid_responses[j] + '</li>';
        irs += "</ul>";

        content += '<td>' + irs + '</td>';
        content += '<td>' + data[i].award + '</td>';
        var rm = '<td><i class="fa fa-times" onclick="onRemove(\'' + data[i]._id + '\');"></i></td>';

        content += rm;
        content += '</tr>';

        var loc = new google.maps.LatLng(data[i].location.latitude, data[i].location.longitude);
        placeDoneMarker(loc);
    }

    teams_table.innerHTML = content;
});

var onRemove = function(id) {
    socket.emit('removeenigma', id);
};

// on load of page
window.addEventListener("load", function(){

    socket.emit('getenigmas');

    document.querySelector("#register").onclick = sendEnigma;

    document.addEventListener("keypress", function (evt) {
        // if pressed ENTER, then send
        if (evt.keyCode == 13) {
            sendEnigma();
        }
    });
});

var sendEnigma = function(){
    latitude = document.querySelector("#latitude");
    longitude = document.querySelector("#longitude");
    question =  document.querySelector("#question");
    vr =  document.querySelector("#valid_response");
    ir1 =  document.querySelector("#invalid_response1");
    ir2 =  document.querySelector("#invalid_response2");
    ir3 =  document.querySelector("#invalid_response3");
    award = document.querySelector("#award");

    clearStatusCorrectnessStyle();

    if (latitude.value.length <= 0)
    {
        setStatusCorrectnessStyle(latitude, true);
        return;
    }

    if (longitude.value.length <= 0)
    {
        setStatusCorrectnessStyle(longitude, true);
        return;
    }

    if (question.value.length <= 0)
    {
        setStatusCorrectnessStyle(question, true);
        return;
    }

    if (vr.value.length <= 0)
    {
        setStatusCorrectnessStyle(vr, true);
        return;
    }

    if (ir1.value.length <= 0)
    {
        setStatusCorrectnessStyle(ir1, true);
        return;
    }

    if (ir2.value.length <= 0)
    {
        setStatusCorrectnessStyle(ir2, true);
        return;
    }

    if (ir3.value.length <= 0)
    {
        setStatusCorrectnessStyle(ir3, true);
        return;
    }

    if (award.value.length <= 0)
    {
        setStatusCorrectnessStyle(award, true);
        return;
    }

    var enigma = {};

    enigma.location = {};
    enigma.location.latitude = latitude.value;
    enigma.location.longitude = longitude.value;

    enigma.question =  question.value;
    enigma.valid_response =  vr.value;
    enigma.invalid_responses = [ir1.value, ir2.value, ir3.value];

    enigma.award = award.value;

    socket.emit('addenigma', enigma);

    window.location.reload();
};

var clearStatusCorrectnessStyle = function()
{
    setStatusCorrectnessStyle(latitude, false);
    setStatusCorrectnessStyle(longitude, false);
    setStatusCorrectnessStyle(question, false);
    setStatusCorrectnessStyle(vr, false);
    setStatusCorrectnessStyle(ir1, false);
    setStatusCorrectnessStyle(ir2, false);
    setStatusCorrectnessStyle(ir3, false);
    setStatusCorrectnessStyle(award, false);
};

var setStatusCorrectnessStyle = function(elem, isWrong){

    if (isWrong)
        elem.classList.add("my-sign-up-wrong");
    else
        elem.classList.remove("my-sign-up-wrong");
};

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
    if (addedMarker != null && addedMarker.position != location)
        addedMarker.setMap(null);

    document.querySelector("#latitude").value = location.lat();
    document.querySelector("#longitude").value = location.lng();

    addedMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon :'https://maxcdn.icons8.com/windows8/PNG/26/Messaging/star-26.png'
    });
}

function placeDoneMarker(location) {
    new google.maps.Marker({
        position: location,
        map: map,
        icon : 'https://www.materialui.co/materialIcons/action/done_black_32x32.png'
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

function showPosition(position) {
    // var latlon = position.coords.latitude + "," + position.coords.longitude;

    // var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
    //
    pan(position.coords.latitude , position.coords.longitude);
    // document.getElementById('message').innerHTML = "Lat:" + position.coords.latitude + ", long:" +position.coords.longitude;
}

