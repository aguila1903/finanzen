<?php

session_start();
include 'wechselkursHist.php';
require_once('adodb5/adodb.inc.php');
require_once('conf.php');

$ADODB_CACHE_DIR = 'C:/php/cache';


$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 

$ADODB_COUNTRECS = true;

$dbSyb = ADONewConnection("mysqli");

// DB-Abfragen NICHT cachen
$dbSyb->memCache = false;

$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB


$out = [];
$data = [];

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;


if (isset($_REQUEST["jahr"])) {
    $jahr = $_REQUEST["jahr"];
} else {
    $jahr = "";
}


// String mit DB-Abfrage f�r den Rest


$querySQL = "call spSummenRechner (" . $jahr . ");";


$rs = $dbSyb->Execute($querySQL); 


if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {
    $jahr_akt = date("Y");
    $heute = date("Y-m-d");
//    echo $heute;
    if ($jahr != $jahr_akt) {
        $wechselkurs = getHistEx($jahr . "-12-31");
    } else {
        $wechselkurs = getHistEx($heute);
    }
    $i = 0;


    while (!$rs->EOF) {
        $data[$i]['summe'] = (float) $rs->fields['Summe'];
        if ($rs->fields['Summe'] > 0 && $wechselkurs > 0) {
            $data[$i]['summeEuro'] = (float) ($rs->fields['Summe'] / $wechselkurs);
        } else {
            $data[$i]['summeEuro'] = 0;
        }
        $data[$i]['karte'] = ($rs->fields['Karte']);

        $i++;

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    

    // zentrale Anwortfunktion f�r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;

    print json_encode($out);
}
?>