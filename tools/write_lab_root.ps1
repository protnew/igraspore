# Пишет корень лаборатории: переход на /lab/. Папка dist-lab в git не хранится.
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$dest = Join-Path $root '.04-Src\dist-lab'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$index = Join-Path $dest 'index.html'
$html = @"
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=/lab/">
<link rel="canonical" href="/lab/">
<title>iGraSpore lab</title>
<script>location.replace('/lab/');</script>
</head>
<body><p><a href="/lab/">Лаборатория</a></p></body>
</html>
"@
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($index, $html.Replace("`r`n","`n"), $utf8)
[System.IO.File]::WriteAllText((Join-Path $dest '_redirects'), "/ /lab/ 302`n", $utf8)
Write-Output "LAB ROOT OK $index"
