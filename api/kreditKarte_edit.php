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




if (isset($_REQUEST["karten_nr"])) {
    $karten_nr = strtoupper(($_REQUEST["karten_nr"]));
    if ($karten_nr != "NULL" && $karten_nr != "") {

        if ((preg_match("/^[0-9a-zA-Z-_ ]{1,50}?$/", trim($karten_nr))) == 0) {
            $out = array();

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('$karten_nr' => "Kartenkürzel prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('$karten_nr' => "Kartenkürzel prüfen");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('$karten_nr' => "Kartenkürzel fehlt!");

    print json_encode($out);
    return;
}


if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];

    if ((preg_match("/^[0-9]{6}?$/", trim($monat))) == 0) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('monat' => "Bitte den Monat prüfen!");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('monat' => "Erforderlicher Parameter Monat fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["datum"])) {
    $datum = $_REQUEST["datum"];
} else {
    $datum = "";
}


if (isset($_REQUEST["betrag"])) {
    $betrag = str_replace('.', '', $_REQUEST["betrag"]);
} else {
    $betrag = "";
}

if (isset($_REQUEST["zahlung"])) {
    $zahlung = str_replace('.', '', $_REQUEST["zahlung"]);
} else {
    $zahlung = "";
}

if (isset($_REQUEST["ID"])) {
    $id = $_REQUEST["ID"];

    if ((preg_match("/^[0-9]{1,10}?$/", trim($id))) == 0) {
        $out = array();

        $out['response']['status'] = -4;
        $out['response']['errors'] = array('ID' => "ID prüfen");

        print json_encode($out);
        return;
    }
} else {
    $out = array();

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('ID' => "Erforderlicher Parameter ID fehlt!");

    print json_encode($out);
    return;
}

if (isset($_REQUEST["mind_zahlung"])) {
    $mind_zahlung = str_replace('.', '', $_REQUEST["mind_zahlung"]);
} else {
    $mind_zahlung = "null";
}

$querySQL = "call kreditKartenEdit ("
        . $dbSyb->Quote($karten_nr)
        . "," . str_replace(',', '.', $betrag)
        . "," . $dbSyb->Quote($monat)
        . ", " . $dbSyb->Quote($datum)
        . "," . $id
        . "," . str_replace(',', '.', $zahlung);
if ($mind_zahlung == "null") {
    $querySQL .= ", NULL);";
} else {
    $querySQL .= "," . str_replace(',', '.', $mind_zahlung) . ");";
}

file_put_contents("kreditKartenEdit.txt", $querySQL);
$rs = $dbSyb->Execute($querySQL);

if (!$rs) {

    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('karten_name' => ($dbSyb->ErrorMsg()));

    print json_encode($out);
    return;
}

if (isset($rs->fields['Ergebnis'])) {
    $Ergebnis = $rs->fields['Ergebnis'];
} else {
    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('karten_name' => "Kein Ergebnis erhalten!");

    print json_encode($out);
    return;
}

if ($Ergebnis > 0) {
    $data["Ergebnis"] = 'erfolgreich bearbeitet';

    $rs->Close();
    $out = array();

    // zentrale Anwortfunktion fï¿½r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;

    print json_encode($out);
} else {
    $out = array();

    $out['response']['data'] = $data;
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('karten_name' => "Fehler beim Update!");

    print json_encode($out);
    return;
}
?>