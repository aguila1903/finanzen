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


if (isset($_REQUEST["typ"])) {
    $typ = $_REQUEST["typ"];
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('Errors' => "Erforderlicher Parameter Typ fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('Errors' => "Erforderlicher Parameter Monat fehlt!");

    print json_encode($out);
    return;
}

if ($typ == "down") {
    $querySQL = "call raten_down (" . $dbSyb->Quote($monat) . ", " . $dbSyb->Quote($karten_nr) . ");";
} else {
    $querySQL = "call raten_up (" . $dbSyb->Quote($monat) . ", " . $dbSyb->Quote($karten_nr) . ");";
}

$rs = $dbSyb->Execute($querySQL);

if (!$rs) {

    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('Errors' => ($dbSyb->ErrorMsg()));

    print json_encode($out);
    return;
}

if (isset($rs->fields['Ergebnis'])) {
    $Ergebnis = $rs->fields['Ergebnis'];
} else {
    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('Errors' => "Kein Ergebnis erhalten!");

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
} else {
    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('Errors' => "Fehler beim Insert!");

    print json_encode($out);
    return;
}
?>