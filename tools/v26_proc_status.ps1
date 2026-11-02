# v26 задача 7: показать живые eco-прогоны (команда целиком + PID + сколько CPU они сожгли)
# и состояние их логов/артефактов. Запуск скрыто: powershell -NoProfile -WindowStyle Hidden -File tools\v26_proc_status.ps1
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'v21_eco_run' }
Write-Output ("живых eco-процессов: " + @($procs).Count)
foreach ($p in $procs) {
  $cpu = try { [math]::Round((Get-Process -Id $p.ProcessId).CPU, 0) } catch { 0 }
  Write-Output ("PID " + $p.ProcessId + " | CPU " + $cpu + "s | " + $p.CommandLine)
}
$logs = Join-Path $root '09-Docs\out-dev-factory\logs-release-ready-2026-10-14'
foreach ($i in 1..5) {
  $o = Join-Path $logs ("eco-v26-s$i.out.log"); $e = Join-Path $logs ("eco-v26-s$i.err.log")
  $dir = Join-Path $root "09-Docs\out-dev-factory\eco-v26-s$i"
  $files = @(Get-ChildItem -LiteralPath $dir -File -ErrorAction SilentlyContinue | ForEach-Object { $_.Name + '(' + [math]::Round($_.Length/1kb,0) + 'kb)' })
  Write-Output ("s${i}: out=" + (Get-Item $o -ErrorAction SilentlyContinue).Length + "b err=" + (Get-Item $e -ErrorAction SilentlyContinue).Length + "b | артефакты: " + $(if ($files.Count) { $files -join ', ' } else { '—' }))
}
