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


if (isset($_REQUEST["typ"])) {
    $typ = $_REQUEST["typ"];
    if ($typ != "null" && $typ != "") {
        if ((preg_match("/^[VF]{1}?$/", trim($typ))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('typ' => "Bitte den Kostentyp prüfen");

            print json_encode($out);
            return;
        } else {
            $whereTyp = " and typ = " . $dbSyb->Quote($typ);
        }
    } else {
        $whereTyp = "";
    }
} else {
    $whereTyp = "";
}
if (isset($_REQUEST["art"])) {
    $art = $_REQUEST["art"];
    if ($art != "null" && $art != "") {
        if ((preg_match("/^[AE]{1}?$/", trim($art))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('art' => "Bitte den Kostenart prüfen");

            print json_encode($out);
            return;
        } else {
            $whereArt = " and art = " . $dbSyb->Quote($art);
        }
    } else {
        $whereArt = "";
    }
} else {
    $whereArt = "";
}

$querySQL = "Select ID, bezeichnung from kategorien where ID > -1 $whereTyp /*$whereArt*/  Order by bezeichnung;";


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
        $data[$i]["ID"] = $rs->fields['ID'];
        $data[$i]["bezeichnung"] = $rs->fields['bezeichnung'];
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