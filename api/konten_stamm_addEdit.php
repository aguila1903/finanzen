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

if (isset($_REQUEST["kontonrNew"])) {
    $kontonrNew = $_REQUEST["kontonrNew"];
    if ($kontonrNew != "null" && $kontonrNew != "") {
        if (strlen($kontonrNew) > 50) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('kontonr' => "Kontonr. darf max. 50 Zeichen lang sein");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('kontonr' => "Kontonr. fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('kontonr' => "Kontonr. fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["kontonrOld"])) {
    $kontonrOld = $_REQUEST["kontonrOld"];
    if ($kontonrOld != "null" && $kontonrOld != "") {
        if (strlen($kontonrOld) > 50) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('kontonr' => "Kontonr. darf max. 50 Zeichen lang sein");
            print json_encode($out);
            return;
        }
    } else {
        $kontonrOld = "";
    }
} else {
    $kontonrOld = "";
}

if (isset($_REQUEST["bezeichnung"])) {
    $bezeichnung = $_REQUEST["bezeichnung"];
    if ($bezeichnung != "null" && $bezeichnung != "") {
        if (strlen($bezeichnung) > 50) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('bezeichnung' => "Bezeichnung darf max. 50 Zeichen lang sein");
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

if (isset($_REQUEST["kontotyp"])) {
    $kontotyp = $_REQUEST["kontotyp"];
    if ($kontotyp != "null" && $kontotyp != "") {
        if ((preg_match("/^[0-9]{1,2}?$/", trim($kontotyp))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('kontotyp' => "Bitte den Typ prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('kontotyp' => "Typ fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('kontotyp' => "Typ fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["action"])) {
    $action = $_REQUEST["action"];
    if ($action != "null" && $action != "") {
        if ((preg_match("/^[edita]{3,6}?$/", trim($action))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('action' => "Bitte Parameter action prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('action' => "Parameter action fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('action' => "Parameter action fehlt!");
    print json_encode($out);
    return;
}
$edit = "";
if($action == "add"){
    $proc = "kontoAdd";
}else{
    $proc = "kontoEdit";
    $edit =  ", " . $dbSyb->quote($kontonrOld);
}
$sqlQuery = "call $proc("
        . $dbSyb->quote($kontonrNew) .
        $edit .
        ", " . $dbSyb->quote($bezeichnung) .        
        ", " . $dbSyb->quote($kontotyp) .
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
