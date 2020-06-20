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
    vorgang,
     (case when TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) >= dauer then dauer when TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),CURDATE()) < 0 then 0 else TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) end) * betrag as betrag_gezahlt,
    ((case when TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) >= dauer then dauer when TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),CURDATE()) < 0 then 0 else TIMESTAMPDIFF(month,ADDDATE(datum, INTERVAL -1 month),curdate()) end) * betrag) -
    (dauer * betrag) AS rest_betrag
FROM
    einausgaben a
WHERE
    typ = 'F' AND detail = 'J'
        $where;";


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
        $data[$i]["vorgang"] = $rs->fields['vorgang'];
        $data[$i]["betrag_gezahlt"] = ($rs->fields['betrag_gezahlt'] < 0) ? $rs->fields['betrag_gezahlt'] * (-1) : $rs->fields['betrag_gezahlt'];
        $data[$i]["rest_betrag"] = ($rs->fields['rest_betrag'] < 0) ? $rs->fields['rest_betrag'] * (-1) : $rs->fields['rest_betrag'];
        $i++;

        $rs->MoveNext();
    }
    $out = [];
    $rs->Close();
    $out['response']['data'] = $data;
    print json_encode($out);
}
?>