<?php
require_once('conf.php');
$path = str_replace("/", "\\", PATH_BACKUPS);
$backups = scandir($path);
$i = 2;
$ii = 0;
$data = array();
$out = array();
chdir($path);

while ($i < count($backups)) {
    if (substr($backups[$i], -3) == "sql" ) {
        $data[$ii]["dateiname"] = $backups[$i];
        $data[$ii]["size"] = filesize($backups[$i]) . " Bytes";
        $data[$ii]["date"] = date("Y-m-d H:i:s", filemtime($backups[$i]));
        $ii++;
    }
    $i++;
}

print json_encode($data);


?>