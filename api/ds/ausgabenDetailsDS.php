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


if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];
} else {
    $monat = "";
}
if (isset($_REQUEST["giroSpar"])) {
    $giroSpar = $_REQUEST["giroSpar"];
} else {
    $giroSpar = "G";
}

$querySQL = " call ausgabenDetailsDS (" . $dbSyb->Quote($monat) . ", " . $dbSyb->Quote($giroSpar) . ");";
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
//        if ($giroSpar != 'G' && substr($rs->fields['vorgang'], 0, 12) == 'Anfangssaldo') {
//            $data[$i]["betrag"] = 0.00;
//        } else {
//            $data[$i]["betrag"] = number_format($rs->fields['betrag'],2,",",".");
        $data[$i]["betrag"] = number_format($rs->fields['betrag'], 2, ",", ".");
//        }
        $data[$i]["ID"] = $rs->fields['ID'];
//        $datum = explode(".", $rs->fields['datum']);        
//        $data[$i]["datum"] = $datum[2]."-".$datum[1]."-".$datum[0];
        $data[$i]["datum"] = str_replace(' ', 'T', $rs->fields['datum']) . "+02:00";
//        $data[$i]["betrag"] = number_format($rs->fields['betrag'], 2, ',', '.');     
        $data[$i]["vorgang"] = ($rs->fields['vorgang']);
        $data[$i]["herkunft"] = ($rs->fields['herkunft']);
        $data[$i]["buchtext"] = ($rs->fields['buchungstext']);
        $data[$i]["kontonr"] = ($rs->fields['kontonr']);
        $data[$i]["einausgaben_id"] = ($rs->fields['einausgaben_id']);
//        $data[$i]["extern"] = ($rs->fields['extern']);  

        if ($rs->fields['betrag'] > 0) {
            $id = 0; // Einnahme
            $data[$i]["_hilite"] = $id;
        } elseif ($rs->fields['betrag'] < 0) {
            $id = 1;  // Ausgabe
            $data[$i]["_hilite"] = $id;
        }
        if (intval($data[$i]["einausgaben_id"]) > 0) {
            $data[$i]["ref"] = "tick";
        } else {
            if (intval($data[$i]["einausgaben_id"]) == -99) { // Fixkosten
                $data[$i]["ref"] = "thumb_up";
            } elseif (intval($data[$i]["einausgaben_id"]) == -999) { // Wird nicht kategorisiert
                $data[$i]["ref"] = "exclamation";
            } elseif (intval($data[$i]["einausgaben_id"]) == -9999) { // Unbekannt, muss noch geprüft werden
                $data[$i]["ref"] = "question";
            } else {
                $data[$i]["ref"] = "error";
            }
        }

        $i++;

        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    $out = array();

    // zentrale Anwortfunktion f�r REST-Datenquellen
    // im Kern nicht anderes als print json_encode($value)
//    $out['response']['status'] = 0;
//    $out['response']['errors'] = array();
//    $out['response']['data'] = $data;

    print json_encode($data);
}
?>