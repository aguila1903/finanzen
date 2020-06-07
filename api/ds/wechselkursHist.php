<?php

require_once('adodb5/adodb.inc.php');
require_once('conf.php');

function getDB() {


    $ADODB_CACHE_DIR = 'C:/php/cache';


    $ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 

    $ADODB_COUNTRECS = true;

    $dbSyb = ADONewConnection("mysqli");

// DB-Abfragen NICHT cachen
    $dbSyb->memCache = false;

    $dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB


    $out = array();

    if (!$dbSyb->IsConnected()) {

        $out['response']['status'] = -1;
        $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

        print json_encode($out);

        return;
    }

    $dbSyb->debug = false;

    return $dbSyb;
}

// $datum = date('Y-m-d');

function getHistEx($date) {
    $dbSyb = getDB();

    $querySQL = " select kurs from wechselkurse where datum = " . $dbSyb->Quote($date) . ";";

    $rs = $dbSyb->Execute($querySQL);


    $data = array();

    if (!$rs) {
        print("Query 1: " . $dbSyb->ErrorMsg());
        return($data);
    }

    if (empty($rs->fields['kurs'])) {
        $kurs = getExOnline($date);

        $querySQL_2 = " Insert into wechselkurse values(" . $dbSyb->Quote($date) . "," . $kurs . ",'TRY');";
        $rs2 = $dbSyb->Execute($querySQL_2);
        if (!$rs2) {

            print("Insert Wechselkurse: " . $dbSyb->ErrorMsg());

            return($data);
        }
        $rs->Close();
    } else {
        $kurs = $rs->fields['kurs'];
    }
    $rs->Close();

    return $kurs;
}

function getExOnline($date) {
    $convert = 0;
    $endpoint = 'historical';
    $access_key = CURRENCY_API_KEY;
    $currencies = 'EUR,TRY';

    $ch = curl_init('http://apilayer.net/api/' . $endpoint . '?access_key=' . $access_key . '&date=' . $date . '&currencies=' . $currencies . '');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $json = curl_exec($ch);
    curl_close($ch);

    $exchangeRates = json_decode($json, true);
//    file_put_contents("wechselkursHist.txt", print_r($exchangeRates, true));

    if (!empty($exchangeRates['success'])) {
        $euro = $exchangeRates['quotes']['USDEUR'];
        $lira = $exchangeRates['quotes']['USDTRY'];

        $convert = $lira / $euro;
    }
    return $convert;
}

?>