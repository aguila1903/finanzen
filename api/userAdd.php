<?php

require_once('adodb5/adodb.inc.php');
require_once('conf.php');

$ADODB_CACHE_DIR = 'C:/php/cache';

$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 

$ADODB_COUNTRECS = true;

$dbSyb = ADONewConnection("mysqli");

// DB-Abfragen NICHT cachen
$dbSyb->memCache = false;

$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

$data = array();


if (!$dbSyb->IsConnected()) {
    errorMsg("Anmeldung: " . $dbSyb->ErrorMsg(), 0);
}

$dbSyb->debug = false;


if (isset($_POST["benutzer"])) {
    $benutzer = $_POST["benutzer"];
    if ((preg_match("/^[0-9a-zA-Z-+*_.]{3,20}$/", trim($benutzer))) == 0) {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('benutzer' => "Bitte einen Benutzer, bestehend aus mind. 3, max. 20 Zeichen eingeben. (erlaubte Zeichen: 0-9a-zA-Z-+*_.)");

        print json_encode($out);

        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('benutzer' => "Bitte einen Benutzer eintragen");

    print json_encode($out);
    return;
}

if (isset($_POST["status"])) {
    $status = $_POST["status"];
    if ((preg_match("/^[OBob]{1}$/", trim($status))) == 0) {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('status' => "Fehler beim Eintrag Satus");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('status' => "Bitte einen Status eintragen");

    print json_encode($out);
    return;
}
if (isset($_POST["email"])) {
    $email = $_POST["email"];
    if ($email != "" && $email != "null") {
        if ((preg_match("/^(([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4})|([ ])|([null])$/", trim(trim($email)))) == 0) {
            $out['response']['status'] = -4;
            $out['response']['errors'] = array('email' => "Bitte eine korrekte eMail-Adresse eingeben.");
            print json_encode($out);
            return;                                   // Der vertikale Strich '|' bedeuted oder.
        }
    } else {
        $email = "";
    }
} else {
    $email = "";
}

if (isset($_POST["admin"])) {
    $admin = $_POST["admin"];
    if ($admin != "null" && $admin != "") {
        if ((preg_match("/^[JN]{1}?$/", trim($admin))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('admin' => "Bitte das Feld Admin prüfen.");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('admin' => "Admin fehlt!");

        print json_encode($out);

        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('admin' => "Admin fehlt!");

    print json_encode($out);

    return;
}


if (isset($_POST["sidAdmin"])) {
    $sidAdmin = $_POST["sidAdmin"];
    if ($sidAdmin != "null" && $sidAdmin != "") {
        if ((preg_match("/^[JN]{1}?$/", trim($sidAdmin))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('admin' => "Bitte den sidAdmin prüfen.");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('admin' => "sidAdmin fehlt!");

        print json_encode($out);

        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('admin' => "sidAdmin fehlt!");

    print json_encode($out);

    return;
}

if (isset($_POST["passwort"])) {
    $_passwort = trim($_POST["passwort"]);
    if (!empty($_passwort)) {        
        if ((preg_match("/^[0-9a-zA-Z-+*_.]{6,40}$/", $_passwort)) == 0) {
            $out['response']['status'] = -4;
            $out['response']['errors'] = array('passwort' => "Das Passwort darf nur aus folgenden Zeichen bestehen: 0-9 a-z A-Z - + * _ und muss aus mind. 6, max. 40 Zeichen bestehen.");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('passwort' => "Bitte ein Passwort eingeben");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('passwort' => "Bitte ein Passwort eingeben");

    print json_encode($out);
    return;
}
//------------------------- Passwort 2 ------------------------------------------------------------------------------------------------------------------------------------------
if (isset($_POST["passwort2"])) {
    if (trim($_POST["passwort2"]) != "") {
        $_passwort2 = $_POST["passwort2"];
        if ($_passwort2 != $_passwort) {
            $out['response']['status'] = -4;
            $out['response']['errors'] = array('passwort2' => "Passwörter sind nicht identisch!");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('passwort2' => "Bitte bestätigen Sie Ihr Passwort");

        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('passwort2' => "Bitte bestätigen Sie Ihr Passwort");

    print json_encode($out);
    return;
}

if ($sidAdmin == ADMIN_STD && ($admin != ADMIN_STD)) { // Es handelt sich um keinen Admin aber der übergebene Admin-Parameter ist nicht der Standard-Admin
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('admin' => "Sie sind nicht dazu berechtigt, den User auf admin zu setzen!");

    print json_encode($out);
    return;
}

$querySQL = "call UserAddProc (" . $dbSyb->Quote($benutzer)
        . "," . $dbSyb->Quote(base64_encode($_passwort)) .
        "," . $dbSyb->Quote($status) .
        "," . $dbSyb->Quote($admin) .
        "," . $dbSyb->Quote($email)
        . ")"
;
//file_put_contents("user_add.txt", $querySQL);

$rs = $dbSyb->Execute($querySQL);

$userID = 0;


if (!$rs) {

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('benutzer' => $dbSyb->ErrorMsg());
    print json_encode($out);
    return;
}

$i = 0;

while (!$rs->EOF) { // =>>> End OF File
    $ergebnis = $rs->fields['ergebnis'];
    $userID = $rs->fields['userID'];

    $i++;

    $rs->MoveNext();
}

$rs->Close();
if ($ergebnis == 1) {
    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;
} elseif ($ergebnis == -1) {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('benutzer' => "User existiert bereits");
    print json_encode($out);
    return;
} elseif ($ergebnis == -2) {

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('benutzer' => "Fehler beim Anlegen des Users: " . $dbSyb->ErrorMsg());
    print json_encode($out);
    return;
} elseif ($ergebnis == 0) {

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('benutzer' => "Fehler beim Anlegen des Users: " . $dbSyb->ErrorMsg());
    print json_encode($out);
    return;
}

print json_encode($out);
?>