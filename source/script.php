<?php
//ob_end_clean();
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
//header('Connection: keep-alive');
while (true) {

    //echo "retry: 1000" . PHP_EOL;
    echo 'id: ' . uniqid() . PHP_EOL;
    echo 'data: ' . date("h:i:s", time()) . PHP_EOL;
    echo PHP_EOL;
    //ob_flush();
    //flush();

    sleep(1);
}