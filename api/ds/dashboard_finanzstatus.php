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


$out = [];
$data = [];

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;

$querySQL = "call dashboard_finanzstatus();";


$rs = $dbSyb->Execute($querySQL);


if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;
    $ii = 0;
    while (!$rs->EOF) {
        if ($rs->fields['stand'] == date("d.m.Y")) {
            $data[$i]['today']['summe'] = number_format($rs->fields['summe'], 2, ",", ".");
            $data[$i]['today']['summeCount'] = $rs->fields['summe'];
            $data[$i]['today']['stand'] = ($rs->fields['stand']);
            $data[$i]['today']['title'] = ($rs->fields['bezeichnung']);
            $i++;
        } else {
            $data[$ii]['lastmonth']['summe'] = number_format($rs->fields['summe'], 2, ",", ".");
            $data[$ii]['lastmonth']['summeCount'] = $rs->fields['summe'];
            $data[$ii]['lastmonth']['stand'] = ($rs->fields['stand']);
            $data[$ii]['lastmonth']['title'] = ($rs->fields['bezeichnung']);
            $ii++;
        }

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;

    print json_encode($out);
}
?>