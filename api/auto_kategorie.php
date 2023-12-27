<?php

session_start();
require_once('adodb5/adodb.inc.php');
require_once('conf.php');
require_once('functions.php');

$db = connectAdoDB(DB_HOST, DB_USER, DB_PW, DB_NAME, 'mysqli');


$out = array();
$data = array();

if (!$db->IsConnected()) {

    $out['response']['status'] = -1;
    $out['response']['errors'] = "Error: " . $db->ErrorMsg();

    print json_encode($out);

    return;
}

if (isset($_REQUEST["ID"])) {
    $ID = $_REQUEST["ID"];
    if ($ID != "null" && $ID != "") {
        if ((preg_match("/^[0-9|]{1,}?$/", trim($ID))) == 0) {

            $out['response']['status'] = -4;
            $out['response']['errors'] = "Bitte die ID prüfen!";
            print json_encode($out);
            return;
        }
    } else {
        $out['response']['status'] = -1;
        $out['response']['errors'] = "ID fehlt!";
        print json_encode($out);
        return;
    }
} else {
    $out['response']['status'] = -1;
    $out['response']['errors'] = "ID fehlt!";
    print json_encode($out);
    return;
}

// Hole Mapping-Kategorien
$querySQL = "Select * from category_mapping";
$catMaps = sqlQuery($querySQL, $db);

$IDs = trim($ID, "|");

$aID = explode("|", $IDs);

foreach ($aID as $id) {
    $querySQL = " SELECT * FROM monats_ausgaben WHERE ID = $id;";

    $rs = $db->Execute($querySQL);

    if (!$rs) {
        $out['response']['status'] = -4;
        $out['response']['errors'] = "Error: " . $db->ErrorMsg();

        print json_encode($out);
        return;
    }

    $rs->Close();
    if ($rs->fields['einausgaben_id'] > 0 || !empty($rs->fields['einausgaben_id'])) {
        continue;
    }

//    file_put_contents("kategorien.txt", $rs->fields['einausgaben_id']);
    #-[KATEGORIE ZUORDNUNG]-----------------------[START]

    $results = [];
    foreach ($catMaps as $catMap) {
        $pattern = '/' . $catMap['KEY'] . '/i';
        if (preg_match($pattern, $rs->fields['vorgang'] . " " . $rs->fields['herkunft'])) {
            $results['catID'] = $catMap['catID'];
            $results['KEY'] = $catMap['KEY'];
            $results['typ'] = $catMap['typ'];
            $results['match'] = $rs->fields['vorgang'] . " " . $rs->fields['herkunft'];
            break;
        }
    }

    // Ordne alle nicht zuordbaren Paypal-Einkäufe PayPal zu

    if (empty($results) && preg_match("/PayPal/i", $rs->fields['vorgang'] . " " . $rs->fields['herkunft'])) {
        $results['catID'] = 103;
        $results['KEY'] = "PayPal";
        $results['typ'] = "V";
        $results['match'] = $rs->fields['vorgang'] . " " . $rs->fields['herkunft'];
    }

    if (empty($results) && !empty($rs->fields['buchungstext']) && preg_match("/BARGELDAUSZAHLUNG/i", $rs->fields['buchungstext'])) {
        $results['catID'] = 45;
        $results['KEY'] = "BARGELDAUSZAHLUNG";
        $results['typ'] = "V";
        $results['match'] = $rs->fields['buchungstext'];
    }

    if (empty($results)) {
//        file_put_contents("noResults.txt", $rs->fields['vorgang'] . " " . $rs->fields['herkunft'] . "\n", FILE_APPEND);
    }

//                file_put_contents("category.txt", print_r($results, true) . "\n", FILE_APPEND);

    #-[KATEGORIE ZUORDNUNG]-----------------------[ENDE]

//                    file_put_contents("upload_harcamaler.txt", $querySQL);


    $betrag = $rs->fields['einnahme'] == 0 ? $rs->fields['ausgabe'] : $rs->fields['einnahme'];

    #-[Ein-Ausgabe]-----------------------[START]
    if (!empty($results)) {
        $art = $betrag < 0 ? 'A' : 'E';
        $sqlQuery = "call umsaetzeKategorieAdd("
            . $db->quote($art) .
            ", " . $db->quote($results['typ']) .
            ", " . $db->quote($rs->fields['datum']) .
            ", " . $db->quote($rs->fields['kontonr']) .
            ", " . $db->quote($rs->fields['vorgang']) .
            ", " . $db->quote($rs->fields['herkunft']) .
            ", " . $betrag .
            ", " . $results['catID'] .
            ", " . 1;
        $interval_ = "'E'";
        $sqlQuery .= ", " . $interval_ .
            ", " . $db->quote($rs->fields['datum']) .
            ", ''" .
            ", 'N'" .
            ", ''" .
            ", $id" .
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
$out['response']['status'] = 0;
$out['response']['errors'] = "";
$out['response']['data'] = "";
print json_encode($out);
return;

?>