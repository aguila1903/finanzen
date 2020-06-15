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

$data = array();

$dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

if (!$dbSyb->IsConnected()) {
    print ("Anmeldung: " . $dbSyb->ErrorMsg());
    return ($data);
}

$dbSyb->debug = false;

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

if (isset($_REQUEST["f"])) {
    $f = $_REQUEST["f"];
} else {
    $f = "";
}

if (isset($_REQUEST["auswahl"])) {
    $ausw = $_REQUEST["auswahl"];
} else {
    $ausw = "B";
}


$queryOrig = "SELECT e.ID, e.datum, enddatum, e.art, e.typ, e.kontonr, e.vorgang, e.betrag, e.kategorie_id, e.interval,   
  case when e.interval = 'Y' then 'jährlich' when e.interval = 'Q' then 'quartalsweise' when e.interval = 'M' then 'monatlich' when ifnull(e.interval,'') = '' or e.interval = 'E'  then 'einmalig' END AS int_bez,
  case when e.typ = 'V' then 'Variabel' when e.typ = 'F' then 'Fix' ELSE '' END  typ_bez,
  case when e.art = 'A' then 'Ausgaben'  when e.art = 'E' then 'Einnahmen' ELSE '' END  art_bez,
  ka.bezeichnung AS kategorie,dauer, e.zahlungsmittel_id, z.bezeichnung as zahlungsmittel_bez,
  k.bezeichnung AS konto_bez, e.herkunft, ifnull(detail,'N') as detail, kommentar, dokument, bundle
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
        . $andJahr
        . $andZahlungsmittel;

$queryUnion = " Union " // Fixkosten
        . " SELECT e.ID, dt.datum, enddatum, e.art, e.typ, e.kontonr, e.vorgang, e.betrag, e.kategorie_id, e.interval,   
  case when e.interval = 'Y' then 'jährlich' when e.interval = 'Q' then 'quartalsweise' when e.interval = 'M' then 'monatlich' when ifnull(e.interval,'') = '' or e.interval = 'E' then 'einmalig' END AS int_bez,
  case when e.typ = 'V' then 'Variabel' when e.typ = 'F' then 'Fix' ELSE '' END  typ_bez,
  case when e.art = 'A' then 'Ausgaben'  when e.art = 'E' then 'Einnahmen' ELSE '' END  art_bez,
  ka.bezeichnung AS kategorie,dauer, e.zahlungsmittel_id, z.bezeichnung as zahlungsmittel_bez, 
  k.bezeichnung AS konto_bez, herkunft, ifnull(detail,'N') as detail, kommentar, dokument, bundle
  from einausgaben e 
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
        . $andZeitraumUnion
        . $andJahrUnion
        . $andKategorie;

if ($f != "sum") {
    if ($ausw == "B") {
        $querySQL = $queryOrig . $queryUnion;
    } else {
        $querySQL = $queryOrig;
    }

    file_put_contents("einAusgabeDS.txt", $querySQL);

    $rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren


    if (!$rs) {
        print("Query 1: " . $dbSyb->ErrorMsg());
        return($data);
    }
// das else MUSS nicht sein, da ein Fehler vorher Stoppt


    $i = 0;

    while (!$rs->EOF) {
        $data[$i]["ID"] = $rs->fields['ID'];
        $data[$i]["datum"] = $rs->fields['datum'];
        $data[$i]["enddatum"] = $rs->fields['enddatum'];
        $data[$i]["typ"] = $rs->fields['typ'];
        $data[$i]["typ_bez"] = $rs->fields['typ_bez'];
        $data[$i]["art"] = $rs->fields['art'];
        $data[$i]["art_bez"] = $rs->fields['art_bez'];
        $data[$i]["vorgang"] = $rs->fields['vorgang'];
        $data[$i]["herkunft"] = $rs->fields['herkunft'];
        $data[$i]["interval"] = $rs->fields['interval'];
        $data[$i]["int_bez"] = $rs->fields['int_bez'];
        $data[$i]["konto_bez"] = $rs->fields['konto_bez'];
        $data[$i]["kategorie"] = $rs->fields['kategorie'];
        $data[$i]["kategorie_id"] = $rs->fields['kategorie_id'];
        $data[$i]["detail"] = $rs->fields['detail'];
        $data[$i]["dauer"] = $rs->fields['dauer'];
        $data[$i]["document"] = $rs->fields['dokument'];
        $data[$i]["kommentar"] = $rs->fields['kommentar'];
        $data[$i]["zahlungsmittel_id"] = $rs->fields['zahlungsmittel_id'];
        $data[$i]["zahlungsmittel_bez"] = $rs->fields['zahlungsmittel_bez'];
        $data[$i]["kontonr"] = $rs->fields['kontonr'];
        $data[$i]["bundle"] = $rs->fields['bundle'];
        $data[$i]["betrag"] = number_format($rs->fields['betrag'], 2, ",", ".");

        if ($rs->fields['betrag'] > 0) {

            $id = 0; // Einnahme
            $data[$i]["_hilite"] = $id;
        } elseif ($rs->fields['betrag'] < 0) {

            $id = 1; // Ausgabe
            $data[$i]["_hilite"] = $id;
        }

        $i++;
        $rs->MoveNext();
    }

    $rs->Close();
} else {
    /*
     * ****************************** SUMMEN ***************************************
     * *****************************************************************************
     */


    $querySQL = "SELECT IFNULL(( Select sum(e.betrag)
 FROM einausgaben e 
  JOIN konten k ON e.kontonr=k.kontonr
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
            . $andJahr
            . $andKategorie
            . $andZahlungsmittel
            . "),0) +  IFNULL((" // Fixkosten
            . " SELECT  sum(e.betrag)
  from einausgaben e 
  JOIN kategorien ka on e.kategorie_id = ka.ID
  JOIN konten k ON e.kontonr = k.kontonr 
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
            . $andZeitraumUnion
            . $andJahrUnion
            . $andKategorie
            . "),0) as summe";

    file_put_contents("einAusgabenSummen.txt", $querySQL);
    /* @var $rs string */
    $rs = $dbSyb->Execute($querySQL); //=>>> Abfrage wird an den Server �bermittelt / ausgef�hrt?
// Ausgabe initialisieren


    if (!$rs) {
        print("Query 1: " . $dbSyb->ErrorMsg());
        return($data);
    }
// das else MUSS nicht sein, da ein Fehler vorher Stoppt

    $i = 0;

    while (!$rs->EOF) {
        $data["summe"] = number_format($rs->fields['summe'], 2, ",", ".");
        $i++;
        $rs->MoveNext();
    }

    $rs->Close();
}

print json_encode($data);
?>