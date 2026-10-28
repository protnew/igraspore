# X5 (ТЗ v15): пересборка AAB из рабочей копии канона и подпись ТОЛЬКО через sign-local.ps1.
# Ничего не удаляет: файлы перекрываются -Force, каталоги не чистятся.
# Запуск из корня: powershell -NoProfile -ExecutionPolicy Bypass -File 09-Docs\out-dev-factory\runs\v15-x5-20261028\x5-build.ps1
$ErrorActionPreference = 'Continue'
$root = 'C:\Obsidian\New\Projects\08-iGraSpore_V2'
$out = Join-Path $root '09-Docs\out-dev-factory\runs\v15-x5-20261028'
$log = Join-Path $out 'x5-build.log'
New-Item -ItemType Directory -Force -Path $out | Out-Null
function Say($m) { $line = (Get-Date).ToString('HH:mm:ss') + ' ' + $m; Add-Content -Path $log -Value $line -Encoding utf8; Write-Output $line }

Set-Location $root
$env:HTTP_PROXY = ''; $env:HTTPS_PROXY = ''; $env:ALL_PROXY = ''; $env:GIT_TERMINAL_PROMPT = '0'
'' | Set-Content -Path $log -Encoding utf8

# 0) провенанс: что именно уйдёт в сборку
Say ('HEAD ' + (& git rev-parse --short HEAD) + ' branch ' + (& git rev-parse --abbrev-ref HEAD))
& git status --porcelain | Set-Content -Path (Join-Path $out 'git-status-before-build.txt') -Encoding utf8
$canonDirty = @(& git status --porcelain -- .04-Src/js .04-Src/i18n index.html style.css v20_5.css manifest.json)
Say ('канон изменён (не закоммичено) файлов: ' + $canonDirty.Count)
foreach ($f in $canonDirty) { Say ('  WIP ' + $f) }

# 1) синхронизация канона в android public (включая i18n/wiki — прошлый скрипт её не копировал)
$pub = Join-Path $root '06-DevOps-and-Release\android\android\app\src\main\assets\public'
New-Item -ItemType Directory -Force -Path (Join-Path $pub 'js'), (Join-Path $pub 'i18n'), (Join-Path $pub 'i18n\wiki') | Out-Null
Copy-Item (Join-Path $root '.04-Src\js\*.js') (Join-Path $pub 'js') -Force
Copy-Item (Join-Path $root '.04-Src\i18n\*.json') (Join-Path $pub 'i18n') -Force
Copy-Item (Join-Path $root '.04-Src\i18n\wiki\*.json') (Join-Path $pub 'i18n\wiki') -Force
foreach ($f in 'index.html', 'style.css', 'v20_5.css', 'manifest.json') { Copy-Item (Join-Path $root $f) (Join-Path $pub $f) -Force }
Say 'канон скопирован в android public (js, i18n, i18n/wiki, index.html, style.css, v20_5.css, manifest.json)'

# 2) сборка bundleRelease (JDK 21)
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot'
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
Set-Location (Join-Path $root '06-DevOps-and-Release\android\android')
& .\gradlew.bat bundleRelease "-Dorg.gradle.java.home=$env:JAVA_HOME" *> (Join-Path $out 'gradle-bundleRelease.log')
Say ('GRADLE_EXIT ' + $LASTEXITCODE)
Set-Location $root

$aab = Join-Path $root '06-DevOps-and-Release\android\android\app\build\outputs\bundle\release\app-release.aab'
if (-not (Test-Path $aab)) { Say 'AAB_MISSING'; exit 3 }
Say ('AAB собран: ' + (Get-Item $aab).Length + ' байт')
$preHash = (Get-FileHash $aab -Algorithm SHA256).Hash.ToLower()
Say ('AAB sha256 ДО подписи: ' + $preHash)

# 3) подпись — только sign-local.ps1 (пароли в памяти процесса, ничего не печатается)
$signOut = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root '06-DevOps-and-Release\android\sign-local.ps1') 2>&1
$signOut | Set-Content -Path (Join-Path $out 'sign-output.txt') -Encoding utf8
Say ('SIGN_EXIT ' + $LASTEXITCODE)
$signOut | ForEach-Object { if ($_ -notmatch 'Pass|пароль') { Say ('  ' + $_) } }

# 4) проверка подписи и хеш
$v = & jarsigner -verify $aab 2>&1
$v | Set-Content -Path (Join-Path $out 'jarsigner-verify.txt') -Encoding utf8
$verified = if (($v -join "`n") -match 'jar verified\.') { 'jar verified.' } else { 'НЕ подтверждено' }
Say ('JARSIGNER: ' + $verified)
$postHash = (Get-FileHash $aab -Algorithm SHA256).Hash.ToLower()
Say ('AAB sha256 ПОСЛЕ подписи: ' + $postHash)
Say ('AAB размер: ' + (Get-Item $aab).Length)

# 5) машинный итог для отчёта
$androidCommits = @(& git log --since='2026-10-24T19:02:00' --format='%h %s' -- 06-DevOps-and-Release/android)
$top100 = if ($androidCommits.Count) { 'Android-файлы менялись: ' + ($androidCommits -join '; ') } else { 'Android-исходники (06-DevOps-and-Release/android) не менялись с прошлой сборки 24.10 19:02; менялись веб-исходники (js/i18n) — 22 коммита' }
$obj = [ordered]@{
  status     = 'собран и подписан ' + (Get-Date).ToString('dd.MM HH:mm')
  sha256     = $postHash
  size       = [string](Get-Item $aab).Length
  verified   = $verified
  built      = 'из рабочей копии: HEAD ' + (& git rev-parse --short HEAD) + ' + незакоммиченный WIP канона (' + $canonDirty.Count + ' файлов)'
  android    = $top100
  proof      = '`jarsigner -verify` → ' + $verified + '; sha256 ' + $postHash + '; лог `09-Docs\out-dev-factory\runs\v15-x5-20261028\` (gradle-bundleRelease.log, sign-output.txt, jarsigner-verify.txt)'
}
$obj | ConvertTo-Json | Set-Content -Path (Join-Path $out 'aab.json') -Encoding utf8
Say 'aab.json записан'
