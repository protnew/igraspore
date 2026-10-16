# verify_report.ps1 — TZ v9 §31: проверка отчёта исполнителя (только чтение, без сети).
# Usage: powershell -File tools\verify_report.ps1 [-Report <md>] [-Strict]
# Каждая проверка печатает "PASS|FAIL V<n> <деталь>"; итог "VERIFY OK <n> checks" | "VERIFY FAIL <k>/<n>".
[CmdletBinding()]
param(
  [string]$Report = "",
  [switch]$Strict
)
$ErrorActionPreference = 'Continue'
$env:GIT_TERMINAL_PROMPT = '0'
foreach ($p in 'HTTP_PROXY','HTTPS_PROXY','ALL_PROXY') { Set-Item -Path "env:$p" -Value '' -Force }

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $root
$pass = 0; $fail = 0; $log = @()
function Out-Check($ok, $code, $detail) {
  $line = "$(@('FAIL','PASS')[[int]$ok]) $code $detail"
  Write-Output $line; $script:log += $line
  if ($ok) { $script:pass++ } else { $script:fail++ }
}

# --- выбор отчёта ---
if (-not $Report) {
  $cand = Get-ChildItem '09-Docs\out-dev-factory\REPORT-TZ-RELEASE-READY-2026-10-14-v9-*.md' -ErrorAction SilentlyContinue |
          Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $cand) { $cand = Get-ChildItem '09-Docs\out-dev-factory\REPORT-TZ-RELEASE-READY-2026-10-14-v*.md' -ErrorAction SilentlyContinue |
                    Sort-Object LastWriteTime -Descending | Select-Object -First 1 }
  if ($cand) { $Report = $cand.FullName }
}
$base = Split-Path $Report -Leaf

# V1: файл есть, UTF-8, имя REPORT-...-v(3..9)-YYYYMMDD-HHMM.md, время имени ±5 мин от LastWriteTime
if (-not $Report -or -not (Test-Path $Report)) { Out-Check $false 'V1' "md не найден: $Report"; }
else {
  $m = [regex]::Match($base, '^REPORT-TZ-RELEASE-READY-2026-10-14-v(\d{1,2})-(\d{8})-(\d{4})\.md$')
  if (-not $m.Success -or [int]$m.Groups[1].Value -lt 3) { Out-Check $false 'V1' "имя не по шаблону (v3+): $base" }
  else {
    $ts = [datetime]::ParseExact($m.Groups[2].Value + $m.Groups[3].Value, 'yyyyMMddHHmm', $null)
    $lw = (Get-Item $Report).LastWriteTime
    $diff = [math]::Abs(($lw - $ts).TotalMinutes)
    if ($diff -gt 5) { Out-Check $false 'V1' "время имени расходится с LastWriteTime на $([math]::Round($diff)) мин" }
    else { Out-Check $true 'V1' "имя и время ок ($base)" }
  }
}

$lines = @(); if (Test-Path $Report) { $lines = Get-Content -Encoding UTF8 $Report }
$nonEmpty = @($lines | Where-Object { $_.Trim() -ne '' })
$last = if ($nonEmpty.Count) { $nonEmpty[-1].Trim() } else { '' }

# V2: последняя непустая строка — одна из трёх
$rxInter = '^Закончен промежуточный ответ — \d\d\.\d\d, \d\d:\d\d \(UTC\+3\)\. Дальше: .+, уже запущено: .+$'
$rxFull  = '^(ПОЛНОСТЬЮ )?закончен ответ — \d\d\.\d\d, \d\d:\d\d \(UTC\+3\)$'
$rxStop  = '^ОСТАНОВЛЕН — жду .+ от .+ — \d\d\.\d\d, \d\d:\d\d \(UTC\+3\)$'
$kind = ''
if ($last -match $rxInter) { $kind = 'inter' } elseif ($last -match $rxFull) { $kind = 'full' } elseif ($last -match $rxStop) { $kind = 'stop' }
Out-Check ($kind -ne '') 'V2' $(if ($kind) { "финальная строка: $kind" } else { "финальная строка не по шаблону: $last" })

# V3: последний code block = полный путь к самому md
$fences = @(); for ($i = 0; $i -lt $lines.Count; $i++) { if ($lines[$i].Trim() -eq '```') { $fences += $i } }
$v3ok = $false
if ($fences.Count -ge 2) {
  $blkStart = $fences[-2]; $blkEnd = $fences[-1]
  if ($blkEnd -lt $lines.Count - 1) {
    $blk = ($lines[($blkStart + 1)..($blkEnd - 1)] -join "`n").Trim()
    $v3ok = $blk -ieq (Resolve-Path $Report).Path -or $blk -ieq $Report -or ($blk -match [regex]::Escape($base) -and $blk -match ':\\')
  }
}
Out-Check $v3ok 'V3' $(if ($v3ok) { 'code block содержит путь к отчёту' } else { 'последний code block != путь к md' })

