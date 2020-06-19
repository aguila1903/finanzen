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
$colors = ["#AFEEEE",
    "#6495ED",
    "#48D1CC",
    "#32CD32",
    "#F08080",
    "#FFB6C1",
    "#B4EEB4",
    "#CDAF95",
    "#836FFF",
    "#63B8FF",
    "#B0C4DE",
    "#48D1CC",
    "#87CEFF",
    "#87CEFF",
    "#BFEFFF",
    "#66CDAA",
    "#AB82FF",
    "#CAFF70",
    "#87CEEB",
    "#AFEEEE",
    "#6495ED",
    "#48D1CC",
    "#32CD32",
    "#F08080",
    "#FFB6C1",
    "#B4EEB4",
    "#CDAF95",
    "#836FFF",
    "#63B8FF",
    "#B0C4DE",
    "#48D1CC",
    "#87CEFF",
    "#87CEFF",
    "#BFEFFF",
    "#66CDAA",
    "#AB82FF",
    "#CAFF70",
    "#87CEEB",
    "#AFEEEE",
    "#6495ED",
    "#48D1CC",
    "#32CD32",
    "#F08080",
    "#FFB6C1",
    "#B4EEB4",
    "#CDAF95",
    "#836FFF",
    "#63B8FF",
    "#B0C4DE",
    "#48D1CC",
    "#87CEFF",
    "#87CEFF",
    "#BFEFFF",
    "#66CDAA",
    "#AB82FF",
    "#CAFF70",
    "#87CEEB"];

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;

$querySQL = "call dashboard_ein_kat();";


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
        $data[$i]['summe'] = $rs->fields['summe'];
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