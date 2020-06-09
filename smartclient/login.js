if (window.XMLHttpRequest)
{// code for IE7+, Firefox, Chrome, Opera, Safari
    var xhr = new XMLHttpRequest();
} else
{// code for IE6, IE5
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
}
var errColor = '#EE2C2C';
var normColor = '#F0F0F0';
var domain = document.location.host;
var prot = location.protocol+'//';
var path = prot + domain;/*+ appFolder*/

function sendLogin()
{

    var user = document.forms[0][0].value;
    var pw = document.forms[0][1].value;

    if (user == "")
    {
        document.getElementById("benutzername").style = "background-color: " + errColor;
        document.getElementById("antwort").innerHTML = 'Bitte den Benutzernamen eingeben';
        return;
    }
    if (pw == "")
    {
        document.getElementById("passwort").style = "background-color: " + errColor;
        document.getElementById("antwort").innerHTML = 'Bitte das Passwort eingeben';
        return;
    }

    var params = "benutzername=" + user + "&passwort=" + pw;
    xhr.open("POST", 'login.php', true);
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = handleResponse;
    xhr.send(params);
}

function handleResponse()
{
    var rueckmeldung;
    // rueckmeldung = JSON.parse(xhr.response);
    rueckmeldung = xhr.response;
	// console.log(xhr);
    if (xhr.readyState == 4 && xhr.status == 200 )
    {
        if (rueckmeldung["ergebnis"] == userOK && rueckmeldung["status"])
        {
            document.getElementById("antwort").innerHTML = rueckmeldung["text"];
			// Hier können Deeplinks gesetzt werden
            window.open(path + '/finanzen/compile', '_self', false);  
        } else
        {
            document.getElementById("antwort").innerHTML = rueckmeldung["text"];
            switch (rueckmeldung["ergebnis"])
            {
                case 4: // Kein Benutzername
                    document.getElementById("benutzername").style = "background-color: " + errColor;
                    break;
                case 5: // Kein Passwort
                    document.getElementById("passwort").style = "background-color: " + errColor;
                    break;
            }
        }
    }else{
		document.getElementById("antwort").innerHTML = "Anmeldung fehlgeschlagen: <br>"+xhr.statusText+" ("+xhr.status+")";
	}
}

function init()
{
    const login = document.getElementById("btnLogin");
    const passwd = document.getElementById("passwort");
    const user = document.getElementById("benutzername");

    login.onclick = sendLogin;


    // document.images[0].src = appFolder + "/images/login/welcome.png";


    document.addEventListener("keypress", function ()
    {
        document.getElementById("passwort").style = "background-color: " + normColor;
        document.getElementById("benutzername").style = "background-color: " + normColor;
    });
    document.addEventListener("change", function ()
    {
        document.getElementById("passwort").style = "background-color: " + normColor;
        document.getElementById("benutzername").style = "background-color: " + normColor;
    });


    passwd.addEventListener("keydown", function (event)
    {
        if (event.key === "Enter")
        {
            event.preventDefault();
            sendLogin();
        }
    });

    user.addEventListener("keydown", function (event)
    {
        if (event.key === "Enter")
        {
            event.preventDefault();
            sendLogin();
        }
    });
}

window.onload = init;