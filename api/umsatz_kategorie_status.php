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

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;


if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];
    if ($ID != "null" && $ID != "") {
        if ((preg_match("/^[0-9]{1,11}?$/", trim($ID))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('ID' => "Bitte die ID prüfen!");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('ID' => "ID fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('ID' => "ID fehlt!");
    print json_encode($out);
    return;
}


if (isset($_REQUEST["status"])) {
    $status = $_REQUEST["status"];
    if ($status != "null" && $status != "") {
        if ((preg_match("/^[-9]{3,5}?$/", trim($status))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('status' => "Bitte Status prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('status' => "Status fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('status' => "Status fehlt!");
    print json_encode($out);
    return;
}


$sqlQuery = "Update monats_ausgaben set einausgaben_id = $status Where ID = $ID";

$rs = $dbSyb->Execute($sqlQuery);

$value = array();

if (!$rs) {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('ID' => $dbSyb->ErrorMsg());

    print json_encode($out);
    return;
}


$rs->Close();

$out['response']['status'] = 0;
$out['response']['errors'] = array();
$out['response']['data'] = $value;

print json_encode($out);

?>
