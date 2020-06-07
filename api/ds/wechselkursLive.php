<?php

function getLiveEx() {
    $endpoint = 'live';
    $access_key = 'a52cb8daa418a644dc360735b8db232d';
    $currencies = 'EUR,TRY';

    $ch = curl_init('http://apilayer.net/api/' . $endpoint . '?access_key=' . $access_key . '&currencies=' . $currencies . '');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $json = curl_exec($ch);
    curl_close($ch);

    $exchangeRates = json_decode($json, true);

    $euro = $exchangeRates['quotes']['USDEUR'];
    $lira = $exchangeRates['quotes']['USDTRY'];

    $convert = $lira / $euro;

    return $convert;
}

getLiveEx();
?>