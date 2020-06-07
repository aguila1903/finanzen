<?php

session_start();
//include 'wechselkursLive.php';
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

$aKonto = [];

if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];
    if ($monat != "null" && $monat != "") {
        if ((preg_match("/^[0-9]{1,2}?$/", trim($monat))) == 0) {

            $monat = "";
        }
    } else {
        $monat = "";
    }
} else {
    $monat = "";
}

if (isset($_REQUEST["proc"])) {
    $proc = $_REQUEST["proc"];
} else {
    $proc = "einJahresPrognose";
}

if (isset($_REQUEST["konto"])) {
    $konto = $_REQUEST["konto"];
    if ($konto != "") {
        $aKonto = explode(",", $konto);
    }
}

//$querySQL = " call einJahresPrognose (".getLiveEx().")";
$querySQL = " call $proc ($monat)";



$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?

$data = array();

if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt

$i = 0;


$dataAusgabe = [];

while (!$rs->EOF) {
    if (in_array($rs->fields["kontonr"], $aKonto)) {
        $dataAusgabe[$i]["monat"] = ($rs->fields["monat"]);
        $dataAusgabe[$i]["vorgang"] = ($rs->fields["vorgang"]);
        $dataAusgabe[$i]["art"] = $rs->fields["art"];
        $dataAusgabe[$i]["betrag"] = $rs->fields["betrag"];
        $dataAusgabe[$i]["kategorie"] = $rs->fields["kategorie"];
        $dataAusgabe[$i]["kontotyp"] = $rs->fields["kontotyp"];
        $dataAusgabe[$i]["kontotyp_bez"] = $rs->fields["kontotyp_bez"];
        if ($rs->fields['betrag'] > 0) {
            $id = 0; // Einnahme
            $dataAusgabe[$i]["_hilite"] = $id;
        } elseif ($rs->fields['betrag'] < 0) {
            $id = 1; // Ausgabe
            $dataAusgabe[$i]["_hilite"] = $id;
        }
        $i++;
    }
    // den n�chsten Datensatz lesen
    $rs->MoveNext();
}

$rs->Close();

print json_encode($dataAusgabe);
?>