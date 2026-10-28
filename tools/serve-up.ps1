# serve-up.ps1 — поднять локальные стенды 8792 (игра) и 8795 (QA) скрытно, без окон на экране владельца.
# Запуск из корня: powershell -NoProfile -ExecutionPolicy Bypass -File tools\serve-up.ps1
# Уже живой порт не трогается (сначала GET, потом старт).
$ErrorActionPreference = 'Continue'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
foreach ($p in 8792, 8795) {
  $alive = $false
  try { $null = Invoke-WebRequest -Uri "http://127.0.0.1:$p/index.html" -UseBasicParsing -TimeoutSec 3; $alive = $true } catch {}
  if ($alive) { Write-Output "port $p уже жив (GET 200) — не трогаем"; continue }
  Start-Process -FilePath 'node' -ArgumentList "`"$root\tools\serve-static.mjs`"", "$p" -WindowStyle Hidden `
    -WorkingDirectory $root -RedirectStandardOutput "$root\09-Docs\out-dev-factory\logs-release-ready-2026-10-14\serve-$p.out.log" `
    -RedirectStandardError "$root\09-Docs\out-dev-factory\logs-release-ready-2026-10-14\serve-$p.err.log"
  Write-Output "port ${p}: node tools\serve-static.mjs ${p} запущен скрытно"
}
Start-Sleep -Seconds 3
foreach ($p in 8792, 8795) {
  $code = try { (Invoke-WebRequest -Uri "http://127.0.0.1:$p/index.html" -UseBasicParsing -TimeoutSec 8).StatusCode } catch { 'ERR' }
  Write-Output "проверка: port $p GET /index.html => $code"
}
