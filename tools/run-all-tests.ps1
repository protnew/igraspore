# run-all-tests.ps1 — TZ v9 §49.1: единый прогон всех проверок.
# Пишет 09-Docs\test-runs\results-<YYYYMMDD-HHMM>.json + results-latest.json,
# логи — 09-Docs\test-runs\logs\<ts>\<suite>.log. Паролей/.secrets не читает.
# Usage: powershell -File tools\run-all-tests.ps1 [-Only vitest,i18n] [-NoE2E]
[CmdletBinding()]
param(
  [string[]]$Only = @(),
  [switch]$NoE2E,
  [switch]$ValidateOnly
)
$ErrorActionPreference = 'Continue'
$env:GIT_TERMINAL_PROMPT = '0'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $root
$ts    = Get-Date -Format 'yyyyMMdd-HHmm'
$nowIso = (Get-Date).ToUniversalTime().AddHours(3).ToString('yyyy-MM-dd HH:mm') + ' UTC+3'
$runsDir = Join-Path $root '09-Docs\test-runs'
$logDir  = Join-Path $runsDir "logs\$ts"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$commit = ''; $branch = ''; $dirty = 0
try { $commit = (git -C $root rev-parse --short HEAD 2>$null).Trim() } catch {}
try { $branch = (git -C $root rev-parse --abbrev-ref HEAD 2>$null).Trim() } catch {}
try { $dirty = @((git -C $root status --porcelain 2>$null)).Count } catch {}
$machine = $env:COMPUTERNAME
$startedAt = $nowIso
$suites = @()

if ($ValidateOnly) {
  $files = Get-ChildItem (Join-Path $runsDir 'results-*.json') -ErrorAction SilentlyContinue
  if (-not $files) { Write-Output 'нет results-*.json'; Pop-Location; exit 2 }
  $o = @()
  foreach ($f in $files) { $o += & node "$root\tools\validate-json.mjs" "$root\tools\test-run.schema.json" $f.FullName 2>&1 }
  $o | ForEach-Object { Write-Output $_ }
  Pop-Location
  if (($o -join "`n") -match 'FAIL') { exit 1 } else { exit 0 }
}

function Strip-Ansi($x) { return [string]$x -replace "$([char]27)\[[0-9;]*m", '' }
function New-Test($id, $file, $title, $status, $ms, $err) {
  $t = [ordered]@{ id = $id; file = $file; title = (Strip-Ansi $title); status = $status; ms = $ms }
  if ($err) { $t.error_first_line = (Strip-Ansi (($err -split "`n")[0])).Trim() }
  return $t
}
function Totals($tests) {
  $p = @($tests | Where-Object { $_.status -eq 'pass' }).Count
  $f = @($tests | Where-Object { $_.status -eq 'fail' }).Count
  $s = @($tests | Where-Object { $_.status -eq 'skipped' }).Count
  return [ordered]@{ pass = $p; fail = $f; skipped = $s; total = $tests.Count }
}
function Add-Suite($id, $name, $command, $tests, $exitCode, $ms) {
  $log = "09-Docs/test-runs/logs/$ts/$id.log"
  $script:suites += [ordered]@{
    id = $id; name = $name; command = $command; exit_code = $exitCode;
    ms = [int]$ms; log = $log; totals = (Totals $tests); tests = @($tests)
  }
}
$OnlySet = @($Only | ForEach-Object { $_ -split ',' } | Where-Object { $_ })
function Wants($id) { return ($OnlySet.Count -eq 0) -or ($OnlySet -contains $id) }

