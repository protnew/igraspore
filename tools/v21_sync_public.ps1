# v21 D1: синхронизация канона (.04-Src/js, i18n, корневые html/css) в android public.
$ErrorActionPreference = 'Stop'
$root = "C:\Obsidian\New\Projects\08-iGraSpore_V2"
$pub = "$root\06-DevOps-and-Release\android\android\app\src\main\assets\public"
New-Item -ItemType Directory -Force -Path "$pub\js", "$pub\i18n" | Out-Null
Copy-Item "$root\.04-Src\js\*.js" "$pub\js\" -Force
Copy-Item "$root\.04-Src\i18n\*.json" "$pub\i18n\" -Force
Copy-Item "$root\index.html" "$pub\index.html" -Force
Copy-Item "$root\style.css" "$pub\style.css" -Force
Copy-Item "$root\v20_5.css" "$pub\v20_5.css" -Force
Write-Output "public synced from canon"
