<?php
require __DIR__.'/vendor/autoload.php';

$pw = 'admin123';
$hash = make_django_password($pw);
echo "Hash: $hash\n";
$verify = verify_django_password($pw, $hash);
echo "Verify: " . var_export($verify, true) . "\n";