# ===================== vitest =====================
if (Wants 'vitest') {
  $cmd = 'node .04-Src\node_modules\vitest\vitest.mjs run --config vitest.config.js --root . --reporter=json --outputFile=<tmp>\vitest.json'
  $vj = Join-Path $logDir 'vitest.json'
  $sw = [Diagnostics.Stopwatch]::StartNew()
  $out = & node "$root\.04-Src\node_modules\vitest\vitest.mjs" run --config vitest.config.js --root . --reporter=json "--outputFile=$vj" 2>&1
  $sw.Stop(); $ec = $LASTEXITCODE
  $out | Out-File -Encoding utf8 (Join-Path $logDir 'vitest.log')
  $tests = @()
  if (Test-Path $vj) {
    try {
      $vr = Get-Content $vj -Raw | ConvertFrom-Json
      $i = 0
      foreach ($tr in $vr.testResults) {
        $rel = [IO.Path]::GetFileName($tr.name)
        foreach ($a in $tr.assertionResults) {
          $i++
          $st = switch ($a.status) { 'passed' { 'pass' } 'failed' { 'fail' } default { 'skipped' } }
          $err = if ($a.failureMessages) { ($a.failureMessages[0] -split "`n")[0] } else { '' }
          $tests += New-Test "vitest.$i" $rel $a.fullName $st ([double]($a.duration)) $err
        }
      }
    } catch { $tests += New-Test 'vitest.parse' 'vitest.json' 'parse reporter json' 'fail' 0 $_.Exception.Message }
  }
  if (-not $tests.Count) { $tests += New-Test 'vitest.run' 'vitest' 'suite did not produce results' 'fail' $sw.ElapsedMilliseconds (($out | Select-Object -First 3) -join ' | ') }
  Add-Suite 'vitest' 'Vitest unit' $cmd $tests $ec $sw.ElapsedMilliseconds
}

# ===================== qa_unit =====================
if (Wants 'qa_unit') {
  $cmd = 'node .04-Src\07-QA-and-Testing\qa_unit.js'
  $sw = [Diagnostics.Stopwatch]::StartNew()
  $out = & node "$root\.04-Src\07-QA-and-Testing\qa_unit.js" 2>&1
  $sw.Stop(); $ec = $LASTEXITCODE
  $out | Out-File -Encoding utf8 (Join-Path $logDir 'qa_unit.log')
  $tests = @(); $i = 0
  foreach ($ln in ($out -split "`n")) {
    if ($ln -match '([✅❌✓✗])\s*U(\d+):\s*(.+?)\s*(?:—\s*(.*))?$') {
      $i++
      $st = if ($Matches[1] -eq '✅' -or $Matches[1] -eq '✓') { 'pass' } else { 'fail' }
      $tests += New-Test "qa_unit.U$($Matches[2])" 'qa_unit.js' $Matches[3].Trim() $st 0 $Matches[4]
    }
  }
  if (-not $tests.Count) { $tests += New-Test 'qa_unit.run' 'qa_unit.js' 'suite output' ($(if ($ec -eq 0) {'pass'} else {'fail'})) $sw.ElapsedMilliseconds (($out | Select-Object -Last 1)) }
  Add-Suite 'qa_unit' 'QA unit (data)' $cmd $tests $ec $sw.ElapsedMilliseconds
}

# ===================== playwright =====================
if (Wants 'playwright') {
  $pw = Join-Path $root '.04-Src\node_modules\.bin\playwright.cmd'
  $cmd = "$pw test --config playwright.config.js"
  if ($NoE2E) {
    $tests = @(New-Test 'playwright.skip' 'e2e' 'skipped by -NoE2E' 'skipped' 0 '')
    Add-Suite 'playwright' 'Playwright e2e' $cmd $tests $null 0
  } else {
    $pj = Join-Path $root '.04-Src\07-QA-and-Testing\playwright-results.json'
    if (Test-Path $pj) { Remove-Item $pj -Force }
    $sw = [Diagnostics.Stopwatch]::StartNew()
    $out = & $pw test --config playwright.config.js 2>&1
    $sw.Stop(); $ec = $LASTEXITCODE
    $out | Out-File -Encoding utf8 (Join-Path $logDir 'playwright.log')
    $tests = @(); $i = 0
    if (Test-Path $pj) {
      try {
        $pr = Get-Content $pj -Raw | ConvertFrom-Json
        foreach ($su in $pr.suites) {
          foreach ($spc in $su.suites + $su) {
            foreach ($sp in $spc.specs) {
              foreach ($tt in $sp.tests) {
                $i++
                $r = $tt.results[0]
                $st = if ($tt.expectedStatus -eq 'skipped' -or $r.status -eq 'skipped') { 'skipped' }
                      elseif ($r.status -eq 'passed' -or $tt.status -eq 'expected') { 'pass' } else { 'fail' }
                $err = if ($r.error -and $r.error.message) { $r.error.message } else { '' }
                $tests += New-Test "playwright.$i" $sp.file $sp.title $st ([double]($r.duration)) $err
              }
            }
          }
        }
      } catch { $tests += New-Test 'playwright.parse' 'results json' 'parse' 'fail' 0 $_.Exception.Message }
    }
    if (-not $tests.Count) { $tests += New-Test 'playwright.run' 'e2e' 'suite did not produce results' 'fail' $sw.ElapsedMilliseconds (($out | Select-Object -First 3) -join ' | ') }
    Add-Suite 'playwright' 'Playwright e2e' $cmd $tests $ec $sw.ElapsedMilliseconds
  }
}

