<?php
require_once('conf.php');

function deleteTmpFiles($outputfile, $extractFile) {
    if (is_file($outputfile . '.txt')) {
        unlink($outputfile . '.txt');
    }
    if (is_file($outputfile . '_raw.txt')) {
        unlink($outputfile . '_raw.txt');
    }
    if (is_file($extractFile)) {
        unlink($extractFile);
    }
}

function updateCreditCard($fullFileName, $dbSyb, $monat, $PDFtoolsPath) {
    date_default_timezone_set('europe/berlin');
    $logFileName = date('Y-m-d') . ".log";
    $data = array();
    $PDF2Text = $PDFtoolsPath . 'pdftotext.exe';
    $tmp = "tmp\\";
    $time = date("YmdHis");
    $outputfile = $tmp . "output_$time";
    if(!is_dir($outputfile)){
        mkdir($outputfile, 0775, true);
    }
    $extractFile = "$tmp\\doExtract_$time.cmd";
    $pos = array();
    $datePattern = '/^[0-9]{1}[0-9]{1}\/[0-9]{1}[0-9]{1}\/[0-9]{4}/';
    $hesapTarihPattern = '/[0-9]{1}[0-9]{1}\/[0-9]{1}[0-9]{1}\/[0-9]{4}/';
    $amountPattern =    '/[0-9,-]{1,7}[.]{1}[0-9]{2}/';
    $oedemePattern =    '/[0-9,]{1,7}[.]{1}[0-9]{2}/';
    $taksitPatternTmp = '/[0-9]{1,6}[.]{1}[0-9]{2}.*/';
    $taksitPattern = '/\b[ 1-9]{1,3}[\/]{1}[1-9]{1,3}\b/';
    $islemPattern = "/^[0-9]{1}[0-9]{1}\/[0-9]{1}[0-9]{1}\/[0-9]{4}.*[0-9]{1,6}[.]{1}[0-9]{2}/";
    $oedeme = 0;
    $asgari = 0;
    $hesapTarih = "";
    $doenemBorcu = 0;


//if (isset($argv[1])) {
//    $fullFileName = $argv[1];
//} else {
//    $errorMsg = 'Keine PDF übergeben!';
//    echo($errorMsg);
//    file_put_contents($tmp . date('Y-m-d') . ".log", "[ERROR]" . " " . date('d-m-Y H:i:s') . " -- " . "Datei: " . $errorMsg . "\r\n", FILE_APPEND);
//    return;
//}
//$fullFileName = "c:\\xampp\\htdocs\\finanzen\\api\\tools\\2019AralikEkstreniz.pdf";

    if (is_file($fullFileName) && is_file($PDF2Text)) {

        $cmdfile = '@echo off' . "\r\n";
        $cmdfile .= $PDF2Text . ' -q -raw -enc UTF-8 -eol unix -nopgbrk "' . $fullFileName . '" "' . $outputfile . '_raw.txt"' . "\r\n";
        $cmdfile .= "exit\r\n";
        file_put_contents($extractFile, $cmdfile);
        $cmd = "$extractFile >NUL 2>NUL";
        $output = exec($cmd);
    }

    $output = file_get_contents($outputfile . "_raw.txt");
    $zeilenArr = explode("\n", $output);
    $raw = array();
// Säubern von evtl. Leerzeilen
    foreach ($zeilenArr as $zeile) {
        if (trim($zeile) != "" && !preg_match("/^Bu alışverişinizin sipariş kodu:/", trim($zeile))) {
            $raw[] = trim($zeile);
        }
    }

file_put_contents("pos.txt", print_r($raw, true));
    $i = 0;
    for ($ii = 0; $ii < count($raw); $ii++) {

        if (preg_match($datePattern, trim($raw[$ii]))) {
            preg_match($datePattern, $raw[$ii], $date);
            $pos[$ii]["datum"] = $date[0];
            preg_match($amountPattern, $raw[$ii], $amount);
            $pos[$ii]["tutar"] = str_replace(",", "", $amount[0]);

            preg_match($taksitPatternTmp, $raw[$ii], $taksitTmp);
            if (preg_match($taksitPattern, $taksitTmp[0], $taksit)) {
                $pos[$ii]["taksit"] = $taksit[0];
            } else {
                $pos[$ii]["taksit"] = "1/1";
            }
            preg_match($islemPattern, $raw[$ii], $regsMk);
            $replDate = preg_replace($datePattern, "", $regsMk[0]);
            $replAmount = preg_replace($amountPattern, "", $replDate);
            $pos[$ii]["islem"] = trim($replAmount);

            $taksitArr = explode("/", $pos[$ii]['taksit']);
            if ($taksitArr[0] == "1" && !preg_match("/Ödeme - Tesekkür/", $pos[$ii]['islem'])) {
                $data[$i] = $pos[$ii];
                $i++;
            }
            if (preg_match("/Ödeme - Tesekkür/", $pos[$ii]['islem'])) {
                preg_match($oedemePattern, $raw[$ii], $oedemeArr);
                $oedeme = (is_array($oedemeArr) && !empty($oedemeArr[0])) ? str_replace(",", "", $oedemeArr[0])+ str_replace(",", "", $oedeme) : $oedeme;
            }
        }
        if (preg_match("/Hesap Kesim Tarihi/", $raw[$ii])) {
            preg_match($hesapTarihPattern, $raw[$ii], $hesapTarihArr);
            $hesapTarih = (is_array($hesapTarihArr) && !empty($hesapTarihArr[0])) ? str_replace("/", ".", $hesapTarihArr[0]) : $hesapTarih;
        }
        if (preg_match("/Asgari Ödeme Tutarı/", $raw[$ii])) {
            preg_match($amountPattern, $raw[$ii], $asgariArr);
            $asgari = (is_array($asgariArr) && !empty($asgariArr[0])) ? str_replace(",", "", $asgariArr[0]) : $asgari;
        }
        if (preg_match("/Dönem Borcu :/", $raw[$ii])) {
            preg_match($amountPattern, $raw[$ii], $doenemBorcuArr);
            $doenemBorcu = (is_array($doenemBorcuArr) && !empty($doenemBorcuArr[0])) ? str_replace(",", "", $doenemBorcuArr[0]) : $doenemBorcu;
        }
    }

    deleteTmpFiles($outputfile, $extractFile);
    $metadaten = array('oedeme' => str_replace(".", ",",$oedeme), 'asgari' => str_replace(".", ",",$asgari), 'doenemborcu' => str_replace(".", ",",$doenemBorcu), 'hesaptarih' => $hesapTarih);
//    file_put_contents("metaDaten.txt", "$oedeme, $asgari, $doenemBorcu, $hesapTarih");

    $ii = 0;
    $newRates = "";
    while ($ii < count($data)) {
        $zeile = $data[$ii];
        $time = date('H:i:s');
        file_put_contents($tmp . $logFileName, $time . " / " . implode(";", $zeile) . "\n", FILE_APPEND);

        if (count($zeile) == 4) {
            $vadeArr = explode("/", $zeile['taksit']);
            $vade = $vadeArr[0];
            $vadeMax = $vadeArr[1];
        } else {
            $vade = 1;
            $vadeMax = 1;
        }
        $datum = explode("/", $zeile['datum']);

        $querySQL = " insert into kk_raten (karten_nr, vorgang, rate, max_rate, betrag, monat, status, comment, datum) "
                . " values "
                . "("
                . $dbSyb->Quote("CAFI")
                . "," . $dbSyb->Quote(($zeile['islem'])) //islem    
                . "," . $vade
                . "," . $vadeMax
                . "," . $zeile['tutar']
                . "," . $dbSyb->Quote($monat); //monat  
        if ($vade == $vadeMax) {
            $querySQL .= "," . $dbSyb->Quote("E");
        } else {
            $querySQL .= "," . $dbSyb->Quote("A");
        }
        //status
        $querySQL .= ", NULL "   //comment
                . "," . $dbSyb->Quote($datum[2] . $datum[1] . $datum[0]) //islem tarihi
                . ")";

        file_put_contents($tmp . "query_$monat.sql", $time . " -" . $querySQL . "\n", FILE_APPEND);

        $rs = $dbSyb->Execute($querySQL);


        if (!$rs) {
            $result = 'Datenbank-Fehler aufgetregen</br>' . $dbSyb->ErrorMsg();
            print ($result);
            file_put_contents($tmp . $logFileName, $time . " / " . $result . "\n", FILE_APPEND);
            return;
        } else {
            $newRates .= $ii + 1 . ") " . $zeile['datum'] . ", " . $zeile['islem'] . ", " . $zeile['tutar'] . ", $vade/$vadeMax<br>";
        }
        $ii++;
    }
    $ergebnis['newrates'] = $newRates;
    $ergebnis['metadaten'] = $metadaten;
    
    return $ergebnis;
}
