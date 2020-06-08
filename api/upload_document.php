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

if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];
    if ($ID != "null" && $ID != "") {
        if ((preg_match("/^[0-9]{0,11}?$/", trim($ID))) == 0) {

            $result = json_encode('Error: ID prüfen! (' . $ID . ')');
            print ($result);
            return;
        }
    }
} else {
    $result = json_encode('Error: ID fehlt!');
    print ($result);
    return;
}

if (isset($_FILES['file'])) {

    $name_array = $_FILES['file']['name'];
    $tmp_name_array = $_FILES['file']['tmp_name'];
    $type_array = $_FILES['file']['type'];
    $size_array = $_FILES['file']['size'];
    $error_array = $_FILES['file']['error'];


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

$path2 = str_replace("/", "\\", PATH_DOCS);


if (is_dir($path2) != 1) {
    mkdir($path2, 0775, true);
}

$aExt = explode(".", $name_array);
$i = count($aExt) - 1;

$fileName = $ID . "." . $aExt[$i];
$result = json_encode("Datei beinhaltet keine Daten zum auswerten.");


$querySQL = "Select bundle from einausgaben Where ID = $ID";

$rs = $dbSyb->Execute($querySQL);

$where = " Where ID = $ID";
$ii = 0;
$IDs = [];
if ($rs) {
    $bundle = trim($rs->fields['bundle']);
    if ($bundle != "") {
        $querySQL = "Select ID from einausgaben Where bundle = '$bundle'";
        $rs = $dbSyb->Execute($querySQL);
        while (!$rs->EOF) {
            $IDs[$ii] = $rs->fields['ID'];
            $ii++;
            $rs->MoveNext();
        }
        if (count($IDs) > 0) {
            $IDs[$ii] = $ID;
            file_put_contents("upload_doc.txt", print_r($IDs, true));
            $sID = implode(",", $IDs);
            $where = " Where ID in ($sID)";
        }
    }
}
$rs->Close();


if (move_uploaded_file(($tmp_name_array), $path2 . $fileName)) {

    $file = file_get_contents($path2 . $fileName, true);

    $querySQL = "Update einausgaben set dokument = {$dbSyb->Quote($fileName)} $where;";

    $rs = $dbSyb->Execute($querySQL);


    if (!$rs) {
        $result = json_encode('Error: Datenbank-Fehler beim Upload der Datei ' . $name_array . ' aufgetregen</br> SQL-Fehlermeldung: ' . $dbSyb->ErrorMsg());
        print ($result);
        return;
    }

    $ergText = "Dokument $fileName erfolgreich hochgeladen";
    $rs->Close();

    $result = json_encode($ergText);

    print ($result);
    return;
} else {
    $result = json_encode("Error: Fehler beim Verschieben der Datei " . $name_array);
    print ($result);
    return;
}
?>