# verify_report.selftest.ps1 — §31 приёмка: 6 плохих фикстур FAIL с нужным кодом + 1 хорошая OK.
# Генерирует свежие отчёты из tpl-*.md (подставляет реальный HEAD, dirty-файл, время),
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

function New-Report($tpl, $ts, $mtime) {
  $body = Get-Content -Encoding UTF8 (Join-Path $fixDir $tpl) -Raw
  $body = $body.Replace('{{SHA}}', $sha).Replace('{{TS}}', $ts).Replace('{{DIRTYTS}}', $dirtyTs)
  $body = $body.Replace('{{N}}', [string]$dirtyN).Replace('{{MINE}}', [string]$dirtyN).Replace('{{WIP}}', '0')
  $body = $body.Replace('{{DDMM}}', $now.ToString('dd.MM')).Replace('{{HHMM}}', $now.ToString('HH:mm'))
  $name = "REPORT-TZ-RELEASE-READY-2026-10-14-v9-$ts.md"
  $path = Join-Path $runDir $name
  Set-Content -Encoding UTF8 -Path $path -Value $body
  if ($mtime) { (Get-Item $path).LastWriteTime = $mtime }
  return $path
}

$baseTs = $now.ToString('yyyyMMdd-HHmm')
$i = 0
$cases = @(
  @{ tpl = 'tpl-bad-lastline.md';    expect = 'FAIL V2'; name = 'bad-lastline' },
  @{ tpl = 'tpl-bad-nopath.md';      expect = 'FAIL V3'; name = 'bad-nopath' },
  @{ tpl = 'tpl-bad-stop.md';        expect = 'FAIL V7'; name = 'bad-stop' },
  @{ tpl = 'tpl-bad-criticfile.md';  expect = 'FAIL V9'; name = 'bad-criticfile' },
  @{ tpl = 'tpl-bad-sha.md';         expect = 'FAIL V11'; name = 'bad-sha' },
  @{ tpl = 'tpl-bad-heartbeat.md';   expect = 'FAIL V6'; name = 'bad-heartbeat'; ageMin = 70 },
  @{ tpl = 'tpl-good.md';            expect = 'VERIFY OK'; name = 'good' }
)

$bad = 0
foreach ($c in $cases) {
  $i++
  $ts = if ($c.ageMin) { $now.AddMinutes(-[int]$c.ageMin).ToString('yyyyMMdd-HHmm') } else { $baseTs }
  $mt = if ($c.ageMin) { $now.AddMinutes(-[int]$c.ageMin) } else { $now }
  $path = New-Report $c.tpl $ts $mt
  # для bad-name отдельный прогон ниже; здесь нормальное имя
  $out = & powershell -NoProfile -ExecutionPolicy Bypass -File tools\verify_report.ps1 -Report $path 2>&1
  $hit = ($out | Where-Object { $_ -match [regex]::Escape($c.expect) }).Count -gt 0
  $verdictLine = ($out | Select-Object -Last 1)
  if ($hit) { Write-Output ("SELFTEST PASS {0,-16} ждали '{1}' — есть; итог: {2}" -f $c.name, $c.expect, $verdictLine) }
  else { Write-Output ("SELFTEST FAIL {0,-16} ждали '{1}', получено:`n{2}" -f $c.name, $c.expect, ($out -join "`n")); $bad++ }
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

Write-Output ("SELFTEST done: {0} fails" -f $bad)
Pop-Location
if ($bad -eq 0) { exit 0 } else { exit 1 }
