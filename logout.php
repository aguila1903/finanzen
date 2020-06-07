<?php

session_start();
$host = (htmlspecialchars($_SERVER["HTTP_HOST"]));
$uri = rtrim(dirname(htmlspecialchars($_SERVER["PHP_SELF"])), "/\\");

// Löschen der erzeugten datei
//unlink ($session.".php");

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
    $out['response']['errors'] = array('errors' => ($dbSyb->ErrorMsg()));
    print json_encode($out);
    return;
}

$dbSyb->debug = false;

if (isset($_SESSION['finanzen']['benutzer'])) {

    $sqlQuery = "Call logoutProc(" . $dbSyb->quote($_SESSION['finanzen']['benutzer']) . ")";


// file_put_contents("logout.txt", $sqlQuery);

    $rs = $dbSyb->Execute($sqlQuery);

    $value = array();

    if (!$rs) {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('errors' => ($dbSyb->ErrorMsg()));

        print json_encode($out);
        return;
    }


    If (isset($rs->fields['ergebnis'])) {
        if ($rs->fields['ergebnis'] != 1) {
            $out['response']['status'] = -4;
            $out['response']['errors'] = array('errors' => "Es gab ein Problem beim Logout. Möglicherweise wurden Sie nicht korrekt ausgeloggt! </br>" . ($dbSyb->ErrorMsg()));

            print json_encode($out);
            return;
        } else {
            $_SESSION['finanzen'] = [];
            header("Location: http://$host$uri/login");
            $i = 0;

            while (!$rs->EOF) {

                $value['ergebnis'] = $rs->fields['ergebnis'];

                $i++;

                $rs->MoveNext();
            }

            $rs->Close();

            $out['response']['status'] = 0;
            $out['response']['errors'] = array();
            $out['response']['data'] = $value;

            print json_encode($out);
        }
    } else {
        $out['response']['status'] = -4;
        $out['response']['errors'] = array('errors' => "Es konnnte keine Logout-Rückmeldung ermittelt werden. Möglicherweise wurden Sie nicht korrekt ausgeloggt! </br>" . ($dbSyb->ErrorMsg()));

        print json_encode($out);
        return;
    }
} else {
    header("Location: http://$host$uri/login");
}
?>