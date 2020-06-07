<?php

include 'wechselkursLive.php';

$eur = getLiveEx();

print json_encode("1 Euro = " . number_format($eur, 4,",","")." TL");

?>