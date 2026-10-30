# v24 задача 3: перегенерация всех растровых иконок/сплэшей из 512-мастера (HighQualityBicubic)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = "C:\Obsidian\New\Projects\08-iGraSpore_V2"
$master = Join-Path $root 'assets\icons\icon-512.png'
$maskable = Join-Path $root 'assets\icons\icon-maskable-512.png'
$res = Join-Path $root '06-DevOps-and-Release\android\android\app\src\main\res'
function Save-Resized([string]$src, [string]$dst, [int]$size) {
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $size, $size)
    $g.Dispose()
    New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
    $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
  } finally { $img.Dispose() }
}
$sizes = @{ 'mipmap-mdpi'=48; 'mipmap-hdpi'=72; 'mipmap-xhdpi'=96; 'mipmap-xxhdpi'=144; 'mipmap-xxxhdpi'=192 }
foreach ($d in $sizes.Keys) {
  $s = $sizes[$d]
  Save-Resized $master (Join-Path $res "$d\ic_launcher.png") $s
  Save-Resized $master (Join-Path $res "$d\ic_launcher_round.png") $s
  Write-Output "$d ic_launcher(+round) ${s}px"
}
# splash: maskable-мастер; размер по суффиксу плотности
$dpiMap = @{ 'mdpi'=320; 'hdpi'=480; 'xhdpi'=640; 'xxhdpi'=960; 'xxxhdpi'=1280 }
Get-ChildItem $res -Directory | Where-Object { $_.Name -like 'drawable*' } | ForEach-Object {
  $p = Join-Path $_.FullName 'splash.png'
  if (Test-Path $p) {
    $dpi = ($_.Name -split '-')[-1]
    if ($dpiMap.ContainsKey($dpi)) { $s = $dpiMap[$dpi]; Save-Resized $maskable $p $s; Write-Output "$($_.Name) splash ${s}px" }
  }
}
Write-Output "ICONS DONE from 512-master"
