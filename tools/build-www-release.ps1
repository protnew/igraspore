# build-www-release.ps1 — TZ v20.3
# Собирает cf-publish\www-release только из релиза: index, 04-Src\js, i18n, swiss PNG.
# Не кладёт v3-webgl, _raw, *.apk, дубли bioicons, лишний JS.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path (Join-Path $root '.04-Src\js\main.js'))) {
  $root = 'C:\Obsidian\New\Projects\08-iGraSpore_V2'
}
$srcPub = Join-Path $root '06-DevOps-and-Release\cf-publish'
$srcJs = Join-Path $root '.04-Src\js'
$dst = Join-Path $srcPub 'www-release'
$arch = Join-Path $root '.10-Archive'
if (Test-Path $dst) {
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $prev = Join-Path $arch ("www-release-" + $stamp)
  New-Item -ItemType Directory -Force -Path $arch | Out-Null
  Move-Item -LiteralPath $dst -Destination $prev
}
New-Item -ItemType Directory -Force -Path $dst | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $dst '04-Src\js') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $dst '04-Src\fonts') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $dst 'assets\bioicons\swiss_sprites') | Out-Null

$rootFiles = @('index.html','style.css','v20_5.css','manifest.json','favicon-32.png','privacy.html')
foreach ($n in $rootFiles) {
  $from = Join-Path $root $n
  if (-not (Test-Path $from)) { $from = Join-Path $srcPub $n }
  if (Test-Path $from) { Copy-Item -LiteralPath $from -Destination (Join-Path $dst $n) }
}

Get-ChildItem -LiteralPath $srcJs -Filter '*.js' -File | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination (Join-Path (Join-Path $dst '04-Src\js') $_.Name)
}
$fonts = Join-Path $root '04-Src\fonts'
if (-not (Test-Path $fonts)) { $fonts = Join-Path $srcPub '04-Src\fonts' }
if (Test-Path $fonts) {
  Get-ChildItem -LiteralPath $fonts -File | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path (Join-Path $dst '04-Src\fonts') $_.Name)
  }
}
# v21 (критики 2+5): i18n — ТОЛЬКО из канона .04-Src\i18n. Прежний источник cf-publish\i18n был копией от 16.10
# (17 словарей без 10 ключей exitAsk/yes/no/more/...), и каждая сборка AAB молча увозила старые словари.
$i18nFrom = Join-Path $root '.04-Src\i18n'
Copy-Item -LiteralPath $i18nFrom -Destination (Join-Path $dst 'i18n') -Recurse -Force

$sprites = Join-Path $srcPub 'assets\bioicons\swiss_sprites'
Get-ChildItem -LiteralPath $sprites -File | Where-Object {
  $_.Extension -ne '.js' -and $_.Name -notmatch '_raw'
} | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination (Join-Path (Join-Path $dst 'assets\bioicons\swiss_sprites') $_.Name)
}

$bad = @()
Get-ChildItem -LiteralPath $dst -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($dst.Length + 1)
  if ($rel -match 'v3-webgl') { $bad += "v3 $rel" }
  if ($rel -match '_raw') { $bad += "raw $rel" }
  if ($_.Extension -eq '.apk') { $bad += "apk $rel" }
}
$js = Get-ChildItem -LiteralPath $dst -Recurse -Filter '*.js' -File
$extraJs = $js | Where-Object { $_.Directory.Name -ne 'js' -or $_.Directory.Parent.Name -ne '04-Src' }
foreach ($e in $extraJs) { $bad += ("extra-js " + $e.FullName.Substring($dst.Length + 1)) }
$names = $js | ForEach-Object { $_.Name }
$dup = $names | Group-Object | Where-Object { $_.Count -gt 1 }
foreach ($d in $dup) { $bad += ("dup " + $d.Name) }

$bytes = (Get-ChildItem -LiteralPath $dst -Recurse -File | Measure-Object -Property Length -Sum).Sum
$report = Join-Path $root '09-Docs\out-dev-factory\www-release-manifest.txt'
$lines = @()
$lines += ("bytes=" + $bytes)
$lines += ("files=" + (Get-ChildItem -LiteralPath $dst -Recurse -File).Count)
$lines += ("js=" + $js.Count)
$lines += ("bad=" + $bad.Count)
$lines += '---files---'
Get-ChildItem -LiteralPath $dst -Recurse -File | Sort-Object FullName | ForEach-Object {
  $rel = $_.FullName.Substring($dst.Length + 1)
  $lines += ("{0}`t{1}" -f $_.Length, $rel)
}
if ($bad.Count) { $lines += '---bad---'; $lines += $bad }
Set-Content -LiteralPath $report -Value $lines -Encoding utf8
if ($bad.Count) { Write-Output ("FAIL bad=" + ($bad -join '; ')); exit 1 }
Write-Output ("OK bytes=" + $bytes + " files=" + (Get-ChildItem -LiteralPath $dst -Recurse -File).Count + " js=" + $js.Count)
