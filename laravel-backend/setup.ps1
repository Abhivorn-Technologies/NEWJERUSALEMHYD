# setup.ps1 - New Jerusalem Ministries Laravel Backend Setup
# ============================================================
# This script installs PHP 8.3 and Composer locally into the
# laravel-backend folder, then runs composer install.
#
# HOW TO RUN:
#   1. Open PowerShell (no Admin needed)
#   2. cd d:\NEWJERUSALEMHYD\laravel-backend
#   3. Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#   4. .\setup.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$laravelDir = $PSScriptRoot

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  New Jerusalem Ministries - Laravel Backend Setup" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# ─── Step 1: Check / Install PHP ─────────────────────────────
$phpExe = $null

# Try system PHP first
try {
    $ver = & php -v 2>&1
    if ($ver -match "PHP (\d+)\.(\d+)") {
        $major = [int]$Matches[1]
        $minor = [int]$Matches[2]
        if ($major -ge 8 -and $minor -ge 2) {
            $phpExe = "php"
            Write-Host "[OK] System PHP found: $($ver[0])" -ForegroundColor Green
        } else {
            Write-Host "[WARN] System PHP is too old ($($ver[0])). Installing PHP 8.3 locally..." -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "[INFO] PHP not found in PATH. Installing PHP 8.3 locally..." -ForegroundColor Yellow
}

if (-not $phpExe) {
    $phpDir    = "$laravelDir\php-local"
    # Fetch the latest PHP 8.3 NTS x64 zip URL from the official releases page
    $releasePage = Invoke-WebRequest -Uri "https://windows.php.net/downloads/releases/" -UseBasicParsing
    $phpZipName  = ($releasePage.Links.href | Where-Object { $_ -match "php-8\.3\.\d+-nts-Win32-vs16-x64\.zip$" } | Select-Object -First 1)
    if (-not $phpZipName) {
        # Fallback: try vs17 (newer VS runtime)
        $phpZipName = ($releasePage.Links.href | Where-Object { $_ -match "php-8\.3\.\d+-nts-Win32-vs17-x64\.zip$" } | Select-Object -First 1)
    }
    if (-not $phpZipName) {
        Write-Host "[ERROR] Could not find a PHP 8.3 NTS x64 build on windows.php.net/downloads/releases/" -ForegroundColor Red
        exit 1
    }
    $phpZipUrl = "https://windows.php.net/downloads/releases/" + $phpZipName.TrimStart('/')
    Write-Host "[INFO] Found PHP build: $phpZipUrl" -ForegroundColor Cyan
    $phpZip    = "$laravelDir\php-local.zip"

    if (-not (Test-Path "$phpDir\php.exe")) {
        Write-Host "Downloading PHP 8.3 (~27 MB)..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $phpZipUrl -OutFile $phpZip -UseBasicParsing
        Write-Host "Extracting..." -ForegroundColor Yellow
        Expand-Archive -Path $phpZip -DestinationPath $phpDir -Force
        Remove-Item $phpZip
    }

    # Configure php.ini -- always regenerate fresh from development template
    $iniSrc  = "$phpDir\php.ini-development"
    $iniDest = "$phpDir\php.ini"
    Copy-Item $iniSrc $iniDest -Force

    $ini = Get-Content $iniDest -Raw

    # CRITICAL: set absolute extension_dir so PHP finds its own extensions.
    # The default php.ini-development has it commented out with a relative path.
    # PHP reads ini top-to-bottom; later values override earlier ones, so we
    # simply APPEND the correct absolute path at the end of the file.
    $extDir = ($phpDir + "\ext") -replace "\\", "/"

    # Enable required extensions (uncomment them)
    $ini = $ini -replace ';extension=pdo_pgsql',   'extension=pdo_pgsql'
    $ini = $ini -replace ';extension=pgsql',        'extension=pgsql'
    $ini = $ini -replace ';extension=mbstring',     'extension=mbstring'
    $ini = $ini -replace ';extension=openssl',      'extension=openssl'
    $ini = $ini -replace ';extension=fileinfo',     'extension=fileinfo'
    $ini = $ini -replace ';extension=gd',           'extension=gd'
    $ini = $ini -replace ';extension=curl',         'extension=curl'
    $ini = $ini -replace ';extension=exif',         'extension=exif'
    $ini = $ini -replace ';extension=intl',         'extension=intl'
    $ini = $ini -replace ';extension=zip',          'extension=zip'
    Set-Content $iniDest $ini -Encoding UTF8

    # Append extension_dir at end of file (overrides any earlier commented setting)
    Add-Content $iniDest "`nextension_dir = `"$extDir`"" -Encoding UTF8

    Write-Host "[OK] PHP 8.3 installed at: $phpDir" -ForegroundColor Green
    $phpExe = "$phpDir\php.exe"

    # Quick sanity check
    $extCheck = (& $phpExe -r "echo extension_loaded('openssl') ? 'ok' : 'fail';" 2>&1) -join ''
    if ($extCheck -match 'ok') {
        Write-Host "[OK] Extensions verified (openssl loaded)." -ForegroundColor Green
    } else {
        Write-Host "[WARN] openssl check returned: $extCheck" -ForegroundColor Yellow
    }
}

# ─── Step 2: Check / Install Composer ────────────────────────
$composerCmd = $null

try {
    $cv = & composer -V 2>&1
    $composerCmd = "composer"
    Write-Host "[OK] System Composer found: $($cv[0])" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Composer not found. Installing composer.phar locally..." -ForegroundColor Yellow
    $composerPhar = "$laravelDir\composer.phar"

    # Always re-download if phar is missing or previous run failed
    if (-not (Test-Path $composerPhar)) {
        $setupPHP = "$laravelDir\composer-setup.php"
        Invoke-WebRequest -Uri "https://getcomposer.org/installer" -OutFile $setupPHP -UseBasicParsing
        & $phpExe $setupPHP --install-dir="$laravelDir" --filename=composer.phar 2>&1 | Write-Host
        Remove-Item $setupPHP -ErrorAction SilentlyContinue
    }

    if (-not (Test-Path $composerPhar)) {
        Write-Host "[ERROR] composer.phar was not created. Check PHP extensions above." -ForegroundColor Red
        Write-Host "        Tip: run  & '$phpExe' -m  to list loaded modules." -ForegroundColor Yellow
        exit 1
    }

    $composerCmd = "$phpExe `"$composerPhar`""
    Write-Host "[OK] Composer installed as composer.phar" -ForegroundColor Green
}

# ─── Step 3: Install Laravel dependencies ─────────────────────
Write-Host ""
Write-Host "Installing Laravel packages (this may take 2-4 minutes)..." -ForegroundColor Yellow
Set-Location $laravelDir

if ($composerCmd -eq "composer") {
    & composer install --no-security-blocking --optimize-autoloader
} else {
    Invoke-Expression "& $composerCmd install --no-security-blocking --optimize-autoloader"
}

# Abort if vendor/ was not created (composer silently failed)
if (-not (Test-Path "$laravelDir\vendor\autoload.php")) {
    Write-Host "[ERROR] composer install failed -- vendor/autoload.php not found." -ForegroundColor Red
    Write-Host "        Check the output above for errors." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Packages installed." -ForegroundColor Green

# ─── Step 4: Generate APP_KEY ─────────────────────────────────
Write-Host ""
Write-Host "Generating application key..." -ForegroundColor Yellow
if ($phpExe -eq "php") {
    & php artisan key:generate --force
} else {
    & $phpExe artisan key:generate --force
}
Write-Host "[OK] APP_KEY generated and written to .env" -ForegroundColor Green

# ─── Step 5: Create storage directories ───────────────────────
Write-Host ""
Write-Host "Creating required storage directories..." -ForegroundColor Yellow
$dirs = @(
    "storage\app",
    "storage\framework\cache\data",
    "storage\framework\sessions",
    "storage\framework\views",
    "storage\logs",
    "bootstrap\cache"
)
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path "$laravelDir\$d" | Out-Null
}
Write-Host "[OK] Storage directories ready." -ForegroundColor Green

# ─── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  Setup complete! Laravel backend is ready." -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Stop the Django backend (Ctrl+C in its terminal)" -ForegroundColor White
Write-Host "  2. Start Laravel on port 8000:" -ForegroundColor White
if ($phpExe -eq "php") {
    Write-Host "       php artisan serve --port=8000" -ForegroundColor Yellow
} else {
    Write-Host "       $phpExe artisan serve --port=8000" -ForegroundColor Yellow
}
Write-Host "  3. Open the admin panel or frontend - they will" -ForegroundColor White
Write-Host "     automatically connect to Laravel." -ForegroundColor White
Write-Host ""
Write-Host "  The existing admin tokens still work!" -ForegroundColor Green
Write-Host "  No re-login required." -ForegroundColor Green
Write-Host ""
