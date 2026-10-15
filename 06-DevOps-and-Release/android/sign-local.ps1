# sign-local.ps1 — локальная подпись AAB по решению №23 (принято 14.10.2026 23:43).
# Пароли читаются из keystore-credentials.txt только в память процесса.
# НИКОГДА не печатает, не логирует и не копирует пароли. В git этот файл НЕ попадает.
# Использование OLD-compromised ключа запрещено — скрипт отказывается.
#
# Запуск (из корня проекта, PowerShell):
#   powershell -ExecutionPolicy Bypass -File 06-DevOps-and-Release\android\sign-local.ps1
# Опции:
#   -Aab <путь>   файл для подписи (по умолчанию app-release.aab в build/outputs/bundle/release)
#   -DryRun       только проверки (ключ/история), без фактической подписи

[CmdletBinding()]
param(
  [string]$Aab = "",
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$env:GIT_TERMINAL_PROMPT = '0'
foreach ($p in 'HTTP_PROXY','HTTPS_PROXY','ALL_PROXY') { Set-Item -Path "env:$p" -Value '' -Force }

$secrets = 'C:\Users\Space\.secrets\igraspore'
$credFile = Join-Path $secrets 'keystore-credentials.txt'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path

if (-not (Test-Path $credFile)) { Write-Output 'FAIL: keystore-credentials.txt не найден'; exit 2 }

# --- читаем key = value, пропускаем комментарии и пустые строки ---
$vals = @{}
foreach ($line in (Get-Content -Encoding UTF8 $credFile)) {
  $t = $line.Trim()
  if ($t -eq '' -or $t.StartsWith('#')) { continue }
  $m = [regex]::Match($t, '^([^=:]+)[=:](.*)$')
  if ($m.Success) { $vals[$m.Groups[1].Value.Trim().ToLower()] = $m.Groups[2].Value.Trim() }
}

$ksPath    = $vals['keystore_path']
$alias     = $vals['alias']
$storePass = $vals['storepassword']
$keyPass   = $vals['keypassword']
if ([string]::IsNullOrWhiteSpace($keyPass)) { $keyPass = $storePass }

if ([string]::IsNullOrWhiteSpace($ksPath) -or [string]::IsNullOrWhiteSpace($alias) -or [string]::IsNullOrWhiteSpace($storePass)) {
  Write-Output 'FAIL: в keystore-credentials.txt нет keystore_path/alias/storePassword'; exit 2
}
if (-not (Test-Path $ksPath)) { Write-Output 'FAIL: keystore-файл не найден по пути из credentials'; exit 2 }

# --- проверка 1: это НЕ OLD-compromised ключ ---
if ($ksPath -match 'OLD-compromised') { Write-Output 'FAIL: указан OLD-compromised ключ — использование запрещено'; exit 3 }
Write-Output 'CHECK не-OLD-compromised: пройдено'

# --- проверка 2: текущий storePassword не встречается в истории git (печатаем только вердикт) ---
Push-Location $repoRoot
try {
  $hist = (& git log --all -p 2>$null) -join "`n"
  if ($hist.Contains($storePass)) { Write-Output 'CHECK пароль в истории git: НАЙДЕНО — остановлено'; exit 4 }
  Write-Output 'CHECK пароль в истории git: не найдено'
} finally { Pop-Location }

# --- цель подписи ---
if ([string]::IsNullOrWhiteSpace($Aab)) {
  $Aab = Join-Path $PSScriptRoot 'android\app\build\outputs\bundle\release\app-release.aab'
}
if (-not (Test-Path $Aab)) { Write-Output "FAIL: AAB не найден: $Aab"; exit 2 }
Write-Output "TARGET: $Aab"

if ($DryRun) { Write-Output 'DRYRUN: проверки пройдены, подпись не выполнена'; exit 0 }

# --- подпись: пароли уходят в env процесса, jarsigner берёт их через :env (не в аргументах) ---
$jarsigner = 'jarsigner'
try { $jarsigner = (Get-Command jarsigner -ErrorAction Stop).Source } catch {
  $cand = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot\bin\jarsigner.exe'
  if (Test-Path $cand) { $jarsigner = $cand }
}

$env:IGS_STORE_PASS = $storePass
$env:IGS_KEY_PASS   = $keyPass
try {
  & $jarsigner -keystore $ksPath -storepass:env IGS_STORE_PASS -keypass:env IGS_KEY_PASS -sigalg SHA256withRSA -digestalg SHA-256 "$Aab" $alias
  $signExit = $LASTEXITCODE
} finally {
  Remove-Item Env:IGS_STORE_PASS -ErrorAction SilentlyContinue
  Remove-Item Env:IGS_KEY_PASS -ErrorAction SilentlyContinue
}
if ($signExit -ne 0) { Write-Output "FAIL: jarsigner вернул $signExit"; exit 5 }
Write-Output 'SIGNED: jarsigner exit 0'

# --- проверка подписи ---
& $jarsigner -verify -verbose:summary "$Aab"
$verExit = $LASTEXITCODE
if ($verExit -eq 0) { Write-Output 'VERIFY: jar verified.' } else { Write-Output "VERIFY: jarsigner -verify вернул $verExit" }
exit $verExit
