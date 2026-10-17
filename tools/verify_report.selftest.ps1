# verify_report.selftest.ps1 — приёмка U45 (09A rev 14.10): плохие фикстуры FAIL с нужным кодом, хорошие — VERIFY OK.
# 7 случаев было (v13 §31) + 10 новых (V13 «ПРИСТУПАЮ», V14 «Файлы >500 строк», имя v14 и его варианты,
# три варианта последней строки, «ЦИКЛ k/3» не гейт).
# Генерирует свежие отчёты из tpl-*.md (подставляет реальный HEAD, dirty-файл, время, путь отчёта),
# прогоняет verify_report.ps1 на каждом и проверяет ожидаемый код FAIL/OK.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Continue'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $root
$env:GIT_TERMINAL_PROMPT = '0'

$fixDir = Join-Path $root 'tools\verify_report.fixtures'
$runDir = Join-Path $fixDir 'run'
New-Item -ItemType Directory -Force -Path $runDir | Out-Null

$now = Get-Date
$sha = (& git rev-parse --short HEAD).Trim()
# последний dirty-файл и его размер
$dirtyFile = Get-ChildItem '09-Docs\out-dev-factory\logs-release-ready-2026-10-14\dirty-*.txt' -ErrorAction SilentlyContinue |
             Sort-Object LastWriteTime -Descending | Select-Object -First 1
$dirtyName = $dirtyFile.Name
$dirtyTs = [regex]::Match($dirtyName, 'dirty-(\d{8}-\d{4})').Groups[1].Value
$dirtyN = (Get-Content -Encoding UTF8 $dirtyFile.FullName | Where-Object { $_.Trim() -ne '' }).Count

$NAME_LEGACY  = 'REPORT-TZ-RELEASE-READY-2026-10-14-v9-@TS@.md'
$NAME_V14     = 'REPORT-TZ-08-SPOR-release-ready-20261017-0905-v14-@TS@.md'
$NAME_V14_OLDV= 'REPORT-TZ-08-SPOR-release-ready-20261017-0905-v13-@TS@.md'
$NAME_V14_BADD= 'REPORT-TZ-08-SPOR-release-ready-20261016-0905-v14-@TS@.md'

function New-Report($tpl, $ts, $mtime, $nameTpl) {
  if (-not $nameTpl) { $nameTpl = $NAME_LEGACY }
  $name = $nameTpl.Replace('@TS@', $ts)
  $path = Join-Path $runDir $name
  $body = Get-Content -Encoding UTF8 (Join-Path $fixDir $tpl) -Raw
  $body = $body.Replace('{{SHA}}', $sha).Replace('{{TS}}', $ts).Replace('{{DIRTYTS}}', $dirtyTs)
  $body = $body.Replace('{{N}}', [string]$dirtyN).Replace('{{MINE}}', [string]$dirtyN).Replace('{{WIP}}', '0')
  $body = $body.Replace('{{DDMM}}', $now.ToString('dd.MM')).Replace('{{HHMM}}', $now.ToString('HH:mm'))
  $body = $body.Replace('{{PATH}}', (Join-Path $runDir $name))
  Set-Content -Encoding UTF8 -Path $path -Value $body
  if ($mtime) { (Get-Item $path).LastWriteTime = $mtime }
  return $path
}

