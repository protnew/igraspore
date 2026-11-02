# Копирует шрифты OFL из источника в папки, которые реально раздаются.
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$names = @(
  'NotoSansBengali-Regular.woff2',
  'NotoSansDevanagari-Regular.woff2',
  'NotoSansThai-Regular.woff2',
  'OFL.txt'
)
$src = Join-Path $root '.04-Src\fonts'
$dests = @(
  (Join-Path $root '04-Src\fonts'),
  (Join-Path $root '06-DevOps-and-Release\cf-publish\04-Src\fonts')
)
foreach ($dest in $dests) {
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  foreach ($n in $names) {
    Copy-Item -LiteralPath (Join-Path $src $n) -Destination (Join-Path $dest $n) -Force
    $a = (Get-FileHash -LiteralPath (Join-Path $src $n) -Algorithm SHA256).Hash
    $b = (Get-FileHash -LiteralPath (Join-Path $dest $n) -Algorithm SHA256).Hash
    if ($a -ne $b) { Write-Output "FONT MISMATCH $n"; exit 1 }
  }
}
Write-Output 'FONT SHA OK'
# v26 Д9: вместе с woff2 раскладываем и сгенерированный из реестра @font-face — без него ссылка
# «04-Src/fonts.generated.css» в index.html вела в никуда (в url внутри css пути относительные: fonts/…).
$css = Join-Path $root '.04-Src\fonts.generated.css'
if (Test-Path $css) {
  foreach ($dest in $dests) {
    $dir = Split-Path $dest -Parent
    Copy-Item -LiteralPath $css -Destination (Join-Path $dir 'fonts.generated.css') -Force
  }
  Write-Output ('fonts.generated.css разложен в ' + ($dests | ForEach-Object { Split-Path $_ -Parent }) -join ', ')
} else { Write-Output 'НЕТ .04-Src\fonts.generated.css — запусти node tools/gen_lang_registry.cjs' }