# V4: git-строка HEAD <sha7> и ahead/behind
$gitLine = ($lines | Where-Object { $_ -match 'HEAD\s+[0-9a-f]{7}' } | Select-Object -Last 1)
$v4ok = $false; $v4msg = 'git-строка не найдена'
if ($gitLine) {
  $sha = [regex]::Match($gitLine, 'HEAD\s+([0-9a-f]{7,10})').Groups[1].Value
  $headSha = ((& git rev-parse --short HEAD) 2>$null).Trim()
  $parSha  = ((& git rev-parse --short HEAD~1) 2>$null).Trim()
  $ab = ((& git rev-list --left-right --count 'HEAD...origin/release-ready-2026-10-14') 2>$null).Trim()
  $v4msg = "sha=$sha head=$headSha parent=$parSha ab=[$ab]"
  $v4ok = ($sha -eq $headSha -or $sha -eq $parSha)
}
Out-Check $v4ok 'V4' $v4msg

# V5: dirty N = строк в dirty-<ts>.txt; mine+wip = N
$v5ok = $false; $v5msg = 'нет dirty-строки/файла'
$dirtyLine = ($lines | Where-Object { $_ -match 'dirty' -and $_ -match 'dirty-\d' } | Select-Object -Last 1)
if ($dirtyLine) {
  $df = [regex]::Match($dirtyLine, '(dirty-\d{8}-\d{4}\.txt)').Groups[1].Value
  $dpath = Join-Path '09-Docs\out-dev-factory\logs-release-ready-2026-10-14' $df
  if (Test-Path $dpath) {
    $dcount = (Get-Content -Encoding UTF8 $dpath | Where-Object { $_.Trim() -ne '' }).Count
    $mn = [regex]::Match($dirtyLine, 'dirty:\s*(\d+)').Groups[1].Value
    $mine = [regex]::Match($dirtyLine, 'мои\s*(\d+)|mine\s*(\d+)')
    $wip  = [regex]::Match($dirtyLine, 'WIP\s*(\d+)|wip\s*(\d+)|чужой\s*WIP\s*(\d+)')
    $mnv = [int]$mn; $mv = 0; $wv = 0
    if ($mine.Success) { $mv = [int]($mine.Groups[1].Value, $mine.Groups[2].Value | Where-Object { $_ } | Select-Object -First 1) }
    if ($wip.Success)  { $wv = [int]($wip.Groups[1].Value, $wip.Groups[2].Value, $wip.Groups[3].Value | Where-Object { $_ } | Select-Object -First 1) }
    $v5msg = "dirty=$mnv файл=$dcount мои=$mv wip=$wv"
    $v5ok = ($mnv -eq $dcount -and ($mv + $wv) -eq $mnv)
  } else { $v5msg = "файл не найден: $dpath" }
}
Out-Check $v5ok 'V5' $v5msg

# V6: «промежуточный» → PID/лог в строке; heartbeat ≤10 мин от времени отчёта
if ($kind -eq 'inter') {
  $hasRef = $last -match 'PID|лог|log|Temp|tasks'
  $hb = '09-Docs\out-dev-factory\logs-release-ready-2026-10-14\heartbeat.log'
  $hbok = $false; $hbmsg = 'heartbeat.log нет'
  if (Test-Path $hb) {
    $hbLast = (Get-Content -Encoding UTF8 $hb | Where-Object { $_.Trim() -ne '' } | Select-Object -Last 1)
    $hbTs = [regex]::Match($hbLast, '(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})').Groups[1].Value
    $repTsM = [regex]::Match($base, '(\d{8})-(\d{4})')
    if ($hbTs -and $repTsM.Success) {
      $h = [datetime]::ParseExact($hbTs, 'yyyy-MM-ddTHH:mm', $null)
      $r = [datetime]::ParseExact($repTsM.Groups[1].Value + $repTsM.Groups[2].Value, 'yyyyMMddHHmm', $null)
      $gap = [math]::Abs(($r - $h).TotalMinutes)
      $hbmsg = "heartbeat gap=$([math]::Round($gap)) мин"; $hbok = $gap -le 10
    }
  }
  Out-Check ($hasRef -and $hbok) 'V6' "ref=$hasRef; $hbmsg"
} else { Out-Check $true 'V6' 'не промежуточный — пропуск' }