$baseTs = $now.ToString('yyyyMMdd-HHmm')
$cases = @(
  # --- было (v13 §31): те же ожидаемые коды ---
  @{ tpl = 'tpl-bad-lastline.md';    expect = 'FAIL V2';        name = 'bad-lastline';    nm = $NAME_LEGACY },
  @{ tpl = 'tpl-bad-nopath.md';      expect = 'FAIL V3';        name = 'bad-nopath';      nm = $NAME_LEGACY },
  @{ tpl = 'tpl-bad-stop.md';        expect = 'FAIL V7';        name = 'bad-stop';        nm = $NAME_LEGACY },
  @{ tpl = 'tpl-bad-criticfile.md';  expect = 'FAIL V9';        name = 'bad-criticfile';  nm = $NAME_LEGACY },
  @{ tpl = 'tpl-bad-sha.md';         expect = 'FAIL V11';       name = 'bad-sha';         nm = $NAME_LEGACY },
  @{ tpl = 'tpl-bad-heartbeat.md';   expect = 'FAIL V6';        name = 'bad-heartbeat';   nm = $NAME_LEGACY; ageMin = 70 },
  @{ tpl = 'tpl-good.md';            expect = 'VERIFY OK';      name = 'good';            nm = $NAME_LEGACY },
  # --- новое (U45, 09A rev 14.10) ---
  @{ tpl = 'tpl-good-v14name.md';    expect = 'VERIFY OK';      name = 'good-v14name';    nm = $NAME_V14 },
  @{ tpl = 'tpl-inter-v14.md';       expect = 'VERIFY OK';      name = 'inter-v14';       nm = $NAME_V14 },
  @{ tpl = 'tpl-full-v14.md';        expect = 'VERIFY OK';      name = 'full-v14';        nm = $NAME_V14 },
  @{ tpl = 'tpl-cikl-v14.md';        expect = 'VERIFY OK';      name = 'cikl-v14';        nm = $NAME_V14 },
  @{ tpl = 'tpl-bad-firstline.md';   expect = 'FAIL V13';       name = 'bad-firstline';   nm = $NAME_V14 },
  @{ tpl = 'tpl-bad-tzpath.md';      expect = 'FAIL V13';       name = 'bad-tzpath';      nm = $NAME_V14 },
  @{ tpl = 'tpl-bad-500block.md';    expect = 'FAIL V14';       name = 'bad-500block';    nm = $NAME_V14 },
  @{ tpl = 'tpl-bad-500empty.md';    expect = 'FAIL V14';       name = 'bad-500empty';    nm = $NAME_V14 },
  @{ tpl = 'tpl-bad-v14name.md';     expect = 'FAIL V1';        name = 'bad-v14name-ver'; nm = $NAME_V14_OLDV },
  @{ tpl = 'tpl-bad-v14name.md';     expect = 'FAIL V1';        name = 'bad-v14name-date'; nm = $NAME_V14_BADD }
)

$bad = 0
foreach ($c in $cases) {
  $ts = if ($c.ageMin) { $now.AddMinutes(-[int]$c.ageMin).ToString('yyyyMMdd-HHmm') } else { $baseTs }
  $mt = if ($c.ageMin) { $now.AddMinutes(-[int]$c.ageMin) } else { $now }
  $path = New-Report $c.tpl $ts $mt $c.nm
  $out = & powershell -NoProfile -ExecutionPolicy Bypass -File tools\verify_report.ps1 -Report $path 2>&1
  # 'FAIL V1' не должен случайно совпасть с 'FAIL V13'/'FAIL V14'
  $rx = $c.expect; if ($rx -match '^FAIL V(\d+)$') { $rx = "FAIL V$($Matches[1])(?!\d)" }
  $hit = ($out | Where-Object { $_ -match $rx }).Count -gt 0
  $verdictLine = ($out | Select-Object -Last 1)
  if ($c.expect -eq 'VERIFY OK' -and $verdictLine -notmatch 'VERIFY OK') { $hit = $false }
  if ($hit) { Write-Output ("SELFTEST PASS {0,-17} ждали '{1}' — есть; итог: {2}" -f $c.name, $c.expect, $verdictLine) }
  else { Write-Output ("SELFTEST FAIL {0,-17} ждали '{1}', получено:`n{2}" -f $c.name, $c.expect, ($out -join "`n")); $bad++ }
}

# V1: сломанное имя файла
$wrong = Join-Path $runDir 'report-wrong-name.md'
Set-Content -Encoding UTF8 -Path $wrong -Value 'x'
$out = & powershell -NoProfile -ExecutionPolicy Bypass -File tools\verify_report.ps1 -Report $wrong 2>&1
if (($out | Where-Object { $_ -match 'FAIL V1' }).Count -gt 0) { Write-Output "SELFTEST PASS bad-name         ждали 'FAIL V1' — есть" }
else { Write-Output "SELFTEST FAIL bad-name (нет FAIL V1)`n$($out -join "`n")"; $bad++ }

# V1: файл не существует
$out = & powershell -NoProfile -ExecutionPolicy Bypass -File tools\verify_report.ps1 -Report 'tools\verify_report.fixtures\run\no-such.md' 2>&1
if (($out | Where-Object { $_ -match 'FAIL V1' }).Count -gt 0) { Write-Output "SELFTEST PASS bad-missing      ждали 'FAIL V1' — есть" }
else { Write-Output "SELFTEST FAIL bad-missing`n$($out -join "`n")"; $bad++ }

Write-Output ("SELFTEST done: {0} fails из {1} случаев" -f $bad, ($cases.Count + 2))
Pop-Location
if ($bad -eq 0) { exit 0 } else { exit 1 }
