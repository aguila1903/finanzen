<?php

session_start();

require_once('adodb5/adodb.inc.php');
require_once('conf.php');


$ADODB_CACHE_DIR = 'C:/php/cache';


$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 

$ADODB_COUNTRECS = true;

$dbSyb = ADONewConnection("mysqli");
$dbSyb->debug = false;

// DB-Abfragen NICHT cachen
$dbSyb->memCache = false;
$data = array();


if (isset($_REQUEST["value"])) {
    $value = $_REQUEST["value"];
	$where = "where bundle like '%$value%' and bundle IS NOT NULL;";
} else {
	$where = "Where bundle IS NOT NULL;";
}



$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

if (!$dbSyb->IsConnected()) {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array($f => $dbSyb->ErrorMsg());
    print json_encode($out);
    return;
}



  $querySQL = "Select bundle as bezeichnung from einausgaben $where";
//    file_put_contents("herkunft.txt", $querySQL);


/* @var $rs string */
$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren


if (!$rs) {
    // keine Query hat nicht funtioniert    
    $out['response']['status'] = -4;
    $out['response']['errors'] = array($f => $dbSyb->ErrorMsg());
    print json_encode($out);
    return;
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;

    while (!$rs->EOF) {
        $data[$i]["ID"] = $i;
        $data[$i]["bezeichnung"] = $rs->fields['bezeichnung'];
        $i++;

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