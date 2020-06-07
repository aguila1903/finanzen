<?php

session_start();

require_once('adodb5/adodb.inc.php');
require_once('conf.php');


$ADODB_CACHE_DIR = 'C:/php/cache';


$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 

$ADODB_COUNTRECS = true;

$dbSyb = ADONewConnection("mysqli");
$dbSyb->debug = false;

// DB-Abfragen NICHT cachen
$dbSyb->memCache = false;

$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

if (!$dbSyb->IsConnected()) {
    print ("Anmeldung: " . $dbSyb->ErrorMsg());
    return ($data);
}

$data = array();
$out = array();

if (isset($_REQUEST["konto"])) {
    $konto = $_REQUEST["konto"];
    if ($konto != "") {
        $aKonto = explode(",", $konto);
        $andKonto = " AND e.kontonr in ('" . implode("','", $aKonto) . "')";
    } else {
        $andKonto = "";
    }
} else {
    $andKonto = "";
}

if (isset($_REQUEST["datum"])) {
    $sDatum = "";
    $datum = $_REQUEST["datum"];
    if ($datum == "null" || $datum == "") {
        $andDatum = "";
        $andDatumUnion = "";
    } else {
        if (preg_match("/,/", $datum)) {
            $aDatum = explode(",", $datum);
            foreach ($aDatum as $Datum) {
                $datum_ = explode(".", $Datum);
                $sDatum .= "'" . $datum_[2] . "-" . $datum_[1] . "-" . $datum_[0] . "',";
            }
        } else {
            $datum_ = explode(".", $datum);
            $sDatum .= "'" . $datum_[2] . "-" . $datum_[1] . "-" . $datum_[0] . "',";
        }
        $andDatum = " and (e.datum in (" . substr($sDatum, 0, -1) . "))";
        $andDatumUnion = " and (dt.datum in (" . substr($sDatum, 0, -1) . "))";
    }
} else {
    $andDatum = "";
    $andDatumUnion = "";
}

if (isset($_REQUEST["enddatum"])) {
    $sEnddatum = "";
    $enddatum = $_REQUEST["enddatum"];
    if ($enddatum == "null" || $enddatum == "") {
        $andEndDatum = "";
    } else {
        $aEnddatum = explode(",", $enddatum);
        foreach ($aEnddatum as $Enddatum) {
            $enddatum_ = explode(".", $Enddatum);
            $sEnddatum .= "'" . $enddatum_[2] . "-" . $enddatum_[1] . "-" . $enddatum_[0] . "',";
        }
        $andEndDatum = " and (e.enddatum in (" . substr($sEnddatum, 0, -1) . "))";
    }
} else {
    $andEndDatum = "";
}


if (isset($_REQUEST["art"])) {
    $art = $_REQUEST["art"];
    if ($art == "null" || $art == "") {
        $andArt = "";
    } else {
        $andArt = " and (e.art = '$art') ";
    }
} else {
    $andArt = "";
}

if (isset($_REQUEST["typ"])) {
    $typ = $_REQUEST["typ"];
    if ($typ == "null" || $typ == "") {
        $andTyp = "";
    } else {
        $andTyp = " and (e.typ = '$typ') ";
    }
} else {
    $andTyp = "";
}

if (isset($_REQUEST["vorgang"])) {
    $vorgang = $_REQUEST["vorgang"];
    if ($vorgang == "null" || $vorgang == "") {
        $andVorgang = "";
    } else {
        $aVorgang = explode(",", $vorgang);
        $andVorgang = " AND e.vorgang in ('" . implode("','", $aVorgang) . "')";
    }
} else {
    $andVorgang = "";
}

if (isset($_REQUEST["herkunft"])) {
    $herkunft = $_REQUEST["herkunft"];
    if ($herkunft == "null" || $herkunft == "") {
        $andHerkunft = "";
    } else {
        $aHerkunft = explode(",", $herkunft);
        $andHerkunft = " AND e.herkunft in ('" . implode("','", $aHerkunft) . "')";
    }
} else {
    $andHerkunft = "";
}

if (isset($_REQUEST["interval"])) {
    $interval = $_REQUEST["interval"];
    if ($interval == "null" || $interval == "") {
        $andInterval = "";
    } else {
        $aInterval = explode(",", $interval);
        $andInterval = " AND e.interval in ('" . implode("','", $aInterval) . "')";
    }
} else {
    $andInterval = "";
}

