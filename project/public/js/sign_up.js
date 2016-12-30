var name, mail, p1, p2, p3, p4;

var onRegisterClick = function()
{
    name = document.getElementById("name").value;
    mail = document.getElementById("email").value;
    p1 = document.getElementById("password1").value;
    p2 = document.getElementById("password2").value;
    p3 = document.getElementById("password3").value;
    p4 = document.getElementById("password4").value;

    if (name.length <= 0)
    {
        window.alert("A team without a name ?! What a joke.");
        return;
    }

    if (mail.length <= 0)
    {
        window.alert("You don't want to let me spam you ? :(");
        return;
    }

    if (p1.length <= 0)
    {
        window.alert("I love your password.");
        return;
    }

    if ((p1 != p2)
        || (p1 != p3)
        || (p1 != p4))
    {
        window.alert("One of your password is not correct. And i will not tell you which one. :D");
        return;
    }
};

// On page load
window.addEventListener("load", function() {

    document.querySelector("#register").onclick = onRegisterClick;

    document.addEventListener("keypress", function (evt) {
        // if pressed ENTER, then send
        if (evt.keyCode == 13) {
            onRegisterClick();
        }
    });


});