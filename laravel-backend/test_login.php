<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$req = Illuminate\Http\Request::create('/api-token-auth/', 'POST', ['username'=>'admin', 'password'=>'admin123']);
$ctrl = app()->make(App\Http\Controllers\AuthController::class);
echo $ctrl->login($req)->getContent();
