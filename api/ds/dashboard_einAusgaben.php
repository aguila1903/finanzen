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


$out = [];
$data = [];

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;


if (isset($_GET['art'])) {
    $art = $_GET['art'];
} else {
    $art = 'A';
}

$querySQL = "SELECT 
-- Fixkosten
IFNULL((SELECT SUM(ifnull(betrag,0)) + IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben  
WHERE art = '$art' AND date_format(datum, \"%Y%m\") = DATE_FORMAT(a.datum,\"%Y%m\") AND typ = 'F'),0)
FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
WHERE art = '$art'  AND DATE_FORMAT(d.datum, \"%Y%m\") = DATE_FORMAT(a.datum,\"%Y%m\") And DATE_FORMAT(d.datum, \"%Y%m%d\") <= DATE_FORMAT(CURDATE(),\"%Y%m%d\") 
),0)  AS fix,
-- Variable Kosten
IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben e 
WHERE art = '$art' AND e.typ = 'V'  AND DATE_FORMAT(e.datum, \"%Y%m\") = DATE_FORMAT(a.datum,\"%Y%m\") And DATE_FORMAT(a.datum, \"%Y%m%d\") <= DATE_FORMAT(CURDATE(),\"%Y%m%d\") 
),0) AS variabel, 
-- Stand
date_format(a.datum, \"%Y%m\") AS stand

FROM einausgaben a 
Where DATE_FORMAT(a.datum,\"%Y%m%d\") between '20200101' AND DATE_FORMAT(CURDATE(),\"%Y%m%d\") 
GROUP BY DATE_FORMAT(a.datum,\"%Y%m\");";


$rs = $dbSyb->Execute($querySQL);


if (!$rs) {
    // keine Query hat nicht funtioniert

    print("Query 1: " . $dbSyb->ErrorMsg());

    return($data);
}
// das else MUSS nicht sein, da ein Fehler vorher Stoppt
else {

    $i = 0;
    while (!$rs->EOF) {
        $data[$i]['fix'] = ($art == 'A') ? $rs->fields['fix'] * (-1) : $rs->fields['fix'];
        $data[$i]['variabel'] = ($art == 'A') ? $rs->fields['variabel'] * (-1) : $rs->fields['variabel'];
        $data[$i]['stand'] = ($rs->fields['stand']);
        $i++;


        // den n�chsten Datensatz lesen
        $rs->MoveNext();
    }

    $rs->Close();


    $out['response']['status'] = 0;
    $out['response']['errors'] = array();
    $out['response']['data'] = $data;

    print json_encode($out);
}
?>