<?php

session_start();
require_once('adodb5/adodb.inc.php');
require_once('conf.php');
require_once('functions.php');


$ADODB_CACHE_DIR = 'C:/php/cache';
$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 
$ADODB_COUNTRECS = true;
$db = ADONewConnection('mysqli');
$db->memCache = false;


$db->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

if (!$db->IsConnected()) {
    $result = json_encode('Error: Datenbank-Verbindung konnte nicht hergestellt werden!');
    print ($result);
    return;
}


$db->debug = false;

$ergebnis = 0;
$data = [];
$value = [];

if (isset($_FILES['file'])) {

    $name_array = $_FILES['file']['name'];
    $tmp_name_array = $_FILES['file']['tmp_name'];
    $type_array = $_FILES['file']['type'];
    $size_array = $_FILES['file']['size'];
    $error_array = $_FILES['file']['error'];

    if (preg_match("/csv/i", $name_array) != 1) {
        print json_encode("Error: Datei ist keine CSV-Datei");
        return;
    }

    if ($error_array > 0) {
        $fehlerText = "unbekannt";
        if ($error_array == 1) {
            $fehlerText = "Fehler 1 (" . $size_array . ")";
        }
        if ($error_array == 2) {
            $fehlerText = "Fehler 2(" . $size_array . ")";
        }
        if ($error_array == 3) {
            $fehlerText = "die Datei wurde nur teilweise übertragen";
        }
        if ($error_array == 4) {
            $fehlerText = "es wurde keine Datei übertragen";
        }
        print ("Error: " . $fehlerText);
        return;
    }
} else {
    if (isset($_REQUEST['fileName'])) {
        $fileName = $_REQUEST['fileName'];
    } else {
        $result = json_encode('Error: Es wurde keine Datei hochgeladen');
        print $result;
        exit();
    }

//    $fileName = "createUsers.csv";
}
if (defined("PATH_CSV")) {
    $path = PATH_CSV;
} else {
    $result = json_encode('Error: CSV-Pfad nicht definiert');
    print $result;
    exit();
}


$path2 = str_replace("/", "\\", $path . "umsaetze/");

if (is_dir($path2) != 1) {
    mkdir($path2, 0775, true);
}

$fileName = basename(($_FILES['file']['name']));
$result = json_encode("Datei beinhaltet keine Daten zum auswerten.");

