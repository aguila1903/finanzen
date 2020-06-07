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


$data = array();

if (isset($_REQUEST["f"])) {
    $f = $_REQUEST["f"];
} else {
    $f = "";
}
if ($f != "prognosen") {
    $querySQL = " call kontenDS ();";
} else {
    $querySQL = " SELECT DISTINCT k.kontonr, k.bezeichnung, k.kontotyp, kt.bezeichnung AS typ_bez
FROM einausgaben e
JOIN konten k ON e.kontonr = k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp
Order by k.bezeichnung;";
}

/* @var $rs string */
$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren


if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;

    while (!$rs->EOF) {
        $data[$i]["ID"] = $i;
        $data[$i]["kontonr"] = $rs->fields['kontonr'];
        $data[$i]["bezeichnung"] = $rs->fields['bezeichnung'];
        $data[$i]["kontotyp"] = $rs->fields['kontotyp'];
        $data[$i]["typ_bez"] = $rs->fields['typ_bez'];
        $i++;

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    $out = array();

    // zentrale Anwortfunktion f�r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;

    print json_encode($out);
}
?>