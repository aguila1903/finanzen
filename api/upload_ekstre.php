<?php

session_start();
require_once('adodb5/adodb.inc.php');
require_once('conf.php');
require_once('tools/autoDatenImport.php');


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


if (isset($_FILES['file'])) {

    $name_array = $_FILES['file']['name'];
    $tmp_name_array = $_FILES['file']['tmp_name'];
    $type_array = $_FILES['file']['type'];
    $size_array = $_FILES['file']['size'];
    $error_array = $_FILES['file']['error'];

    if (preg_match("/pdf/i", $type_array) != 1) {
        print json_encode("Error: Datei ist keine PDF-Datei");
        return;
    }

    if ($error_array > 0) {
        $fehlerText = "Error: unbekannt";
        if ($fehler == 1) {
            $fehlerText = "Error: 1 (" . $size_array . ")";
        }
        if ($fehler == 2) {
            $fehlerText = "Error: 2(" . $size_array . ")";
        }
        if ($fehler == 3) {
            $fehlerText = "Error: die Datei wurde nur teilweise übertragen";
        }
        if ($fehler == 4) {
            $fehlerText = "Error: es wurde keine Datei übertragen";
        }
        print json_encode($fehlerText);
        return;
    }
} else {
    $result = json_encode('Error: Es wurde keine Datei hochgeladen');
    print ($result);
    return;
}

if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];
} else {
    $result = json_encode("ID fehlt!");
    print ($result);
    return;
}

if (isset($_REQUEST["karten_nr"])) {
    $karten_nr = strtoupper(($_REQUEST["karten_nr"]));
    if ($karten_nr != "NULL" && $karten_nr != "") {

        if ((preg_match("/^[0-9a-zA-Z]{1,50}?$/", trim($karten_nr))) == 0) {
            $result = json_encode("Error: Kartenkürzel prüfen");
            print json_encode($result);
            return;
        }
    } else {
        $result = json_encode("Error: Kartenkürzel prüfen");
        print json_encode($result);
        return;
    }
} else {
    $result = json_encode("Error: Kartenkürzel fehlt");
    print json_encode($result);
    return;
}

if (isset($_REQUEST["monat"])) {
    $monat = $_REQUEST["monat"];
} else {

    $result = json_encode("Error: Erforderlicher Parameter Monat fehlt!");
    print json_encode($result);
    return;
}

$path = PATH_PDFs;


if (is_dir($path) != 1) {
    mkdir($path, 0775, true);
}

$fileName = basename(($_FILES['file']['name']));

if (move_uploaded_file(($tmp_name_array), $path . $fileName)) {

    $querySQL = "call kreditkarten_upload_doc (" . $ID
            . "," . $dbSyb->Quote($fileName) . ");";

    $rs = $dbSyb->Execute($querySQL);

    if (!$rs) {
        $result = json_encode('Error: Datenbank-Fehler beim Upload der Datei ' . $name_array . ' aufgetregen</br> SQL-Fehlermeldung: ' . $dbSyb->ErrorMsg());
        print ($result);
        return;
    }

    $i = 0;
    $ergebnis = "";

    while (!$rs->EOF) {
        $ergebnis = $rs->fields['Ergebnis'];
        $i++;
        $rs->MoveNext();
    }

    $rs->Close();

    if ($ergebnis == 1) {

// Alle Raten hochsetzen bevor die Karten-Vorgänge aktualisiert werden.
        $querySQL = "call raten_up (" . $dbSyb->Quote($monat) . ", " . $dbSyb->Quote($karten_nr) . ");";

        $rs = $dbSyb->Execute($querySQL);

        if (!$rs) {
            $result = json_encode('Error: Fehler bei der Aktualisierung der Raten aufgetregen</br> SQL-Fehlermeldung: ' . $dbSyb->ErrorMsg());
            print ($result);
            return;
        }

        $i = 0;
        $ergebnis = "";

        while (!$rs->EOF) {
            $ergebnis = $rs->fields['Ergebnis'];
            $i++;
            $rs->MoveNext();
        }
        $rs->Close();

        if ($ergebnis == 1) {

            $fullFileName = $path . $fileName;
            $newRates = updateCreditCard($fullFileName, $dbSyb, $monat, PATH_PDFTools);

            $result = json_encode($newRates);
            print ($result);
            return;
        } elseif ($ergebnis == -1) {
            $result = json_encode("Error: Unbekannter Fehler bei der Aktualisierung der Raten aufgetregen. Fehlermeldung aus der Prozedur 'taksitler_up' (" . $ergebnis . ")");
            print ($result);
            return;
        } else {
            $result = json_encode("Error: Keine Rückmeldung erhalten.");
            print ($result);
            return;
        }
    } elseif ($ergebnis == -1) {
        $result = json_encode("Error: Datensatz konnte nicht in die Datenbank eingespielt werden. (" . $ergebnis . ")");
        print ($result);
        return;
    } else {
        $result = json_encode("Error: Keine Rückmeldung erhalten.");
        print ($result);
        return;
    }
} else {
    $result = json_encode("Error: Fehler beim verschieben der Datei " . $name_array);
    print ($result);
    return;
}
?>