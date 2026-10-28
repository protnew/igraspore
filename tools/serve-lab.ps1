# serve-lab.ps1 — поднять локальный лаб-стенд 8793 (wrangler pages dev .04-Src\dist-lab) скрытно.
# Живой порт не трогает. Запуск из корня: powershell -NoProfile -ExecutionPolicy Bypass -File tools\serve-lab.ps1
$ErrorActionPreference = 'Continue'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$alive = $false
try { $null = Invoke-WebRequest -Uri 'http://127.0.0.1:8793/lab/tests.html' -UseBasicParsing -TimeoutSec 3; $alive = $true } catch {}
if ($alive) { Write-Output 'порт 8793 уже жив — не трогаем'; exit 0 }
$logDir = Join-Path $root '09-Docs\out-dev-factory\logs-release-ready-2026-10-14'
# cf-wrangler в этом проекте — шим с подкомандами dev|build, поэтому лаб отдаём тем же статик-сервером,
# что и стенды 8792/8795: он умеет служить любой корень, а лабу нужен только раздавать файлы.
Start-Process -FilePath 'node' -ArgumentList "`"$root\tools\serve-static.mjs`"", '8793', "`"$root\.04-Src\dist-lab`"" `
  -WindowStyle Hidden -WorkingDirectory $root `
  -RedirectStandardOutput (Join-Path $logDir 'serve-8793.out.log') -RedirectStandardError (Join-Path $logDir 'serve-8793.err.log')
Write-Output 'лаб 8793: статик-сервер запущен скрытно (корень .04-Src\dist-lab)'
Start-Sleep -Seconds 8
$code = try { (Invoke-WebRequest -Uri 'http://127.0.0.1:8793/lab/tests.html' -UseBasicParsing -TimeoutSec 10).StatusCode } catch { 'ERR' }
Write-Output "проверка: port 8793 GET /lab/tests.html => $code"
