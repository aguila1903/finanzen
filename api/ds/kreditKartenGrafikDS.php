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



if (isset($_REQUEST["jahr"])) {
    $jahr = $_REQUEST["jahr"];
    $where = "Where substring(monat,3,4) = " . $jahr;
} else {
    $jahr = "";
    $where = "";
}

if (isset($_REQUEST["auswahl"])) {
    $auswahl = $_REQUEST["auswahl"];
    if ($auswahl == "G") {
        $where = " Where substring(monat,3,4) between YEAR(CURDATE())-6 and YEAR(CURDATE()) ";
    } else {
        $where = "Where substring(monat,3,4) = " . $jahr;
    }
} else {
    $where = "";
}

// String mit DB-Abfrage f�r den Rest


$querySQL = " select  monat, sum(betrag) as gesamt, sum(zahlung) as zahlung, "
        . " SUBSTRING(monat,3,4) as jahr, "
        . " SUBSTRING(monat,1,2) nur_monat from kreditkarten_abr " . $where
        . " group by monat order by 4, 5 asc; ";



/* @var $rs string */
$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren

$data = array();

if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;

    while (!$rs->EOF) {

        $data[$i]['gesamt'] = $rs->fields['gesamt'];
        $data[$i]['monat'] = $rs->fields['monat'];
        $data[$i]['zahlung'] = $rs->fields['zahlung'];

        $i++;

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    $out = array();

    // zentrale Anwortfunktion f�r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;

    print json_encode($out);
}
?>