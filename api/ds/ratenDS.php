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

        if ((preg_match("/^[0-9a-zA-Z]{1,50}?$/", trim($karten_nr))) == 0) {
            $out = array();

            $out["response"]["status"] = -4;
            $out["response"]["errors"] = array('karten_nr' => "Kartenkürzel prüfen");

            print json_encode($out);
            return;
        } else {
            if ($karten_nr == "ALL") {
                $WhereKarte = "";
            } else {
                $WhereKarte = " and a.karten_nr = " . $dbSyb->Quote($karten_nr);
            }
        }
    } else {
        $WhereKarte = "";
    }
} else {
    $WhereKarte = "";
}

// String mit DB-Abfrage f�r den Rest

if (isset($_REQUEST["typ"])) {
    $typ = $_REQUEST["typ"];
    if ($typ != "NULL" && $typ != "") {

        if ((preg_match("/^[EAae]{1}?$/", trim($typ))) == 0) {
            $out = array();

            $out["response"]["status"] = -4;
            $out["response"]["errors"] = array('typ' => "Bitt den Status prüfen");

            print json_encode($out);
            return;
        } else {
            $WhereStatus = " and status = " . $dbSyb->Quote($typ);
        }
    } else {
        $WhereStatus = "";
    }
    $WhereStatus = " and status = " . $dbSyb->Quote($typ);
} else {
    $WhereStatus = "";
}



$querySQL = "Select distinct a.ID, 
a.karten_nr, 
b.bezeichnung, 
upper(a.vorgang) as vorgang,
a.rate, 
a.max_rate, 
concat(a.rate,'/',a.max_rate) as rate_min_max,
 a.betrag, 
 a.monat,
 a.betrag*a.rate as betrag_gezahlt,
 (a.betrag*a.max_rate)-(a.betrag*a.rate) as rest_betrag,
 a.betrag*a.max_rate as gesamt_betrag,
 a.status,
 IFNULL(rtrim(a.comment),'-') as comment,
 a.max_rate-a.rate as rate_rest,
 date_format(a.datum,\"%d.%m.%y\") as datum,
 (Select date_format(datum,\"%d.%m.%y\") from kreditkarten_abr where monat = a.monat and karten_nr = a.karten_nr) as datum_abrechnung
From kk_raten a, zahlungsmittel b
Where a.karten_nr = b.karten_nr
" . $WhereStatus . $WhereKarte
        . " Order by b.bezeichnung, "
        . " date_format(a.datum,\"%Y%m%d\"),"
        . "  CONCAT(SUBSTR(monat, 3, 4),SUBSTR(monat, 1, 2));";




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
        $data[$i]["ID"] = $rs->fields["ID"];
        $data[$i]["karten_nr"] = ($rs->fields["karten_nr"]);
        $data[$i]["bezeichnung"] = ($rs->fields["bezeichnung"]);
//        $data[$i]["betrag"] = number_format($rs->fields["betrag"], 2, ',', '.');
        $data[$i]["betrag"] = number_format($rs->fields["betrag"], 2, '.', '');
        $data[$i]["vorgang"] = ($rs->fields["vorgang"]);
        $data[$i]["rate"] = $rs->fields["rate"];
        $data[$i]["max_rate"] = $rs->fields["max_rate"];
        $data[$i]["rate_min_max"] = $rs->fields["rate_min_max"];
        $data[$i]["rate_rest"] = (int) $rs->fields["rate_rest"];
        //  $data[$i]["betrag_gezahlt"] = number_format($rs->fields["betrag_gezahlt"], 2, ',', '.');
        $data[$i]["betrag_gezahlt"] = number_format($rs->fields["betrag_gezahlt"], 2, '.', '');
        $data[$i]["rest_betrag"] = number_format($rs->fields["rest_betrag"], 2, '.', '');
        //   $data[$i]["gesamt_betrag"] = number_format($rs->fields["gesamt_betrag"], 2, ',', '.');
        $data[$i]["gesamt_betrag"] = number_format($rs->fields["gesamt_betrag"], 2, '.', '');
        $data[$i]["comment"] = ($rs->fields["comment"]);
        $data[$i]["monat"] = $rs->fields["monat"];
        $data[$i]["status"] = $rs->fields["status"];
        $data[$i]["datum"] = $rs->fields["datum"];
        $data[$i]["datum_abrechnung_karte"] = ($rs->fields["bezeichnung"]) . " - " . $rs->fields["datum_abrechnung"];


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

    print json_encode($out);
}
?>