# ===================== i18n =====================
if (Wants 'i18n') {
  $tests = @(); $sw = [Diagnostics.Stopwatch]::StartNew(); $allEc = 0
  $ilog = Join-Path $logDir 'i18n.log'
  $suiteOut = @()

  # identity per lang
  $o = & node "$root\tools\i18n\i18n_identity.mjs" --all 2>&1; $allEc = [Math]::Max($allEc, $LASTEXITCODE)
  $suiteOut += $o
  foreach ($ln in ($o -split "`n")) {
    if ($ln -match '^\s*([a-zA-Z\-]+)\s+violations=(\d+)') {
      $tests += New-Test "i18n.identity.$($Matches[1])" 'i18n_identity.mjs' "identity $($Matches[1])" ($(if ([int]$Matches[2] -eq 0) {'pass'} else {'fail'})) 0 ''
    }
  }
  # coverage per lang (enabled)
  $o = & node "$root\tools\i18n\i18n_coverage.mjs" --enabled 2>&1; $allEc = [Math]::Max($allEc, $LASTEXITCODE)
  $suiteOut += $o
  foreach ($ln in ($o -split "`n")) {
    if ($ln -match '^\s*([a-zA-Z\-]+)\s+(\d+)%') {
      $tests += New-Test "i18n.coverage.$($Matches[1])" 'i18n_coverage.mjs' "coverage $($Matches[1])" ($(if ([int]$Matches[2] -eq 100) {'pass'} else {'fail'})) 0 ''
    }
  }
  # lint
  $o = & node "$root\.04-Src\tools\i18n\i18n_lint.mjs" 2>&1; $ec1 = $LASTEXITCODE; $allEc = [Math]::Max($allEc, $ec1)
  $suiteOut += $o
  $open = ($o | Select-String 'open=(\d+)' | ForEach-Object { $_.Matches[0].Groups[1].Value })
  $tests += New-Test 'i18n.lint.open' 'i18n_lint.mjs' "open findings = $(if($open){$open}else{'?'})" ($(if ($open -eq '0') {'pass'} else {'fail'})) 0 ''
  # langs_consistency (vitest)
  $o = & node "$root\.04-Src\node_modules\vitest\vitest.mjs" run '.04-Src/07-QA-and-Testing/vitest/langs_consistency.test.js' --config vitest.config.js --root . 2>&1
  $ec2 = $LASTEXITCODE; $allEc = [Math]::Max($allEc, $ec2); $suiteOut += $o
  $tests += New-Test 'i18n.langs_consistency' 'langs_consistency.test.js' 'langs consistency (5 sets)' ($(if ($ec2 -eq 0) {'pass'} else {'fail'})) 0 (($o | Select-Object -Last 2) -join ' | ')
  # critic_check
  $o = & node "$root\tools\i18n\critic_check.mjs" 2>&1; $ec3 = $LASTEXITCODE; $allEc = [Math]::Max($allEc, $ec3)
  $suiteOut += $o
  $tests += New-Test 'i18n.critic_check' 'critic_check.mjs' 'critic artifacts valid' ($(if ($ec3 -eq 0) {'pass'} else {'fail'})) 0 (($o | Select-Object -Last 1))
  $sw.Stop()
  $suiteOut | Out-File -Encoding utf8 $ilog
  Add-Suite 'i18n' 'i18n checks' 'identity+coverage+lint+langs_consistency+critic_check' $tests $allEc $sw.ElapsedMilliseconds
}

