# v26 задача 7: остановка МОИХ длинных eco-прогонов (запускались в этой сессии) и их headless-браузеров.
# Скрипт сначала печатает, что будет убито; убивает только node с v21_eco_run и chrome-детей этих node.
# Usage: powershell -NoProfile -WindowStyle Hidden -File tools\v26_eco_stop.ps1 [-Kill]
param([switch]$Kill)
$nodes = Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'v21_eco_run' }
$ids = @($nodes | ForEach-Object { $_.ProcessId })
Write-Output ("node eco-прогонов: " + $ids.Count + " → PID " + ($ids -join ', '))
$chromes = @(Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $ids -contains $_.ParentProcessId })
Write-Output ("их chrome-детей: " + $chromes.Count)
foreach ($c in $chromes) { Write-Output ("  chrome PID " + $c.ProcessId + " parent " + $c.ParentProcessId) }
if (-not $Kill) { Write-Output 'режим сухого прогона: добавь -Kill чтобы остановить'; exit 0 }
foreach ($c in $chromes) { Stop-Process -Id $c.ProcessId -Force -ErrorAction SilentlyContinue }
foreach ($n in $nodes) { Stop-Process -Id $n.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2
$left = @(Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'v21_eco_run' })
Write-Output ('после остановки живых eco-прогонов: ' + $left.Count)
