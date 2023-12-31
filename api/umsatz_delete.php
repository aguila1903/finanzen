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
$value = array();

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
        if ((preg_match("/^[0-9|]{1,}?$/", trim($ID))) == 0) {

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


if (isset($_REQUEST["action"])) {
    $action = $_REQUEST["action"];
    if ($action != "null" && $action != "") {
        if ((preg_match("/^[deleteKat]{6,9}?$/", trim($action))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = "Bitte die action prüfen!";
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = "action fehlt!";
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = "action fehlt!";
    print json_encode($out);
    return;
}

$IDs = trim($ID, "|");

$aID = explode("|", $IDs);

foreach ($aID as $id) {
    if ($action == "delete") {

        $querySQL = " SELECT IFNULL(einausgaben_id, -1) as einausgaben_id FROM monats_ausgaben WHERE ID = $id;";
        $rs2 = $dbSyb->Execute($querySQL);

        if (!$rs2) {
            $out['response']['status'] = -4;
            $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

            print json_encode($out);
            return;
        }
        $einausgaben_id = $rs2->fields['einausgaben_id'];
        $rs2->Close();

        $sqlQuery = "Delete from monats_ausgaben where ID = $id ";
    } elseif ($action == "deleteKat") {
        $querySQL = " SELECT einausgaben_id FROM monats_ausgaben WHERE ID = $id;";

        $rs2 = $dbSyb->Execute($querySQL);

        if (!$rs2) {
            $out['response']['status'] = -4;
            $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

            print json_encode($out);
            return;
        }

//        file_put_contents("query.txt", $rs2->fields['einausgaben_id']."\n", FILE_APPEND);
        if (empty($rs2->fields['einausgaben_id']) || $rs2->fields['einausgaben_id'] == '-999' || $rs2->fields['einausgaben_id'] == '-99') {
            $rs2->Close();
            continue;
        } else {
            $sqlQuery = "Delete from einausgaben where ID = " . $rs2->fields['einausgaben_id'];
        }

        $rs = $dbSyb->Execute($sqlQuery);

        if (!$rs) {
            $out['response']['status'] = -4;
            $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

            print json_encode($out);
            return;
        }

        $rs2->Close();

        $rs->Close();

        $sqlQuery = " Update monats_ausgaben set einausgaben_id = NULL WHERE ID = $id;";
    }

    $rs = $dbSyb->Execute($sqlQuery);

    if (!$rs) {
        $out['response']['status'] = -4;
        $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

        print json_encode($out);
        return;
    }
    $rs->Close();


    // Nachträgliches Löschen der Kategorie
    if ($action == "delete") {

//        file_put_contents("query.txt", print_r($rs2->fields['einausgaben_id'], true)."\n", FILE_APPEND);
        if ($einausgaben_id > 0) {
            $sqlQuery = "Delete from einausgaben where ID = $einausgaben_id";
            $rs = $dbSyb->Execute($sqlQuery);

            if (!$rs) {
                $out['response']['status'] = -4;
                $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

                print json_encode($out);
                return;
            }
            $rs->Close();
        }

    }
}

$out['response']['status'] = 0;
$out['response']['errors'] = "";
$out['response']['data'] = $value;
print json_encode($out);

