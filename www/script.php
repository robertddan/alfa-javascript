<?php

$sFile = file_get_contents('../.assets/CAD_JPY.tmp', true);

$sPrices = json_encode(unserialize($sFile));

var_dump($sPrices);

return print $sPrices;
?>