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
$colors = ["#6A5ACD",
    "#DAA520",
    "#BC8F8F",
    "#CD5C5C",
    "#FA8072",
    "#E9967A",
    "#DB7093",
    "#EE82EE",
    "#BA55D3",
    "#FFB90F",
    "#CD5555",
    "#FF4040",
    "#EE9A00",
    "#FF6347",
    "#CD0000",
    "#FF82AB",
    "#EE7AE9",
    "#BF3EFF",
    "#9F79EE"];

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;

$querySQL = "call dashboard_ausg_kat();";


$rs = $dbSyb->Execute($querySQL);


if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;
    while (!$rs->EOF) {
        $data[$i]['summe'] = $rs->fields['summe'] * (-1);
        $data[$i]['kategorie'] = $rs->fields['bezeichnung'];
        $data[$i]['color'] = $colors[$i];
        $i++;


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