if (move_uploaded_file(($tmp_name_array), $path2 . $fileName)) {


    // Hole Mapping-Kategorien
    $querySQL = "Select * from category_mapping";
    $catMaps = sqlQuery($querySQL, $db);

    $file = file_get_contents($path2 . $fileName, true);

    $file_repl = str_replace(array('\r', '"'), "", $file);

    $split = explode("\n", $file_repl);
    $uplStatus = "";
    $ii = 1;
    $umsatzID = 0;
    $tableStart = "<table>";
    $tableEnd = "</table>";
    $tableBody = "";
    $tableHeader = "<tr><th>Nr.</th><th>Hinzugefügte Einträge</th><th>Nicht hinzugefügte Einträge (doppelt)</th></tr>";
    $count = count($split) - 1;
    while ($ii <= $count) {

        $zeile = $split[$ii];
        if (!empty($zeile)) {
            $spalte = explode(";", $zeile);
            $hash = md5($zeile);
            if ($spalte[16] == "Umsatz gebucht") {  // Info
                $betrag = str_replace(",", ".", str_replace(".", "", $spalte[14]));

                $datum = $spalte[1];
                $dat = explode(".", $datum);

                #-[KATEGORIE ZUORDNUNG]-----------------------[START]

                $results = [];
                foreach ($catMaps as $catMap) {
                    $pattern = '/' . $catMap['KEY'] . '/i';
                    if (isset($spalte[11]) && preg_match($pattern, utf8_encode($spalte[4]) . " " . $spalte[11])) {
                        $results['catID'] = $catMap['catID'];
                        $results['KEY'] = $catMap['KEY'];
                        $results['typ'] = $catMap['typ'];
                        $results['match'] = utf8_encode($spalte[4]) . " " . $spalte[11];
                        break;
                    }
                }

                // Ordne alle nicht zuordbaren Paypal-Einkäufe PayPal zu

                if (empty($results) && preg_match("/PayPal/i", utf8_encode($spalte[4]) . " " . $spalte[11])) {
                    $results['catID'] = 103;
                    $results['KEY'] = "PayPal";
                    $results['typ'] = "V";
                    $results['match'] = utf8_encode($spalte[4]) . " " . $spalte[11];
                }

                if (empty($results) && preg_match("/BARGELDAUSZAHLUNG/i", utf8_encode($spalte[3]))) {
                    $results['catID'] = 45;
                    $results['KEY'] = "BARGELDAUSZAHLUNG";
                    $results['typ'] = "V";
                    $results['match'] = utf8_encode($spalte[3]);
                }

                if (empty($results)) {
//                    file_put_contents("noResults.txt", utf8_encode($spalte[4]) . " " . $spalte[11] . " $betrag\n", FILE_APPEND);
                }

//                file_put_contents("category.txt", print_r($results, true) . "\n", FILE_APPEND);

                #-[KATEGORIE ZUORDNUNG]-----------------------[ENDE]

                $einausgaben_id = '';
                $querySQL = "call ausgabenADD ("
                    . $db->Quote(utf8_encode($spalte[4])) //Verwendungszweck
                    . ", " . str_replace(",", ".", $betrag) // Betrag
                    . ", " . $db->Quote($dat[2] . "-" . $dat[1] . "-" . $dat[0]) //Buchungstag
                    . ", " . $db->Quote($fileName)
                    . ", " . $db->Quote(utf8_encode($spalte[3])) // Buchtext
                    . ", " . $db->Quote($spalte[11]) // Beguenstigter/Zahlungspflichtiger
                    . ", " . $db->Quote($hash)
                    . ", " . $db->Quote($spalte[0]) // Kontonummer
                    . ", '$einausgaben_id');";

//                    file_put_contents("upload_harcamaler.txt", $querySQL);

                $rs = $db->Execute($querySQL);


                if (!$rs) {
                    $result = json_encode('Error: Datenbank-Fehler beim Upload der Datei ' . $name_array . ' aufgetregen</br> SQL-Fehlermeldung: ' . $db->ErrorMsg());
                    print ($result);
                    return;
                }

                $i = 0;
                while (!$rs->EOF) {
                    $ergebnis = $rs->fields['Ergebnis'];
                    $umsatzID = $rs->fields['ID'];
                    $tableBody .= ($ergebnis == "1") ? "<tr><td>$ii</td><td>" . $rs->fields['ErgText'] . "</td><td></td></tr>" : "<tr><td>$ii</td><td></td><td>" . $rs->fields['ErgText'] . "</td></tr>";
                    $i++;

                    $rs->MoveNext();
                }

                $rs->Close();


                #-[Ein-Ausgabe]-----------------------[START]
                if (!empty($results) && $ergebnis == "1" && $umsatzID > 0) {
                    $art = $betrag < 0 ? 'A' : 'E';
                    $sqlQuery = "call umsaetzeKategorieAdd("
                        . $db->quote($art) .
                        ", " . $db->quote($results['typ']) .
                        ", " . $db->quote($dat[2] . "-" . $dat[1] . "-" . $dat[0]) .
                        ", " . $db->quote($spalte[0]) .
                        ", " . $db->quote($spalte[4]) .
                        ", " . $db->quote(utf8_encode($spalte[3])) .
                        ", " . $betrag .
                        ", " . $results['catID'] .
                        ", " . 1;
                    $interval_ = "'E'";
                    $sqlQuery .= ", " . $interval_ .
                        ", " . $db->quote($dat[2] . "-" . $dat[1] . "-" . $dat[0]) .
                        ", ''" .
                        ", 'N'" .
                        ", ''" .
                        ", $umsatzID" .
                        ", ''";

                    $sqlQuery .= ", NULL";

                    $sqlQuery .= ");";

                    $rs = $db->Execute($sqlQuery);

                    $value = [];

                    if (!$rs) {
                        $out['response']['status'] = -4;
                        $out['response']['errors'] = array('ID' => $db->ErrorMsg());

                        print json_encode($out);
                        return;
                    }

                    if (isset($rs->fields['ergebnis'])) {
                        if ($rs->fields['ergebnis'] == 1) {
                            $i = 0;

                            while (!$rs->EOF) {
                                $value["ID"] = (isset($rs->fields['ID'])) ? $rs->fields['ID'] : 0;
                                $i++;

                                $rs->MoveNext();
                            }

                            $rs->Close();

                        }
                    } else {
                        $out['response']['status'] = -4;
                        $out['response']['errors'] = array('ID' => "Keine Ergebnis-Rückmeldung erhalten </br>" . $db->ErrorMsg());

                        print json_encode($out);
                        return;
                    }
                }
                #-[Ein-Ausgabe]-----------------------[ENDE]

            }
        }

        $ii++;
    }
    $uplStatus .= $tableStart . $tableHeader . $tableBody . $tableEnd;
    $result = json_encode($uplStatus);

    print ($result);
    return;
} else {
    $result = json_encode("Error: Fehler beim Verschieben der Datei " . $name_array);
    print ($result);
    return;
}
?>