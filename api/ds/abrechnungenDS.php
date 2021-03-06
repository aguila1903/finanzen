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


if (isset($_REQUEST["karten_nr"])){
    $_karten_kz = $_REQUEST["karten_nr"];
}

if (isset($_REQUEST["datum"])){
    $datum = $_REQUEST["datum"];
    $datumArr = explode(".", $datum);
}
       
    
$querySQL =  "select ifnull(pdf,'noPDF.pdf') as pdf from kreditkarten_abr
where karten_nr = ".$dbSyb->Quote($_karten_kz)
." and datum = ".$dbSyb->Quote("{$datumArr[2]}-{$datumArr[1]}-{$datumArr[0]}");
    





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
        $data["pdf"] = (($rs->fields["pdf"]));
        $i++;

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    $out = array();

    // zentrale Anwortfunktion f�r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out["response"]["status"] = 0;
    $out["response"]["errors"] = array();
    $out["response"]["data"] = $data;

    print json_encode($out);
}
?>