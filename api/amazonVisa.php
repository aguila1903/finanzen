<?php
require_once('conf.php');
require_once('functions.php');

$db = connectAdoDB(DB_HOST, DB_USER, DB_PW, DB_NAME, 'mysqli');


function updateCreditCard($fullFileName, $db, $PDFtoolsPath)
{
    date_default_timezone_set('europe/berlin');
    $logFileName = date('Y-m-d') . ".log";
    $data = array();
    $PDF2Text = $PDFtoolsPath . 'pdftotext.exe';
    $tmp = "tmp\\";
    $time = date("YmdHis");
    $outputfile = $tmp . "output_$time";
//    if(!is_dir($outputfile)){
//        mkdir($outputfile, 0775, true);
//    }
    $extractFile = "$tmp\\doExtract_$time.cmd";
    $pos = array();
    $datePattern = '/^[0-9]{1}[0-9]{1}\.[0-9]{1}[0-9]{1}\.[0-9]{4}$/';
    $mainPattern = '/([0-9]{1}[0-9]{1}\.[0-9]{1}[0-9]{1}\.[0-9]{4})\W(.*)([0-9]{1}[0-9]{1}\.[0-9]{1}[0-9]{1}\.[0-9]{4})\W([0-9]{1,6}\,[0-9]{2})\W([+-]{1})/';
    $abrechDatum = "";

    // Hole Mapping-Kategorien
    $querySQL = "Select * from category_mapping";
    $catMaps = sqlQuery($querySQL, $db);

    // PDF to Text
    if (is_file($fullFileName) && is_file($PDF2Text)) {
        $cmdfile = '@echo off' . "\r\n";
        $cmdfile .= $PDF2Text . ' -q -raw -enc UTF-8 -eol unix -nopgbrk "' . $fullFileName . '" "' . $outputfile . '_raw.txt"' . "\r\n";
        $cmdfile .= "exit\r\n";
//        file_put_contents("test.txt", $cmdfile);
        file_put_contents($extractFile, $cmdfile);
        $cmd = "$extractFile >NUL 2>NUL";
        $output = exec($cmd);
    }

    $output = file_get_contents($outputfile . "_raw.txt");
    $zeilenArr = explode("\n", $output);
    $raw = [];
    $results = [];
    $found = [];
// Säubern von evtl. Leerzeilen

    // Zuweisung der Kategorien
    foreach ($zeilenArr as $zeile) {
        if (preg_match($datePattern, trim($zeile))) {
            $abrechDatum = trim($zeile);
            $results['abrech_datum'] = $abrechDatum;
        }
        if (preg_match($mainPattern, trim($zeile), $matches)) {
            foreach ($catMaps as $catMap) {
                $pattern = '/' . $catMap['KEY'] . '/i';
                if (isset($matches[2]) && preg_match($pattern, $matches[2])) {
                    $results['catID'] = $catMap['catID'];
                    $results['KEY'] = $catMap['KEY'];
                    $results['typ'] = $catMap['typ'];
                    $results['match'] = $matches[2];
                    $found = array_merge($results, $matches);
                    break;
                }
            }
            $raw[] = $found;
        }
    }


// Ordne alle nicht zuordbaren Paypal-Einkäufe PayPal zu
    for ($i = 0; $i < count($raw); $i++) {
        if (!isset($raw[$i]['match']) && preg_match("/paypal/i", $raw[$i][0])) {
            $raw[$i]['catID'] = 103;
            $raw[$i]['KEY'] = "PayPal";
            $raw[$i]['match'] = $raw[$i][0];
        }
    }
    deleteTmpFiles($outputfile, $extractFile);
    foreach ($raw as $key => $value) {
        $query = "INSERT INTO `amazon_visa` (`Umsatz`, `kaufdatum`,`buchdatum`,`abrechnung_datum`,`betrag`, `catID`, typ, `hash`) VALUES\n";
        $umsatz = $db->quote(trim($value[2]));
        $kaufdatum = $db->quote(date_german2mysql($value[1]));
        $buchatum = $db->quote(date_german2mysql($value[3]));
        $abrechdatum = $db->quote(date_german2mysql($value["abrech_datum"]));
        $amount_ = (trim($value[5]) == "-") ? trim($value[5]) . $value[4] : $value[4];
        $amount = amount_german2mysql($amount_);
        $hash = $db->quote(md5($umsatz.$kaufdatum.$buchatum.$abrechdatum.$amount));
        $catID = (isset($value['catID'])) ? $value['catID'] : 0;
        $typ = (isset($value['typ'])) ? $db->quote($value['typ']) : $db->quote('V');
        $query .= "($umsatz, $kaufdatum, $buchatum, $abrechdatum, $amount, $catID, $typ, $hash);";
        $cnt = sqlQuery("Select count(*) as ANZ from amazon_visa where hash = $hash", $db);
        if($cnt[0]['ANZ'] == 0){
            $rs = $db->Execute($query);

            if (!$rs) {
                $out['response']['status'] = -4;
                $out['response']['errors'] = array('error' => $db->ErrorMsg());

                print json_encode($out);
                return;
            }
        }
    }


//    file_put_contents("pos.txt", $query, FILE_APPEND);

}

$abrechnung = __DIR__ . "\\tools\\Kartenabrechnung_01052023_317.pdf";
updateCreditCard($abrechnung, $db, PATH_PDFTools);