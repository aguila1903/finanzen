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
// Toplevel

$sqlQuery = "SELECT UserID, benutzer, passwort, admin, status, email, onlineTime, logoutTime, loginCount, loginTime, timeOut from users "
;

$rs = $dbSyb->Execute($sqlQuery);


if (!$rs) {
    print $dbSyb->ErrorMsg() . "\n";
    return;
}
$i = 0;

$value = array();

while (!$rs->EOF) {

    $value[$i]["UserID"] = $rs->fields['UserID'];
    $value[$i]["benutzer"] = utf8_encode($rs->fields['benutzer']);
    $value[$i]["passwort"] = utf8_encode($rs->fields['passwort']);
    $value[$i]["admin"] = $rs->fields['admin'];
    $value[$i]["status"] = $rs->fields['status'];
    $value[$i]["loginCount"] = $rs->fields['loginCount'];
    $value[$i]["loginTime"] = $rs->fields['loginTime'];
    $value[$i]["timeOut"] = $rs->fields['timeOut'];
    $value[$i]["email"] = utf8_encode($rs->fields['email']);
    $value[$i]["onlineTime"] = utf8_encode($rs->fields['onlineTime']);
    $value[$i]["logoutTime"] = utf8_encode($rs->fields['logoutTime']);
     
        if ($value[$i]["status"] == "O") {
        $id = 0; 
        $value[$i]["_hilite"] = $id;
    }
    
    $i++;

    // den n�chsten Datensatz lesen
    $rs->MoveNext();
}

$rs->Close();


$output = json_encode($value);

print($output);

