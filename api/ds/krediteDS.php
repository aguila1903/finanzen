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


if (isset($_REQUEST["auswahl"])) {
    $ausw = $_REQUEST["auswahl"];
} else {
    $ausw = "A";
}

if ($ausw == "A") {
    $where = " AND DATE_FORMAT(curdate(),\"%Y%m%d\") <= DATE_FORMAT(enddatum,\"%Y%m%d\") ";
} else {
    $where = "";
}

$querySQL = " SELECT 
    e.ID,    
    vorgang, 
    betrag, 
    datum,
    enddatum,
    betrag * dauer AS gesamt_betrag,
    -- TIMESTAMPDIFF(MONTH, datum, last_day(enddatum)) AS max_rate, 
    dauer AS max_rate, 
    case when TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) >= dauer then dauer else TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) end as rate, 
    (case when TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) >= dauer then dauer else TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) end) * betrag as betrag_gezahlt, 
    kommentar, 
    e.kategorie_id, 
    k.bezeichnung AS kategorie,
    e.herkunft,
    e.art,
    dokument,
    concat(monthname(ADDDATE(ADDDATE(datum, INTERVAL dauer month),INTERVAL -1 day)),' ',year(ADDDATE(ADDDATE(datum,INTERVAL dauer month),INTERVAL -1 day))) as letzte_zahlung,
    CASE 
	WHEN 
            ((betrag* TIMESTAMPDIFF(MONTH, datum, enddatum))) - (betrag * TIMESTAMPDIFF(MONTH,
            ADDDATE(datum, INTERVAL - 1 MONTH),
            CURDATE())) > 0
        THEN 
            0
        ELSE 
            ((betrag* TIMESTAMPDIFF(MONTH, datum, enddatum))) - (betrag * TIMESTAMPDIFF(MONTH,
            ADDDATE(datum, INTERVAL - 1 MONTH),
            CURDATE()))
    END as rest_betrag
  FROM einausgaben e JOIN kategorien k ON e.kategorie_id=k.ID 
  WHERE e.typ = 'F' AND ifnull(detail,'N') = 'J'
  $where
  ;";


$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?

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
        $betrag = $rs->fields['betrag'];
        $rate_rest = intval($rs->fields['max_rate']) - intval($rs->fields['rate']);
        $data[$i]["ID"] = $rs->fields['ID'];
        $data[$i]["vorgang"] = $rs->fields['vorgang'];
        $data[$i]["rate"] = $rs->fields['rate'];
        $data[$i]["max_rate"] = $rs->fields['max_rate'];
        $data[$i]["kategorie_id"] = $rs->fields['kategorie_id'];
        $data[$i]["kategorie"] = $rs->fields['kategorie'];
        $data[$i]["rate_min_max"] = $rs->fields['rate'] . "/" . $rs->fields['max_rate'];
        $data[$i]["rate_rest"] = $rate_rest;
        $data[$i]["kommentar"] = $rs->fields['kommentar'];
        $data[$i]["herkunft"] = $rs->fields['herkunft'];
        $data[$i]["datum"] = $rs->fields['datum'];
        $data[$i]["enddatum"] = $rs->fields['enddatum'];
        $data[$i]["document"] = $rs->fields['dokument'];
        $data[$i]["letzte_zahlung"] = $rs->fields['letzte_zahlung'];
        $data[$i]["betrag"] = number_format($betrag * (-1), 2, ',', '.');
        $data[$i]["betrag_gezahlt"] = number_format($rs->fields['betrag_gezahlt'] * (-1), 2, ',', '.');
        $data[$i]["gesamt_betrag"] = number_format($rs->fields['gesamt_betrag'] * (-1), 2, ',', '.');
        $data[$i]["rest_betrag"] = number_format(($rs->fields['gesamt_betrag'] - $rs->fields['betrag_gezahlt']) * (-1), 2, ',', '.');
        $i++;

        $rs->MoveNext();
    }

    $rs->Close();

    print json_encode($data);
}
?>