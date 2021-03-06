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

if (!$dbSyb->IsConnected()) {


    print ("Anmeldung: " . $dbSyb->ErrorMsg());

    $data = array();

    return ($data);
}

$dbSyb->debug = false;


if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];
} else {
    $monat = "";
}

if (isset($_REQUEST["kontonr"])) {
    $kontonr = $_REQUEST["kontonr"];
} else {
    $kontonr = "";
}

$querySQL = 'SELECT count(*) as anz, SUM(ifnull(einnahme,0))+SUM(ausgabe) summe FROM monats_ausgaben WHERE DATE_FORMAT(datum, "%m%Y") = '.$dbSyb->Quote($monat).' AND kontonr = '.$dbSyb->Quote($kontonr).';';


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

 

    while (!$rs->EOF) {
        $data["summeUmsaetze"] = number_format($rs->fields['summe'],2,",",".");
        $data["anzahl"] = $rs->fields['anz'];

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