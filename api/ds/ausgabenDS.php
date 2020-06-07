<?php

session_start();

require_once('adodb5/adodb.inc.php');
require_once('conf.php');


$ADODB_CACHE_DIR = 'C:/finanzen/tmp';


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

if (isset($_REQUEST["currentMonth"])) {
    $currentMonth = $_REQUEST["currentMonth"];
} else {
    $currentMonth = "";
}

if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];
} else {
    $monat = "";
}

if (isset($_REQUEST["giroSpar"])) {
    $giroSpar = $_REQUEST["giroSpar"];
} else {
    $giroSpar = "0";
}


$querySQL = " call ausgabenDS (" . $dbSyb->Quote(substr($monat, 0, 2)) . ", " . $dbSyb->Quote(substr($monat, 2, 4)) . ", " . $dbSyb->Quote($giroSpar) . ");";
// file_put_contents("ausgabenDS.txt", $querySQL);
//  }else{
//      $querySQL = " call ausgabenDS2 " .$dbSyb->Quote(substr($monat, 0, 2)).", ".$dbSyb->Quote(substr($monat, 2, 4));
//  }
//    file_put_contents("ausgabenDS.txt", $querySQL);


/* @var $rs string */
$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren

$data = array();

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
        $data[$i]["monat"] = $rs->fields['Monat'];
        $data[$i]["ausgabe"] = number_format($rs->fields['Ausgabe'], 2, ',', '.');
        $data[$i]["einnahme"] = number_format($rs->fields['Einnahme'], 2, ',', '.');
        $data[$i]["differenz"] = number_format($rs->fields['Differenz'], 2, ',', '.');

        if ($rs->fields['Differenz'] > 0) {

            $id = 0; // Einnahme
            $data[$i]["_hilite"] = $id;
        } elseif ($rs->fields['Differenz'] < 0) {

            $id = 1; // Ausgabe
            $data[$i]["_hilite"] = $id;
        }

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