if (isset($_REQUEST["kategorie"])) {
    $kategorie = $_REQUEST["kategorie"];
    if ($kategorie == "null" || $kategorie == "" || preg_match("/<span/", $kategorie)) {
        $andKategorie = "";
    } else {
        $aKategorie = explode(",", $kategorie);
        $andKategorie = " AND ka.bezeichnung in ('" . implode("','", $aKategorie) . "')";
    }
} else {
    $andKategorie = "";
}
if (isset($_REQUEST["monat_jahr"])) {
    $monat_jahr = $_REQUEST["monat_jahr"];
    if ($monat_jahr == "null" || $monat_jahr == "") {
        $andZeitraum = "";
        $andZeitraumUnion = "";
    } else {
        $aMonat_jahr = explode(",", $monat_jahr);
        $sMonat_jahr = "('" . implode("','", $aMonat_jahr) . "')";
        $andZeitraum = ' and (date_format(e.datum,"%m%Y")  in ' . $sMonat_jahr . ') ';
        $andZeitraumUnion = ' and (date_format(dt.datum,"%m%Y")  in ' . $sMonat_jahr . ') ';
    }
} else {
//    $andZeitraum = ' and (date_format(e.datum,"%m%Y")  = ' . $dbSyb->quote(date("mY")) . ') ';
    $andZeitraum = '';
    $andZeitraumUnion = "";
}

if (isset($_REQUEST["jahr"])) {
    $jahr = $_REQUEST["jahr"];
    if ($jahr == "null" || $jahr == "") {
        $andJahr = "";
        $andJahrUnion = "";
    } else {
        $aJahr = explode(",", $jahr);
        $sJahr = "('" . implode("','", $aJahr) . "')";
        $andJahr = ' and (date_format(e.datum,"%Y")  in ' . $sJahr . ') ';
        $andJahrUnion = ' and (date_format(dt.datum,"%Y")  in ' . $sJahr . ') ';
    }
} else {
//    $andZeitraum = ' and (date_format(e.datum,"%m%Y")  = ' . $dbSyb->quote(date("mY")) . ') ';
    $andJahr = '';
    $andJahrUnion = "";
}

if (isset($_REQUEST["zahlungsmittel"])) {
    $zahlungsmittel_id = $_REQUEST["zahlungsmittel"];
    if ($zahlungsmittel_id == "null" || $zahlungsmittel_id == "") {
        $andZahlungsmittel = "";
    } else {
        $aZahlungsmittel = explode(",", $zahlungsmittel_id);
        $andZahlungsmittel = " AND e.zahlungsmittel_id in (" . implode(",", $aZahlungsmittel) . ")";
    }
} else {
    $andZahlungsmittel = "";
}

if (isset($_REQUEST["lookFor"])) {
    $lookFor = $_REQUEST["lookFor"];
} else {
    $lookFor = "";
}

$Select = " select distinct ";
$field2 = "";

if ($lookFor == "monat_jahr") {
    $field = ' date_format(e.datum, "%m%Y") as monat_jahr, date_format(e.datum, "%Y%m") as sort';
    $field2 = ' date_format(dt.datum, "%m%Y") as monat_jahr, date_format(dt.datum, "%Y%m") as sort';
}
if ($lookFor == "jahr") {
    $field = ' date_format(e.datum, "%Y") as jahr, date_format(e.datum, "%Y") as sort';
    $field2 = ' date_format(dt.datum, "%Y") as jahr, date_format(dt.datum, "%Y") as sort';
}
if ($lookFor == "datum") {
    $field = ' date_format(e.datum, "%d.%m.%Y") as datum, date_format(e.datum, "%Y%m%d") as sort';
    $field2 = ' date_format(dt.datum, "%d.%m.%Y") as datum, date_format(dt.datum, "%Y%m%d") as sort';
}
if ($lookFor == "enddatum") {
    $field = ' date_format(e.enddatum, "%d.%m.%Y") as enddatum, date_format(e.enddatum, "%Y%m%d") as sort';
}
if ($lookFor == "art") {
    $field = " e.art, case when e.art = 'A' then 'Ausgabe'  when e.art = 'E' then 'Einnahme' ELSE '' END as art_bez, "
            . " e.art, case when e.art = 'A' then 'Ausgabe'  when e.art = 'E' then 'Einnahme' ELSE '' END as sort";
}
if ($lookFor == "typ") {
    $field = " e.typ, case when e.typ = 'V' then 'Variabel' when e.typ = 'F' then 'Fix' ELSE '' END as typ_bez,"
            . " e.typ, case when e.typ = 'V' then 'Variabel' when e.typ = 'F' then 'Fix' ELSE '' END as sort ";
}
if ($lookFor == "vorgang") {
    $field = " e.vorgang, e.vorgang as sort ";
}
if ($lookFor == "kategorie_id") {
    $field = " e.kategorie_id, ka.bezeichnung AS kategorie, ka.bezeichnung AS sort ";
}
if ($lookFor == "interval") {
    $field = " e.interval, case when e.interval = 'Y' then 'jährlich' when e.interval = 'Q' then 'quartalsweise' when e.interval = 'M' then 'monatlich'  when e.interval = 'E' then 'einmalig' END AS int_bez,"
            . " e.interval, case when e.interval = 'Y' then 'jährlich' when e.interval = 'Q' then 'quartalsweise' when e.interval = 'M' then 'monatlich'  when e.interval = 'E' then 'einmalig' END AS sort ";
}
if ($lookFor == "herkunft") {
    $field = " e.herkunft, e.herkunft as sort ";
}
if ($lookFor == "zahlungsmittel") {
    $field = "  ifnull(e.zahlungsmittel_id,0) as zahlungsmittel_id, ifnull(z.bezeichnung,'---') AS zahlungsmittel_bez, ifnull(z.bezeichnung,'---') AS sort ";
}

