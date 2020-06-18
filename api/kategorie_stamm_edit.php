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

if (isset($_REQUEST["bezeichnung"])) {
    $bezeichnung = $_REQUEST["bezeichnung"];
    if ($bezeichnung != "null" && $bezeichnung != "") {
        if (strlen($bezeichnung) > 450) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('bezeichnung' => "Bezeichnung darf max. 450 Zeichen lang sein");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('bezeichnung' => "Bezeichnung fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('bezeichnung' => "Bezeichnung fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["typ"])) {
    $typ = $_REQUEST["typ"];
    if ($typ != "null" && $typ != "") {
        if ((preg_match("/^[fvFV]{1}?$/", trim($typ))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('typ' => "Bitte den Typ prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('typ' => "Typ fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('typ' => "Typ fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["art"])) {
    $art = $_REQUEST["art"];
    if ($art != "null" && $art != "") {
        if ((preg_match("/^[eaAEN]{1}?$/", trim($art))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('art' => "Bitte die Art prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('art' => "Art fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('art' => "Art fehlt!");
    print json_encode($out);
    return;
}

$sqlQuery = "call kategorieEdit("
        . $dbSyb->quote($ID) .
        ", " .  $dbSyb->quote($bezeichnung) .
        ", " . $dbSyb->quote($typ) .
        ", " . $dbSyb->quote($art) .
        ");";

//file_put_contents("query.txt", $sqlQuery);
$rs = $dbSyb->Execute($sqlQuery);

$value = array();

if (!$rs) {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('bezeichnung' => $dbSyb->ErrorMsg());

    print json_encode($out);
    return;
}

If (isset($rs->fields['Ergebnis'])) {
    if ($rs->fields['Ergebnis'] == 1) {
        $i = 0;

        while (!$rs->EOF) {
            $value["ergebnis"] = $rs->fields['Ergebnis'];
            $i++;
            $rs->MoveNext();
        }

        $rs->Close();

        $out['response']['status'] = 0;
        $out['response']['errors'] = array();
        $out['response']['data'] = $value;

        print json_encode($out);
    } else if ($rs->fields['Ergebnis'] == 0) {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('bezeichnung' => "Es wurden keine Änderungen vorgenommen. Entweder gab es keine Änderungen oder es ist ein Fehler aufgetreten. </br>" . $dbSyb->ErrorMsg());

        print json_encode($out);
        return;
    } else {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('bezeichnung' => "Update konnte nicht durchgeführt werden. </br>" . $dbSyb->ErrorMsg());

        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('bezeichnung' => "Keine Ergebnis-Rückmeldung erhalten </br>" . $dbSyb->ErrorMsg());

    print json_encode($out);
    return;
}
?>
