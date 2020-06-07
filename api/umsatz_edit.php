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


$out = array();

if (!$dbSyb->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $dbSyb->ErrorMsg();

    print json_encode($out);

    return;
}

$dbSyb->debug = false;


if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];
    if ($ID != "null" && $ID != "") {
        if ((preg_match("/^[0-9]{1,11}?$/", trim($ID))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('ID' => "Bitte die ID prüfen!");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('ID' => "ID fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('ID' => "ID fehlt!");
    print json_encode($out);
    return;
}


if (isset($_REQUEST["herkunft"])) {
    $herkunft = $_REQUEST["herkunft"];
    if ($herkunft != "null" && $herkunft != "") {
        if (strlen($herkunft) > 450) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('herkunft' => "Herkunft darf max. 450 Zeichen lang sein");
            print json_encode($out);
            return;
        }
    } else {
        $herkunft = "";
    }
} else {
    $herkunft = "";
}

if (isset($_REQUEST["buchtext"])) {
    $buchtext = $_REQUEST["buchtext"];
    if ($buchtext != "null" && $buchtext != "") {
        if (strlen($buchtext) > 450) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('buchtext' => "Buchtext darf max. 450 Zeichen lang sein");
            print json_encode($out);
            return;
        }
    } else {
        $buchtext = "";
    }
} else {
    $buchtext = "";
}

if (isset($_REQUEST["vorgang"])) {
    $vorgang = $_REQUEST["vorgang"];
    if ($vorgang != "null" && $vorgang != "") {
        if (strlen($vorgang) > 450) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('vorgang' => "Vorgang darf max. 450 Zeichen lang sein");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('vorgang' => "Vorgang fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('vorgang' => "Vorgang fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["betrag"])) {
    $betrag = str_replace('.', '', $_REQUEST["betrag"]);
    $betrag = str_replace(',', '.', $betrag);
    if ($betrag != "null" && $betrag != "") {
        if ((preg_match("/^[0-9-.]{1,10}?$/", trim($betrag))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('betrag' => "Bitte den Betrag prüfen");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('betrag' => "Betrag fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('betrag' => "Betrag fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["datum"])) {
    $datum = $_REQUEST["datum"];
    if ($datum != "null" && $datum != "") {
        if ((preg_match("/^[0-9-]{10}?$/", trim($datum))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('datum' => "Bitte das Datum prüfen");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('datum' => "Datum fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('datum' => "Datum fehlt!");
    print json_encode($out);
    return;
}


if (isset($_REQUEST["kontonr"])) {
    $kontonr = $_REQUEST["kontonr"];
    if ($kontonr != "null" && $kontonr != "") {
        if ((preg_match("/^[a-zA-Z0-9]{1,50}?$/", trim($kontonr))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('kontonr' => "Bitte Konto-Nr prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('kontonr' => "Konto-Nr fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('kontonr' => "Konto-Nr fehlt!");
    print json_encode($out);
    return;
}

$hash = md5($buchtext . $vorgang . $herkunft . $herkunft . $datum . $betrag . $kontonr);
$sqlQuery = "call editUmsaetze("
        . $ID .
        ", " . $dbSyb->quote($buchtext) .
        ", " . $dbSyb->quote($vorgang) .
        ", " . $dbSyb->quote($herkunft) .
        ", " . $dbSyb->quote($datum . " 00:00:00");
if (substr($betrag, 0, 1) == "-") {
    $einnahme = "NULL";
    $ausgabe = $betrag;
} else {
    $einnahme = $betrag;
    $ausgabe = "NULL";
}
$sqlQuery .= ", " . $einnahme .
        ", " . $ausgabe .
        ", " . $dbSyb->quote($kontonr) .
        ", " . $dbSyb->quote($hash) .
        ");";

//file_put_contents("query.txt", $sqlQuery);
$rs = $dbSyb->Execute($sqlQuery);

$value = array();

if (!$rs) {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('ID' => $dbSyb->ErrorMsg());

    print json_encode($out);
    return;
}

If (isset($rs->fields['ergebnis'])) {
    if ($rs->fields['ergebnis'] == 1) {
        $i = 0;

        while (!$rs->EOF) {

            $value[$i]["ergebnis"] = $rs->fields['ergebnis'];

            $i++;

            $rs->MoveNext();
        }

        $rs->Close();

        $out['response']['status'] = 0;
        $out['response']['errors'] = array();
        $out['response']['data'] = $value;

        print json_encode($out);
    } else if ($rs->fields['ergebnis'] == 0) {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('ID' => "Es wurden keine Änderungen vorgenommen. Entweder gab es keine Änderungen oder es ist ein Fehler aufgetreten. </br>" . $dbSyb->ErrorMsg());

        print json_encode($out);
        return;
    } else {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('ID' => "Update konnte nicht durchgeführt werden. </br>" . $dbSyb->ErrorMsg());

        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -4;
    $out['response']['errors'] = array('ID' => "Keine Ergebnis-Rückmeldung erhalten </br>" . $dbSyb->ErrorMsg());

    print json_encode($out);
    return;
}
?>