$querySQL = "$Select$field 
 FROM einausgaben e 
  JOIN konten k ON e.kontonr=k.kontonr
  LEFT JOIN zahlungsmittel z ON z.ID = e.zahlungsmittel_id 
  JOIN kategorien ka ON e.kategorie_id=ka.ID Where e.ID > -1 "
        . $andKonto
        . $andDatum
        . $andEndDatum
        . $andArt
        . $andTyp
        . $andVorgang
        . $andHerkunft
        . $andInterval
        . $andZeitraum
        . $andKategorie
        . $andZahlungsmittel
        . $andJahr
        . " Union "
        . " $Select";
$querySQL .= (!empty($field2)) ? $field2 : $field;
$querySQL .= " from einausgaben e 
  JOIN kategorien ka on e.kategorie_id = ka.ID
  JOIN konten k ON e.kontonr = k.kontonr 
  LEFT JOIN zahlungsmittel z ON z.ID = e.zahlungsmittel_id 
  JOIN dates_tmp dt ON e.ID=dt.einausgabe_id AND dt.einausgabe_id = e.ID  Where e.ID > -1 "
        . $andKonto
        . $andDatumUnion
        . $andEndDatum
        . $andArt
        . $andTyp
        . $andVorgang
        . $andHerkunft
        . $andInterval
        . $andZahlungsmittel
        . $andJahrUnion
        . $andZeitraumUnion
        . $andKategorie;

$querySQL .= " order by sort ";

file_put_contents("queryFilter.txt", $querySQL);
/* @var $rs string */
$rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren


if (!$rs) {
    print("Query 1: " . $dbSyb->ErrorMsg());
    return($data);
}

$i = 0;

while (!$rs->EOF) {
    if (isset($rs->fields['monat_jahr'])) {
        $data[$i]["monatJahr"] = $rs->fields['monat_jahr'];
    }
    if (isset($rs->fields['datum'])) {
        $data[$i]["datum"] = $rs->fields['datum'];
    }
    if (isset($rs->fields['enddatum'])) {
        $data[$i]["enddatum"] = $rs->fields['enddatum'];
    }
    if (isset($rs->fields['typ'])) {
        $data[$i]["typ"] = $rs->fields['typ'];
    }
    if (isset($rs->fields['typ_bez'])) {
        $data[$i]["typ_bez"] = $rs->fields['typ_bez'];
    }
    if (isset($rs->fields['art'])) {
        $data[$i]["art"] = $rs->fields['art'];
    }
    if (isset($rs->fields['art_bez'])) {
        $data[$i]["art_bez"] = $rs->fields['art_bez'];
    }
    if (isset($rs->fields['vorgang'])) {
        $data[$i]["vorgang"] = $rs->fields['vorgang'];
    }
    if (isset($rs->fields['herkunft'])) {
        $data[$i]["herkunft"] = $rs->fields['herkunft'];
    }
    if (isset($rs->fields['interval'])) {
        $data[$i]["interval"] = $rs->fields['interval'];
    }
    if (isset($rs->fields['int_bez'])) {
        $data[$i]["int_bez"] = $rs->fields['int_bez'];
    }
    if (isset($rs->fields['konto_bez'])) {
        $data[$i]["konto_bez"] = $rs->fields['konto_bez'];
    }
    if (isset($rs->fields['kategorie'])) {
        $data[$i]["kategorie"] = $rs->fields['kategorie'];
    }
    if (isset($rs->fields['kategorie_id'])) {
        $data[$i]["kategorie_id"] = $rs->fields['kategorie_id'];
    }
    if (isset($rs->fields['kontonr'])) {
        $data[$i]["kontonr"] = $rs->fields['kontonr'];
    }
    if (isset($rs->fields['zahlungsmittel_bez'])) {
        $data[$i]["zahlungsmittel_bez"] = $rs->fields['zahlungsmittel_bez'];
    }
    if (isset($rs->fields['zahlungsmittel_id'])) {
        $data[$i]["zahlungsmittel_id"] = $rs->fields['zahlungsmittel_id'];
    }
    if (isset($rs->fields['jahr'])) {
        $data[$i]["jahr"] = $rs->fields['jahr'];
    }
    $i++;
    $rs->MoveNext();
}

$rs->Close();
print json_encode($data);

return;
// print_r($out);
?>