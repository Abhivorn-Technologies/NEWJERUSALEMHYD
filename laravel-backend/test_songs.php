<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$t = microtime(true);
$req = Illuminate\Http\Request::create('/api/songs', 'GET');
$res = $kernel->handle($req);
$time = microtime(true) - $t;

$size = strlen($res->getContent()) / 1024 / 1024;
echo "Time: {$time}s\n";
echo "Size: {$size}MB\n";
echo "Status: {$res->getStatusCode()}\n";
