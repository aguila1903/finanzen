<?php

require_once('conf.php');
$out = array();
$data = array();


if (isset($_POST["dateiname"])) {
    $dateiname = ($_POST["dateiname"]);
} else {

    $out['response']['status'] = -4;
    $out['response']['errors'] = array('errors' => "Wo isn der Dateiname?");

    return;
    
//    $dateiname = "2019-02-16.sql";
}

$path = str_replace("/", "\\", PATH_BACKUPS);
$mysql = str_replace("/", "\\", PATH_MYSQL);

//file_put_contents("LoadBackup.txt", $path);

if (is_file($path . $dateiname) != 1) {

    $out['response']['data'] = array();
    $out['response']['status'] = -66;
    $out['response']['errors'] = "Dateiname existiert nicht!";

    print json_encode($out);

    return;
}


//$datum = getdate();
//$dateiname = $datum["year"]."-".$datum["mon"]."-".$datum["mday"].".bak";

chdir($path);

$batch = "@echo off\n".

$mysql."mysql.exe -u".DB_USER. " -p".DB_PW." ". DB_NAME . " --comments <  $dateiname
set err=%errorlevel% 

echo %err%";

$path_parts = pathinfo($path.$dateiname);
$filename = $path_parts['filename'];

file_put_contents("$filename.bat", $batch);

$bathFileRun = "$filename.bat";

$output = exec($bathFileRun);


if ($output == 0) {
    $data["rueckmeldung"] = $path . $dateiname;
} else {

//    unlink("$path$dateiname.sql");    

    $out['response']['data'] = array();
    $out['response']['status'] = -99;
    $out['response']['errors'] = "Fehler in der Matrix!";

    print json_encode($out);

    return;
}

unlink("$path$filename.bat");

$out['response']['status'] = 0;
$out['response']['errors'] = array();
$out['response']['data'] = $data;

print json_encode($out);
?>