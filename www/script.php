<?php

header('Content-Type: application/json; charset=utf-8');
header("Content-length: 2119613");

// EUR_USD - 21410997
// CAD_JPY - 21410997
// EUR_GBP - 2119613

$sPrices = file_get_contents('./prices/EUR_GBP.json', true);
return print $sPrices; //


$aSticks = json_decode($sPrices);
var_dump(count($aSticks));

$aSaved = array();
foreach ($aSticks as $k => $aStick) {
	if ($k < 2000) continue;
	if ($k > 17000) break;
	array_push($aSaved, $aStick);
}

file_put_contents('prices/EUR_GBP.json', json_encode($aSaved));
return true;

?>