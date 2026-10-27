# v21 E: чек-лист прода (E1-E7) — сбор фактов
$root = "C:\Obsidian\New\Projects\08-iGraSpore_V2"
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
Write-Output "=== E2 saves ==="
& $adb -s emulator-5584 shell "run-as com.igraspore.app ls /data/data/com.igraspore.app/files 2>/dev/null" 2>$null
Write-Output "=== E4 console errors (logcat FATAL) ==="
& $adb -s emulator-5584 logcat -d -b crash 2>$null | Select-String "FATAL" | Select-Object -First 3
Write-Output "=== E6 targetSdk ==="
Select-String -Path "$root\06-DevOps-and-Release\android\android\app\build.gradle" -Pattern "targetSdk|versionCode|versionName" | ForEach-Object { $_.Line.Trim() }
Write-Output "=== E7 global error handler ==="
Select-String -Path "$root\.04-Src\js\igs_v20.js" -Pattern "addEventListener\('error'|onerror" | Select-Object -First 2
