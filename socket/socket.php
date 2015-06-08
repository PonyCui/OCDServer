<?php

//@see https://github.com/reactphp/event-loop
$runloop = null;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . '/Ratchet/vendor/autoload.php';
require __DIR__ . '/../index.php';
require __DIR__ . '/../application/controllers/pubsub.php';

$app = new Ratchet\App('localhost', 9090);
$app->route('/pubsub', PubSub::instance('WebSocket'), array('*'));
$app->run();
