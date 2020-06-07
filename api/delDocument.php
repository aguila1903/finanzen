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

$path = str_replace("/", "\\", PATH_DOCS);

if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];
    if ($ID != "null" && $ID != "") {
        if ((preg_match("/^[0-9]{1,11}?$/", trim($ID))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = "Bitte die ID prüfen!";
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = "ID fehlt!";
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = "ID fehlt!";
    print json_encode($out);
    return;
}

if (isset($_REQUEST["document"])) {
    $document = $_REQUEST["document"];
    if ($document == "null" || $document == "") {
        $out['response']['status'] = -1;
        $out['response']['errors'] = "document fehlt!";
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = "document fehlt!";
    print json_encode($out);
    return;
}

$sqlQuery = "Update einausgaben set dokument = NULL where ID = $ID ";

//file_put_contents("query.txt", $sqlQuery);
$rs = $dbSyb->Execute($sqlQuery);

$value = array();

if (!$rs) {
    $out['response']['status'] = -4;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);
    return;
} else {
    $rs->Close();

    if (is_file($path . $document)) {
        @unlink($path . $document);
    }

    $out['response']['status'] = 0;
    $out['response']['errors'] = "";
    $out['response']['data'] = $value;
    print json_encode($out);
    return;
}
?>