# V7: ОСТАНОВЛЕН → выше блок «Осталось:», Y жду-от-кого непустой
if ($kind -eq 'stop') {
  $hasLeft = ($nonEmpty | Where-Object { $_ -match 'Осталось' }).Count -gt 0
  $who = [regex]::Match($last, 'жду .+ от (.+) —').Groups[1].Value.Trim()
  Out-Check ($hasLeft -and $who.Length -gt 1) 'V7' "Осталось=$hasLeft; от=$who"
} else { Out-Check $true 'V7' 'не ОСТАНОВЛЕН — пропуск' }

# V8: ПОЛНОСТЬЮ → HEAD=origin и нет «не сделано»
if ($kind -eq 'full') {
  $hasOrigin = ($lines | Where-Object { $_ -match '=\s*origin|ahead\s*0' }).Count -gt 0
  $hasNotDone = ($lines | Where-Object { $_ -match 'не сделано|НЕ сделано' }).Count -gt 0
  Out-Check ($hasOrigin -and -not $hasNotDone) 'V8' "origin=$hasOrigin не_сделано=$hasNotDone"
} else { Out-Check $true 'V8' 'не финал — пропуск' }

# V9: критики — файлы из текста существуют; critic_check.mjs exit 0
$mentionsCritic = ($lines | Where-Object { $_ -match 'критик|critic' }).Count -gt 0
if ($mentionsCritic) {
  $cited = [regex]::Matches(($lines -join "`n"), '[\w.-]*-critic-[AB]-round\d+\.json') | ForEach-Object { $_.Value } | Select-Object -Unique
  $missing = @(); foreach ($cf in $cited) { if (-not (Test-Path (Join-Path '09-Docs\i18n-review\raw' $cf))) { $missing += $cf } }
  $cc = 'skip'
  if (Test-Path 'tools\i18n\critic_check.mjs') {
    & node tools\i18n\critic_check.mjs '09-Docs\i18n-review\raw' *> $null
    $cc = "exit=$LASTEXITCODE"
  }
  Out-Check (($missing.Count -eq 0) -and $LASTEXITCODE -eq 0) 'V9' "cited=$($cited.Count) missing=$($missing.Count) critic_check $cc"
} else { Out-Check $true 'V9' 'критики не упомянуты — пропуск' }

# V10: числа диффа — наличие блока git diff --shortstat
$diffClaim = ($lines | Where-Object { $_ -match '\+\d+\s*(строк|insertion)|дифф' }).Count -gt 0
$hasShortstat = ($lines -join "`n") -match 'git diff --shortstat'
Out-Check (-not $diffClaim -or $hasShortstat) 'V10' $(if ($diffClaim) { "diff-числа есть; shortstat=$hasShortstat" } else { 'нет diff-чисел' })

# V11: sha7-токены из отчёта существуют и в origin
$shas = [regex]::Matches(($lines -join "`n"), '[` ]([0-9a-f]{7})\b') | ForEach-Object { $_.Groups[1].Value } |
        Where-Object { $_ -match '[a-f]' } | Select-Object -Unique
$badSha = @(); foreach ($s in $shas) {
  & git cat-file -e "$s^{commit}" 2>$null
  if ($LASTEXITCODE -ne 0) { $badSha += $s; continue }
  & git merge-base --is-ancestor $s 'origin/release-ready-2026-10-14' 2>$null
  if ($LASTEXITCODE -ne 0) { $badSha += "$s(not-in-origin)" }
}
Out-Check ($badSha.Count -eq 0) 'V11' "sha проверено=$($shas.Count) bad=$($badSha -join ',')"

# V12 (Strict): langs_consistency упомянут → vitest langs_consistency exit 0
if ($Strict -and (($lines -join "`n") -match 'langs_consistency')) {
  & node .04-Src\node_modules\vitest\vitest.mjs run --config vitest.config.js --root . langs_consistency *> $null
  Out-Check ($LASTEXITCODE -eq 0) 'V12' "vitest langs_consistency exit=$LASTEXITCODE"
} else { Out-Check $true 'V12' $(if ($Strict) { 'не упомянут — пропуск' } else { 'не Strict — пропуск' }) }

$total = $pass + $fail
$verdict = if ($fail -eq 0) { "VERIFY OK $total checks" } else { "VERIFY FAIL $fail/$total" }
Write-Output $verdict; $script:log += $verdict
$logDir = '09-Docs\out-dev-factory\logs-release-ready-2026-10-14'
if (Test-Path $logDir) { $script:log | Set-Content -Encoding UTF8 (Join-Path $logDir ("verify-" + $base + ".txt")) }
Pop-Location
if ($fail -eq 0) { exit 0 } else { exit 1 }
