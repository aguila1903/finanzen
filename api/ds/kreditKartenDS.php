<?php

session_start();
include 'wechselkursHist.php';
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


if (isset($_REQUEST["monat"])) {
    $_monat = $_REQUEST["monat"];
} else {
    $_monat = date("mY");
}

// String mit DB-Abfrage f�r den Rest


$querySQL = " call kreditKartenAbrDS (" . $dbSyb->Quote($_monat) . ");";
//$querySQL = " call kreditKartenAbrDS (" . $dbSyb->Quote('052020') . ");";



$rs = $dbSyb->Execute($querySQL); 



if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;
    $differenz = 0;

    while (!$rs->EOF) {
        $zahlung = floatval($rs->fields["zahlung"]);
        $mind_zahlung = floatval($rs->fields["mind_zahlung"]);
        $data[$i]["ID"] = $rs->fields["ID"];
        $data[$i]["datum2"] = str_replace('.', '-', $rs->fields["datum2"]);
        $data[$i]["karten_nr"] = ($rs->fields["karten_nr"]);
        $data[$i]["bezeichnung"] = ($rs->fields["bezeichnung"]);
        $wechselkurs = getHistEx($data[$i]["datum2"]);
        $data[$i]["betrag"] = number_format($rs->fields["betrag"], 2, ',', '.') . " (" . number_format($rs->fields["betrag"] / $wechselkurs, 2, ',', '.') . ")";
        $data[$i]["zahlung"] = number_format($zahlung, 2, ',', '.') . " (" . number_format($zahlung / $wechselkurs, 2, ',', '.') . ")";
        $data[$i]["vor_monat"] = number_format($rs->fields["vor_monat"], 2, ',', '.') . " (" . number_format($rs->fields["vor_monat"] / $wechselkurs, 2, ',', '.') . ")";
        $data[$i]["betrag_"] = $rs->fields["betrag"];
        $differenz = $rs->fields["vor_monat"] - $rs->fields["betrag"];
        $data[$i]["differenz"] = number_format($differenz, 2, ',', '.') . " (" . number_format($differenz / $wechselkurs, 2, ',', '.') . ")";
        $data[$i]["differenz_noNumber"] = $differenz;
        $data[$i]["vor_monat_"] = $rs->fields["vor_monat"];
        $data[$i]["datum"] = $rs->fields["datum"];
        $data[$i]["mind_zahlung"] = number_format($mind_zahlung, 2, ',', '.') . " (" . number_format($mind_zahlung / $wechselkurs, 2, ',', '.') . ")";
        $data[$i]["monat"] = $rs->fields["Monat"];
        $data[$i]["pdf"] = ($rs->fields["pdf"]);

        if (($rs->fields["karten_nr"]) == "ASYA") {
            $data[$i]["color"] = "#16ADC7";
            $data[$i]["_hilite"] = 0;
        } elseif (($rs->fields["karten_nr"]) == "AXCE") {
            $data[$i]["color"] = "#FF7256";
            $data[$i]["_hilite"] = 1;
        } elseif (($rs->fields["karten_nr"]) == "BONU") {
            $data[$i]["color"] = "#90EE90";
            $data[$i]["_hilite"] = 2;
        } elseif (($rs->fields["karten_nr"]) == "CAFI") {
            $data[$i]["color"] = "#B8860B";
            $data[$i]["_hilite"] = 3;
        } elseif (($rs->fields["karten_nr"]) == "YPWO") {
            $data[$i]["color"] = "#8A2BE2";
            $data[$i]["_hilite"] = 4;
        } elseif (($rs->fields["karten_nr"]) == "CITI") {
            $data[$i]["color"] = "#5CADD6";
            $data[$i]["_hilite"] = 5;
        }
        $i++;

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    $out = array();

    // zentrale Anwortfunktion f�r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out["response"]["status"] = 0;
    $out["response"]["errors"] = array();
    $out["response"]["data"] = $data;

    die(json_encode($out));
}
?>