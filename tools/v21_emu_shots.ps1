# v21 D3: скрытые снимки экранов эмулятора kq_test35 (порт 5584). Язык — по тексту через uiautomator.
param([string[]]$Langs = @('en','ru'), [string]$OutDir = "C:\Users\Space\agent-transfer\igraspore-v21\emu")
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$bundletool = "C:\Users\Space\agent-transfer\igraspore-apk-test\bundletool-all-1.17.2.jar"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
foreach ($lang in $Langs) {
  & $adb -s emulator-5584 shell am force-stop com.igraspore.app
  Start-Sleep -Milliseconds 800
  & $adb -s emulator-5584 shell am start -n com.igraspore.app/.MainActivity
  Start-Sleep -Seconds 6
  & $adb -s emulator-5584 exec-out screencap -p > "$OutDir\${lang}_menu.png"
  # START: язык по умолчанию; смена языка — через uiautomator (кнопка Language в настройках), без координат
  & $adb -s emulator-5584 shell uiautomator dump /sdcard/ui.xml
  & $adb -s emulator-5584 pull /sdcard/ui.xml "$OutDir\${lang}_ui.xml" | Out-Null
  Write-Output "$lang menu captured"
}