# ===================== report =====================
if (Wants 'report') {
  $cmd = 'powershell -File tools\verify_report.ps1'
  $sw = [Diagnostics.Stopwatch]::StartNew()
  $o = & powershell -NoProfile -ExecutionPolicy Bypass -File "$root\tools\verify_report.ps1" 2>&1
  $sw.Stop(); $ec = $LASTEXITCODE
  $o | Out-File -Encoding utf8 (Join-Path $logDir 'report.log')
  $tests = @(); $i = 0
  foreach ($ln in ($o -split "`n")) {
    if ($ln -match '^(PASS|FAIL)\s+(V\d+)\s*(.*)$') {
      $i++
      $tests += New-Test "report.$($Matches[2])" 'verify_report.ps1' $Matches[3].Trim() ($(if ($Matches[1] -eq 'PASS') {'pass'} else {'fail'})) 0 ''
    }
  }
  $okLine = ($o | Select-String 'VERIFY (OK|FAIL)' | Select-Object -Last 1).Line
  if (-not $tests.Count) { $tests += New-Test 'report.run' 'verify_report.ps1' "verdict: $okLine" ($(if ($okLine -match 'OK') {'pass'} else {'fail'})) $sw.ElapsedMilliseconds $okLine }
  Add-Suite 'report' 'Report verify' $cmd $tests $ec $sw.ElapsedMilliseconds
}

# ===================== aab =====================
if (Wants 'aab') {
  $cmd = 'jarsigner -verify 06-DevOps-and-Release\android\android\app\build\outputs\bundle\release\app-release.aab'
  $aab = Join-Path $root '06-DevOps-and-Release\android\android\app\build\outputs\bundle\release\app-release.aab'
  $sw = [Diagnostics.Stopwatch]::StartNew()
  $tests = @()
  if (-not (Test-Path $aab)) {
    $tests += New-Test 'aab.file' 'app-release.aab' 'bundle exists' 'fail' 0 'file not found'
    $ec = 1
  } else {
    $o = & jarsigner -verify $aab 2>&1
    $sw.Stop(); $ec = $LASTEXITCODE
    $o | Out-File -Encoding utf8 (Join-Path $logDir 'aab.log')
    $txt = ($o -join "`n")
    $st = if ($txt -match 'jar verified') { 'pass' } elseif ($txt -match 'unsigned') { 'fail' } elseif ($ec -eq 0) { 'pass' } else { 'fail' }
    $tests += New-Test 'aab.sign' 'app-release.aab' 'jarsigner -verify' $st $sw.ElapsedMilliseconds (($o | Select-Object -First 1))
  }
  $sw.Stop()
  Add-Suite 'aab' 'AAB signature' $cmd $tests $ec $sw.ElapsedMilliseconds
}

# ===================== write =====================
$allTests = @($suites | ForEach-Object { $_.tests } | ForEach-Object { $_ })
$finishedAt = (Get-Date).ToUniversalTime().AddHours(3).ToString('yyyy-MM-dd HH:mm') + ' UTC+3'
$result = [ordered]@{
  schema = 'igs-test-run/1'; run_id = $ts
  started_at = $startedAt; finished_at = $finishedAt
  commit = $commit; branch = $branch; dirty_count = $dirty; machine = $machine
  totals = (Totals $allTests); suites = $suites
}
$jf = Join-Path $runsDir "results-$ts.json"
[System.IO.File]::WriteAllText($jf, ($result | ConvertTo-Json -Depth 8), (New-Object System.Text.UTF8Encoding($false)))
Copy-Item $jf (Join-Path $runsDir 'results-latest.json') -Force

$t = $result.totals
Write-Output "run $ts commit=$commit branch=$branch dirty=$dirty"
foreach ($s in $suites) { Write-Output ("  {0,-10} pass={1} fail={2} skip={3} exit={4} ms={5}" -f $s.id, $s.totals.pass, $s.totals.fail, $s.totals.skipped, $s.exit_code, $s.ms) }
Write-Output "TOTAL pass=$($t.pass) fail=$($t.fail) skipped=$($t.skipped) total=$($t.total)"
Write-Output "results: $jf"
Pop-Location
if ($t.fail -gt 0) { exit 1 } else { exit 0 }
