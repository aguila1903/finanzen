<?php

session_start();
require_once('adodb5/adodb.inc.php');
require_once('conf.php');


$ADODB_CACHE_DIR = 'C:/php/cache';


$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 

$ADODB_COUNTRECS = true;

$dbSyb = ADONewConnection("mysqli");

// DB-Abfragen NICHT cachen
$dbSyb->memCache = false;

$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB


$out = array();
$data = array();

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;


if (isset($_REQUEST["karten_nr"])) {
    $karten_nr = strtoupper(($_REQUEST["karten_nr"]));
    if ($karten_nr != "NULL" && $karten_nr != "") {

        if ((preg_match("/^[0-9a-zA-Z]{1,50}?$/", trim($karten_nr))) == 0) {
            $out = array();

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('karten_nr' => "Kartenkürzel prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('karten_nr' => "Kartenkürzel prüfen");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('karten_nr' => "Kartenkürzel fehlt!");

    print json_encode($out);
    return;
}
if (isset($_REQUEST["ID"])) {
    $ID = strtoupper(($_REQUEST["ID"]));
    if ($ID != "NULL" && $ID != "") {

        if ((preg_match("/^[0-9]{1,11}?$/", trim($ID))) == 0) {
            $out = array();

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('ID' => "ID prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('ID' => "ID prüfen");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('ID' => "ID fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["vorgang"])) {

    $turk = array("Ç", "ç", "Ğ", "ğ", "I", "ı", "İ", "Ş", "ş");
    $deu = array("C", "c", "G", "g", "I", "i", "I", "S", "s");

//    $vorgang = str_replace($turk, $deu, $_REQUEST["vorgang"]);
    $vorgang = $_REQUEST["vorgang"];

    if (strlen(trim(($vorgang))) < 1) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('vorgang' => "Vorgang muss mindestens ein Zeichen beinhalten.");

        print json_encode($out);
        return;
    }
    if (strlen(trim(($vorgang))) >= 50) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('vorgang' => "Vorgang darf nicht mehr als 50 Zeichen beinhalten.");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('vorgang' => "Erforderlicher Parameter Vorgang fehlt!");

    print json_encode($out);
    return;
}


if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];

    if ((preg_match("/^[0-9]{6}?$/", trim($monat))) == 0) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('monat' => "Bitte den Monat prüfen!");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('monat' => "Erforderlicher Parameter Monat fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["rate"])) {
    $rate = $_REQUEST["rate"];

    if ((preg_match("/^[0-9]{1,6}?$/", trim($rate))) == 0) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('rate' => "Bitte den Rate prüfen!");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('rate' => "Erforderlicher Parameter Rate fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["max_rate"])) {
    $max_rate = $_REQUEST["max_rate"];

    if ((preg_match("/^[0-9]{1,6}?$/", trim($max_rate))) == 0) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('max_rate' => "Bitte die max. Rate prüfen!");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('max_rate' => "Erforderlicher Parameter max. Rate fehlt!");

    print json_encode($out);
    return;
}


if (isset($_REQUEST["betrag"])) {
    $betrag = str_replace(',', '.', $_REQUEST["betrag"]);
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('betrag' => "Erforderlicher Parameter Betrag fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["comment"])) {
    $comment = ($_REQUEST["comment"]);


    if (strlen(trim(($comment))) >= 500) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('comment' => "Kommentar darf nicht mehr als 500 Zeichen beinhalten.");

        print json_encode($out);
        return;
    }
} else {
    $comment = "";
}
if (isset($_REQUEST["datum"])) {
    $datum = $_REQUEST["datum"];
} else {
    $datum = "";
}

$querySQL = "call ratenEdit ("
        . $dbSyb->Quote($karten_nr)
        . "," . $dbSyb->Quote($vorgang)
        . "," . $rate
        . "," . $max_rate
        . "," . $betrag
        . "," . $dbSyb->Quote($monat)
        . "," . $ID;
if ($comment == "null" || $comment == "") {
    $querySQL .= ", NULL";
} else {
    $querySQL .= "," . $dbSyb->Quote($comment);
}
$querySQL .= "," . $dbSyb->Quote($datum) . ");";




//$fp = fopen("taksitEdit.txt", "w");
//fputs($fp, $querySQL);
//fclose($fp);



$rs = $dbSyb->Execute($querySQL);


$data = array();

if (!$rs) {

    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('karten_nr' => ($dbSyb->ErrorMsg()));

    print json_encode($out);
    return;
}

if (isset($rs->fields['Ergebnis'])) {
    $Ergebnis = $rs->fields['Ergebnis'];
} else {
    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('karten_nr' => "Kein Ergebnis erhalten!");

    print json_encode($out);
    return;
}

if ($Ergebnis == 1) {
    $data['Ergebnis'] = 'erfolgreich gespeichert';

    $rs->Close();
    $out = array();

    // zentrale Anwortfunktion fï¿½r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;

    print json_encode($out);
} elseif ($Ergebnis == -1) {
    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('karten_nr' => "Fehler beim Insert!");

    print json_encode($out);
    return;
} elseif ($Ergebnis == -2) {
    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('vade' => "Vade ist größer als Vade_max!");

    print json_encode($out);
    return;
}
?>