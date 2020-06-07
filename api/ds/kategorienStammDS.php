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

$data = array();

$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

if (!$dbSyb->IsConnected()) {
    print ("Anmeldung: " . $dbSyb->ErrorMsg());
    return ($data);
}

$dbSyb->debug = false;


$querySQL = "SELECT ID, bezeichnung, 
    CASE WHEN typ = 'F' THEN 'Fix' 
        WHEN typ = 'V' THEN 'Variabel' ELSE '' END AS typ_bez, typ, 
    CASE WHEN art = 'A' THEN 'Ausgabe' 
        WHEN art = 'E' THEN 'Einnahme' ELSE '' END AS art_bez, art
    FROM kategorien order by bezeichnung";


/* @var $rs string */
$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren

$data = array();

if (!$rs) {
    print("Query 1: " . $dbSyb->ErrorMsg());
    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;

    while (!$rs->EOF) {
        $data[$i]["ID"] = $rs->fields['ID'];
        $data[$i]["bezeichnung"] = $rs->fields['bezeichnung'];
        $data[$i]["typ"] = $rs->fields['typ'];
        $data[$i]["typ_bez"] = $rs->fields['typ_bez'];
        $data[$i]["art"] = $rs->fields['art'];
        $data[$i]["art_bez"] = $rs->fields['art_bez'];
        $i++;

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    print json_encode($data);
}
?>