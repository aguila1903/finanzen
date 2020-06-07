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


if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];


    if ((preg_match("/^[0-9]{1,5}$/", trim($ID))) == 0) {
        $ID = '';
    }
} else {
    $ID = '';
}


$querySQL = "Delete from kk_raten where ID = $ID;";


$rs = $dbSyb->Execute($querySQL);


if (!$rs) {
    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('Errors' => ($dbSyb->ErrorMsg()));
    $rs->Close();
    print json_encode($out);
    return;
}

$rs->Close();

$out['response']['status'] = 0;
$out['response']['errors'] = array();
$out['response']['data'] = $data;

print json_encode($out);
?>