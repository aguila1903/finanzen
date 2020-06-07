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

            $out["response"]["status"] = -4;
            $out["response"]["errors"] = array('Errors' => "Kartenkürzel prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out = array();

        $out["response"]["status"] = -4;
        $out["response"]["errors"] = array('Errors' => "Kartenkürzel prüfen");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "Kartenkürzel fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["vorgang"])) {
    $vorgang = ($_REQUEST["vorgang"]);

    if (strlen(trim(($vorgang))) < 1) {
        $out = array();

        $out["response"]["status"] = -4;
        $out["response"]["errors"] = array('Errors' => "Islem muss mindestens ein Zeichen beinhalten.");

        print json_encode($out);
        return;
    }
    if (strlen(trim(($vorgang))) >= 50) {
        $out = array();

        $out["response"]["status"] = -4;
        $out["response"]["errors"] = array('Errors' => "Islem darf nicht mehr als 50 Zeichen beinhalten.");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "Erforderlicher Parameter Islem fehlt!");

    print json_encode($out);
    return;
}


if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];

    if ((preg_match("/^[0-9]{6}?$/", trim($monat))) == 0) {
        $out = array();

        $out["response"]["status"] = -4;
        $out["response"]["errors"] = array('Errors' => "Bitte den Monat prüfen!");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "Erforderlicher Parameter Monat fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["rate"])) {
    $rate = $_REQUEST["rate"];

    if ((preg_match("/^[0-9]{1,6}?$/", trim($rate))) == 0) {
        $out = array();

        $out["response"]["status"] = -4;
        $out["response"]["errors"] = array('Errors' => "Bitte den Vade prüfen!");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "Erforderlicher Parameter Vade fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["max_rate"])) {
    $max_rate = $_REQUEST["max_rate"];

    if ((preg_match("/^[0-9]{1,6}?$/", trim($max_rate))) == 0) {
        $out = array();

        $out["response"]["status"] = -4;
        $out["response"]["errors"] = array('Errors' => "Bitte den Vade_max prüfen!");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "Erforderlicher Parameter Vade_max fehlt!");

    print json_encode($out);
    return;
}


if (isset($_REQUEST["betrag"])) {
    $betrag = str_replace(',', '.', $_REQUEST["betrag"]);
} else {
    $out = array();

    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "Erforderlicher Parameter Taksit fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["comment"])) {
    $comment = ($_REQUEST["comment"]);

 
    if (strlen(trim(($comment))) >= 500) {
        $out = array();

        $out["response"]["status"] = -4;
        $out["response"]["errors"] = array('Errors' => "Yorum darf nicht mehr als 500 Zeichen beinhalten.");

        print json_encode($out);
        return;
    }
} else {
 $comment = "";
}

$querySQL = "call ratenFindID ("
        . $dbSyb->Quote($karten_nr)
        . "," . $dbSyb->Quote($vorgang)
        . "," . $rate
        . "," . $max_rate
        . "," . $betrag
        . "," . $dbSyb->Quote($monat).");";
        

$rs = $dbSyb->Execute($querySQL);

if (!$rs) {

    $out = array();

    $out["response"]["data"] = $data;
    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => ($dbSyb->ErrorMsg()));

    print json_encode($out);
    return;
}


 while (!$rs->EOF) {
if (isset($rs->fields["Ergebnis"])) {
    $Ergebnis = $rs->fields["Ergebnis"];
    $ID = $rs->fields["ID"];
} else {
    $out = array();

    $out["response"]["data"] = $data;
    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "Kein Ergebnis erhalten!");

    print json_encode($out);
    return;
}     
$rs->MoveNext();
    }
$rs->Close();

if ($Ergebnis == 1) {
    $data["Ergebnis"] = $Ergebnis;
    $data["ID"] = $ID;
    

    $out = array();

    // zentrale Anwortfunktion fï¿½r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out["response"]["status"] = 0;
    $out["response"]["errors"] = array();
    $out["response"]["data"] = $data;

    print json_encode($out);
} elseif ($Ergebnis == -1) {
    $out = array();

    $out["response"]["data"] = $data;
    $out["response"]["status"] = -4;
    $out["response"]["errors"] = array('Errors' => "ID konnte nicht ermittelt werden!");

    print json_encode($out);
    return;
}
?>