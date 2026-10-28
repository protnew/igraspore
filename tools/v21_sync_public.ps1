# v21 D1: синхронизация канона в android public (РЕАЛЬНЫЙ лэйаут приложения: public\04-Src\js, public\i18n, public\04-Src\fonts).
# v21 fix (критики 2+5): прежняя версия писала в public\js и public\i18n от корня — мёртвые копии,
# которые v21_hash_full ошибочно сверял вместо реальных файлов приложения.
$ErrorActionPreference = 'Stop'
$root = "C:\Obsidian\New\Projects\08-iGraSpore_V2"
$pub = "$root\06-DevOps-and-Release\android\android\app\src\main\assets\public"
New-Item -ItemType Directory -Force -Path "$pub\04-Src\js", "$pub\i18n", "$pub\04-Src\fonts" | Out-Null
Copy-Item "$root\.04-Src\js\*.js" "$pub\04-Src\js\" -Force
Copy-Item "$root\.04-Src\i18n\*.json" "$pub\i18n\" -Force
if (Test-Path "$root\.04-Src\i18n\wiki") { New-Item -ItemType Directory -Force -Path "$pub\i18n\wiki" | Out-Null; Copy-Item "$root\.04-Src\i18n\wiki\*.json" "$pub\i18n\wiki\" -Force }
if (Test-Path "$root\.04-Src\fonts") { Copy-Item "$root\.04-Src\fonts\*" "$pub\04-Src\fonts\" -Force }
Copy-Item "$root\index.html" "$pub\index.html" -Force
Copy-Item "$root\style.css" "$pub\style.css" -Force
Copy-Item "$root\v20_5.css" "$pub\v20_5.css" -Force
# мёртвые копии от старой версии скрипта (не читаются приложением, но раздувают APK)
if (Test-Path "$pub\js") { $arch="$root\.10-Archive"; New-Item -ItemType Directory -Force -Path $arch | Out-Null; Move-Item "$pub\js" "$arch\public-js-stray-$(Get-Date -Format yyyyMMdd-HHmmss)" -Force }
Write-Output "public synced from canon (real layout: 04-Src/js, i18n, fonts)"
