var latitude, longitude, question, vr, ir1, ir2, ir3, award;

var socket = io.connect();

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){});

socket.on('getenigmas', function (data) {
    console.log(JSON.stringify(data));

    var teams_table = document.querySelector("#enigmas_list_content");

    var content = "";

    for(var i = 0; i < data.length; i++){
        content += '<tr>';
        // content += '<td>' + data[i].id + '</td>';
        content += '<td>' + data[i].location + '</td>'
            + '<td>' + data[i].question + '</td>'
            + '<td>' + data[i].valid_response + '</td>';

        var irs = "";
        for(var j = 0; j < data[i].invalid_responses.length; j++)
            irs += (irs.length > 0)?"/":"" + data[i][j];

        content += '<td>' + irs + '</td>';
        content += '<td>' + data[i].award + '</td>';
        // content += '<td><i class="fa fa-times" onclick=\"onRemove(' + elem.id + ')\"></i></td>';
        content += '</tr>';
    }

    teams_table.innerHTML = content;
});

var onRemove = function(id) {
    console.log("Remove(" + id + ")");
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
    enigma.invalid_response1 =  ir1.value;
    enigma.invalid_response2 =  ir2.value;
    enigma.invalid_response3 =  ir3.value;

    enigma.award = award.value;

    console.log("[Add Enigma] " + JSON.stringify(enigma));
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

    document.querySelector("#latitude").value = location.lat();
    document.querySelector("#longitude").value = location.lng();

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

