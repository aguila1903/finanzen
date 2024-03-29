<?php

session_start();
require_once('conf.php');

$date = date("Y-m-d");
$out = array();
$update = "";

//file_put_contents('update.txt', 'Ich war hier');
// Functions
function logUpdate($log_file, $log) {
    file_put_contents($log_file, $log, FILE_APPEND);
}

function domainAvailable($strDomain) {
    $rCurlHandle = curl_init($strDomain);
    curl_setopt($rCurlHandle, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($rCurlHandle, CURLOPT_HEADER, TRUE);
    curl_setopt($rCurlHandle, CURLOPT_NOBODY, TRUE);
    curl_setopt($rCurlHandle, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($rCurlHandle,CURLOPT_SSL_VERIFYPEER, false);

    $strResponse = curl_exec($rCurlHandle);
//    file_put_contents("update.txt", print_r($rCurlHandle, true));

    curl_close($rCurlHandle);

    if (!$strResponse) {
        return FALSE;
    }
    return TRUE;
}

function url_check($url) {
    $urlheaders = @get_headers($url);
    file_put_contents("update.txt", print_r($urlheaders, true));
    return is_array($urlheaders) ? preg_match('/^HTTP\\/\\d+\\.\\d+\\s+2\\d\\d\\s+.*$/', $urlheaders[0]) : false;
}

;

function updateCheck($update_logs) {


    $update = shell_exec(PATH_GIT . "git pull -f");
    $date = date("Y-m-d H:i:s") . ": \n";
    if (trim($update) != "Already up to date." && $update !== null) {
        logUpdate($update_logs, "$date$update\n");
    } else {
        $update = "nope";
    }

    return $update;
//    exec('update.cmd');
}

if (isset($_POST["type"])) {
    $type = $_POST["type"];
    if (preg_match("/[automen]{4}/", $type) !== 1) {
        $type = "auto";
    }
} else {
    $type = "auto";
}

//Verzeichnisse und Pfade
$backup_file = PATH_BACKUPS . "$date.sql"; //Datei in dem die Backups geschrieben werden
$update_sql_new = __DIR__ . "\\sql_new\\sql.sql"; //Ordner in dem die aktualisierten sql Daten sind
$update_sql_old_dir = __DIR__ . "\\sql_old\\"; //Ordner in dem die aktualisierten sql Daten sind
$update_sql_old = __DIR__ . "\\sql_old\\sql.sql"; //Ordner in dem die frühere sql Daten sind
$update_logs_dir = __DIR__ . "\\log\\"; //Dateiname in dem die Logs gespeichert werden
$update_logs = __DIR__ . "\\log\\$date.sql"; //Dateiname in dem die Logs gespeichert werden
$sql_dump = PATH_MYSQL . "mysqldump.exe";
$sql_mysql = PATH_MYSQL . "mysql.exe";
$db_schema = "../db_schema.sql";

if (!is_dir($update_logs_dir)) {
    mkdir($update_logs_dir, 0777, true);
}

@copy("../db_create.sql", PATH_BACKUPS . "reset.sql");

//Git
if (domainAvailable('https://github.com/')) {
    $update = updateCheck($update_logs);
} else {
    $out['response']['status'] = 4;
    $out['response']['errors'] = array('Update konnte nicht durchgeführt werden da keine Internetverbindung besteht.');
    print json_encode($out);
    return;
}



if (is_file($update_sql_new)) {//Es befindet sich eine Datei im sql-update Ordner
    if (is_file($sql_mysql) && is_file($sql_dump)) { // die mysql-Tools konnten gefunden werden
        //Vor dem Update: Sichern der Datenbank
        $cmd_backup = "$sql_dump -u" . DB_USER . " -p" . DB_PW . " " . DB_NAME . " > $backup_file --routines ";
        $batch_backup = shell_exec($cmd_backup);

        //Laden der neuen Datenbank-Daten
        $cmd_update = "$sql_mysql -u" . DB_USER . " -p" . DB_PW . " " . DB_NAME . " --comments < $update_sql_new";
        $batch_update = shell_exec($cmd_update);
        logUpdate($update_logs, "DB UPDATE: $batch_update\n");

        if (!is_dir($update_sql_old_dir)) {
            mkdir($update_sql_old_dir, 0777, true);
        }
        rename($update_sql_new, $update_sql_old);

        // Speichern des DB-Schemas
//        $cmd_schema = "$sql_dump -u" . DB_USER . " -p" . DB_PW . " " . DB_NAME . " --no-data --routines > $db_schema";
//        $batch_schema = shell_exec($cmd_schema);
//        logUpdate($update_logs, "DB SCHEMA: $batch_schema\n");
    }
}

$text = "";

if ($update == "nope" && $type == "auto") {
    $out['response']['status'] = 1;
} elseif ($update == "nope" && $type == "menu") {
    $out['response']['status'] = 0;
    $update = "Keine neuen Updates vorhanden!";
} else {
    $out['response']['status'] = 0;
    $text = "<br /><br /><b>Es wurden Updates durchgeführt!</b><br />Mit dem Klicken auf OK wird die Seite neugestartet, damit die Updates wirksam werden.";
}
$out['response']['errors'] = array();
$out['response']['data'] = $update . $text;

print json_encode($out);
?>