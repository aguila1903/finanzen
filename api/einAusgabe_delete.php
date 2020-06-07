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


$sqlQuery = "Call umsaetzeKategorieDelete($ID) ";

//file_put_contents("query.txt", $sqlQuery);
$rs = $dbSyb->Execute($sqlQuery);

$value = array();

if (!$rs) {
    $out['response']['status'] = -4;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);
    return;
}

If (isset($rs->fields['ergebnis'])) {
    if ($rs->fields['ergebnis'] == 1) {
        $i = 0;

        while (!$rs->EOF) {

            $value["ergebnis"] = $rs->fields['ergebnis'];
            $value["ID"] = (isset($rs->fields['ID'])) ? $rs->fields['ID'] : 0;

            $i++;

            $rs->MoveNext();
        }

        $rs->Close();

        $out['response']['status'] = 0;
        $out['response']['errors'] = array();
        $out['response']['data'] = $value;

        print json_encode($out);
    } else {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('ID' => "Vorgang konnte nicht gelöscht werden. </br>" . $dbSyb->ErrorMsg());

        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('ID' => "Keine Ergebnis-Rückmeldung erhalten </br>" . $dbSyb->ErrorMsg());

    print json_encode($out);
    return;
}
?>
