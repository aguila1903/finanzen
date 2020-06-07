<?php
require_once('conf.php');

$data = array();
$out = array();


$path = str_replace("/", "\\", PATH_BACKUPS);
$mysql = str_replace("/", "\\", PATH_MYSQL);
$datum = date("Ymd_His");

$dateiname = $datum;


if (is_dir($path) != 1) {
    mkdir($path, true);
}


chdir($path);

$batch = "@echo off\n".

$mysql."mysqldump.exe -u".DB_USER. " -p".DB_PW." ". DB_NAME . " > " . $dateiname . ".sql --routines
set err=%errorlevel%\n 

REM set /a ergebnis = %err%
REM set ergebnis = %err%
REM echo %ergebnis%
echo %err%";


$path_parts = pathinfo($path.$dateiname);
$filename = $path_parts['filename'];
file_put_contents("$path$filename.bat", $batch);
$bathFileRun = "$path$filename.bat";


$output = exec($bathFileRun);
// exec($bathFileRun, $output);

if ($output == "0") {
    $bk_file = file_get_contents($path . $dateiname . ".sql");
    file_put_contents($path . $dateiname . ".sql", $bk_file);  
    $data["rueckmeldung"] = $path . $dateiname . ".sql";
} else {

    // unlink("$path$dateiname.sql");    

    $out['response']['data'] = array();
    $out['response']['status'] = -99;
    $out['response']['errors'] = "Fehler bei der Sicherung: " . $output;

    print json_encode($out);

    return;
}

unlink("$path$filename.bat");


$out['response']['status'] = 0;
$out['response']['errors'] = array();
$out['response']['data'] = $data;

print json_encode($out);
?>