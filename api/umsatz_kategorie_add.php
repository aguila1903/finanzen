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



if (isset($_REQUEST["kategorie_id"])) {
    $kategorie_id = $_REQUEST["kategorie_id"];
    if ($kategorie_id != "null" && $kategorie_id != "") {
        if ((preg_match("/^[0-9]{1,11}?$/", trim($kategorie_id))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('kagegorie' => "Bitte die Kategorie prüfen!");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('kagegorie' => "Kategorie fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('kagegorie' => "Kategorie fehlt!");
    print json_encode($out);
    return;
}
if (isset($_REQUEST["umsatz_id"])) {
    $umsatz_id = $_REQUEST["umsatz_id"];
    if ($umsatz_id != "null" && $umsatz_id != "") {
        if ((preg_match("/^[0-9]{1,11}?$/", trim($umsatz_id))) == 0) {

            $umsatz_id = "NULL";
        }
    } else {
        $umsatz_id = "NULL";
    }
} else {
    $umsatz_id = "NULL";
}
if (isset($_REQUEST["zahlungsmittel"])) {
    $zahlungsmittel = $_REQUEST["zahlungsmittel"];
    if ($zahlungsmittel != "null" && $zahlungsmittel != "") {
        if ((preg_match("/^[0-9]{1,11}?$/", trim($zahlungsmittel))) == 0) {

            $zahlungsmittel = "NULL";
        }
    } else {
        $zahlungsmittel = "NULL";
    }
} else {
    $zahlungsmittel = "NULL";
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

if (isset($_REQUEST["bundle"])) {
    $bundle = $_REQUEST["bundle"];
    if ($bundle != "null" && $bundle != "") {
        if (strlen($bundle) > 64) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('bundle' => "Vorgang darf max. 64 Zeichen lang sein");
            print json_encode($out);
            return;
        }
    } else {
        $bundle = null;
    }
} else {
    $bundle = null;
}

$herkunft_intern = "";
if (isset($_REQUEST["herkunft"])) {
    $herkunft = $_REQUEST["herkunft"];
    if ($herkunft != "null" && $herkunft != "") {
        if (strlen($herkunft) > 450) {
            $out['response']['status'] = -1;
            $out['response']['errors'] = array('herkunft' => "Herkunft darf max. 450 Zeichen lang sein");
            print json_encode($out);
            return;
        }
        $aHerkunft = explode("->", $herkunft);
        if (isset($aHerkunft[1])) {
            $herkunft_intern = $aHerkunft[1];
        } else {
            $herkunft_intern = $herkunft;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('herkunft' => "Herkunft fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('herkunft' => "Herkunft fehlt!");
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

if (isset($_REQUEST["enddatum"])) {
    $enddatum = $_REQUEST["enddatum"];
    if ($enddatum != "null" && $enddatum != "") {
        if ((preg_match("/^[0-9-]{10}?$/", trim($enddatum))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('enddatum' => "Bitte das Datum prüfen");
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('enddatum' => "Datum fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('enddatum' => "Datum fehlt!");
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


if (isset($_REQUEST["interval"])) {
    $interval = $_REQUEST["interval"];
    if ($interval != "null" && $interval != "") {
        if ((preg_match("/^[myqe]{1}?$/i", trim($interval))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('interval' => "Bitte den Intervall prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $interval = "E";
    }
} else {
    $interval = "E";
}


if (isset($_REQUEST["typ"])) {
    $typ = $_REQUEST["typ"];
    if ($typ != "null" && $typ != "") {
        if ((preg_match("/^[fvFV]{1}?$/", trim($typ))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('typ' => "Bitte den Typ prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('typ' => "Typ fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('typ' => "Typ fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["art"])) {
    $art = $_REQUEST["art"];
    if ($art != "null" && $art != "") {
        if ((preg_match("/^[eaAE]{1}?$/", trim($art))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('art' => "Bitte die Art prüfen");

            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = array('art' => "Art fehlt!");
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = array('art' => "Art fehlt!");
    print json_encode($out);
    return;
}

if (isset($_REQUEST["betrag"])) {
    $betrag = str_replace('.', '', $_REQUEST["betrag"]);
    $betrag = str_replace(',', '.', $betrag);
    if ($art == "A") {
        if (substr($betrag, 0, 1) != "-") {
            $betrag = "-$betrag";
        }
    } else {
        $betrag = str_replace("-", "", $betrag);
    }
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

if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];
    if ($ID != "null" && $ID != "") {
        if ((preg_match("/^[0-9]{0,11}?$/", trim($ID))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('ID' => "Bitte ID prüfen");

            print json_encode($out);
            return;
        }
    }
} else {
    $ID = "";
}
if (isset($_REQUEST["dauer"])) {
    $dauer = $_REQUEST["dauer"];
    if ($dauer != "null" && $dauer != "") {
        if ((preg_match("/^[0-9]{0,11}?$/", trim($dauer))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = array('dauer' => "Bitte dauer prüfen");

            print json_encode($out);
            return;
        }
    }
} else {
    $dauer = 0;
}

if (isset($_REQUEST["detail"])) {
    $detail = $_REQUEST["detail"];
    if ($detail == "null" || $detail == "") {
        $detail = "";
    }
} else {
    $detail = "";
}
if (isset($_REQUEST["kommentar"])) {
    $kommentar = $_REQUEST["kommentar"];
    if ($kommentar == "null" || $kommentar == "undefined") {
        $kommentar = "";
    }
} else {
    $kommentar = "";
}

if (isset($_REQUEST["action"])) {
    $action = $_REQUEST["action"];
} else {
    $action = "add";
}

if ($action == "add") {
    $sqlQuery = "call umsaetzeKategorieAdd("
            . $dbSyb->quote($art) .
            ", " . $dbSyb->quote($typ) .
            ", " . $dbSyb->quote($datum) .
            ", " . $dbSyb->quote($kontonr) .
            ", " . $dbSyb->quote($vorgang) .
            ", " . $dbSyb->quote($herkunft) .
            ", " . $betrag .
            ", " . $kategorie_id .
            ", " . $dauer;
    $interval_ = ($typ == 'F') ? $dbSyb->quote($interval) : "'E'";
    $sqlQuery .= ", " . $interval_ .
            ", " . $dbSyb->quote($enddatum) .
            ", " . $dbSyb->quote($herkunft_intern) .
            ", " . $dbSyb->quote($detail) .
            ", " . $dbSyb->quote($kommentar) .
            ", " . $umsatz_id .
            ", " . $zahlungsmittel;
    if ($bundle == null) {
        $sqlQuery .= ", NULL";
    } else {
        $sqlQuery .= ", " . $dbSyb->quote($bundle);
    }
    $sqlQuery .= ");";
} else {
    $sqlQuery = "call umsaetzeKategorieEdit("
            . $dbSyb->quote($ID) .
            ", " . $dbSyb->quote($art) .
            ", " . $dbSyb->quote($typ) .
            ", " . $dbSyb->quote($datum) .
            ", " . $dbSyb->quote($kontonr) .
            ", " . $dbSyb->quote($vorgang) .
            ", " . $dbSyb->quote($herkunft) .
            ", " . $betrag .
            ", " . $kategorie_id .
            ", " . $dauer;
    $interval_ = ($typ == 'F') ? $dbSyb->quote($interval) : "'E'";
    $sqlQuery .= ", " . $interval_ .
            ", " . $dbSyb->quote($enddatum) .
            ", " . $dbSyb->quote($herkunft_intern) .
            ", " . $dbSyb->quote($detail) .
            ", " . $dbSyb->quote($kommentar) .
            ", " . $zahlungsmittel;
    if ($bundle == null) {
        $sqlQuery .= ", NULL";
    } else {
        $sqlQuery .= ", " . $dbSyb->quote($bundle);
    }
    $sqlQuery .= ");";
}


//file_put_contents("herkunft_intern.txt", $herkunft_intern . "\n", FILE_APPEND);
file_put_contents("umsatz_kategorie_add.txt", $sqlQuery);
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

            $value["ergebnis"] = $rs->fields['ergebnis'];
            $value["ID"] = (isset($rs->fields['ID'])) ? $rs->fields['ID'] : 0;

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
