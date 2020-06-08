<?php

session_start();
require_once('adodb5/adodb.inc.php');
require_once('conf.php');


$ADODB_CACHE_DIR = 'C:/php/cache';
$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 
$ADODB_COUNTRECS = true;
$dbSyb = ADONewConnection('mysqli');
$dbSyb->memCache = false;


$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

if (!$dbSyb->IsConnected()) {
    $result = json_encode('Error: Datenbank-Verbindung konnte nicht hergestellt werden!');
    print ($result);
    return;
}


$dbSyb->debug = false;

$ergebnis = 0;
$data = array();

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
        $fileName = $pdfPath . $_REQUEST['fileName'];
    } else {
        $result = json_encode('Error: Es wurde keine Datei hochgeladen');
        print $result;
        exit();
    }

//    $fileName = "createUsers.csv";
}
if (defined("PATH_CSV")) {
    $path =  PATH_CSV;
} else {
    $result = json_encode('Error: CSV-Pfad nicht definiert');
    print $result;
    exit();
}


$path2 = str_replace("/", "\\",$path . "umsaetze/");

if (is_dir($path2) != 1) {
    mkdir($path2, 0775, true);
}

$fileName = basename(($_FILES['file']['name']));
$result = json_encode("Datei beinhaltet keine Daten zum auswerten.");

if (move_uploaded_file(($tmp_name_array), $path2 . $fileName)) {

    $file = file_get_contents($path2 . $fileName, true);

    $file_repl = str_replace(array('\r', '"'), "", $file);

    $split = explode("\n", $file_repl);
    $uplStatus = "";
    $ii = 1;
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

//                    if ($spalte[0] == 'DE37200505501313475590') { // Giro-Konto
//                        $typ = 'G';
//                    } else if ($spalte[0] == 'DE30200505503032245585') { // Spar-Konto
//                        $typ = 'S';
//                    } else if ($spalte[0] == 'DE46200505501032848705') { // Mäusekonto Berat
//                        $typ = 'M1';
//                    } else if ($spalte[0] == 'DE12200505501500680705') { // Mäusekonto Berke
//                        $typ = 'M2';
//                    }

                $querySQL = "call ausgabenADD ("
                        . $dbSyb->Quote(utf8_encode($spalte[4])) //Verwendungszweck
                        . ", " . str_replace(",", ".", $betrag) // Betrag
                        . ", " . $dbSyb->Quote($dat[2] . "-" . $dat[1] . "-" . $dat[0]) //Buchungstag
                        . ", " . $dbSyb->Quote($fileName)
                        . ", " . $dbSyb->Quote(utf8_encode($spalte[3])) // Buchtext
                        . ", " . $dbSyb->Quote($spalte[11]) // Beguenstigter/Zahlungspflichtiger
                        . ", " . $dbSyb->Quote($hash)
                        . ", " . $dbSyb->Quote($spalte[0]) // Kontonummer
                        . ", '');";

//                    file_put_contents("upload_harcamaler.txt", $querySQL);

                $rs = $dbSyb->Execute($querySQL);


                if (!$rs) {
                    $result = json_encode('Error: Datenbank-Fehler beim Upload der Datei ' . $name_array . ' aufgetregen</br> SQL-Fehlermeldung: ' . $dbSyb->ErrorMsg());
                    print ($result);
                    return;
                }

                $i = 0;

                while (!$rs->EOF) {
                    $ergebnis = $rs->fields['Ergebnis'];
                    $ergText = ($ergebnis == "1") ? "Eintrag hinzugefügt: " . $rs->fields['ErgText'] : "Eintrag nicht hinzugefügt: " . $rs->fields['ErgText'];
                    $uplStatus .= "$ii) $ergText  <br />";
                    $i++;

                    $rs->MoveNext();
                }

                $rs->Close();
            }
        }

        $ii++;
    }

    $result = json_encode(($fileName) . ':<br />' . $uplStatus);

    print ($result);
    return;
} else {
    $result = json_encode("Error: Fehler beim Verschieben der Datei " . $name_array);
    print ($result);
    return;
}
?>