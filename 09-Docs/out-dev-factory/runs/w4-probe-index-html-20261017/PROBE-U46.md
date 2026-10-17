# PROBE U46 (блок W4) — попадает ли `.04-Src\src\index.html` в веб-сборку и APK

Запуск 17.10.2026 11:15 (UTC+3). Только чтение, ничего не изменено (крюк: `tools\probe_index_html.mjs`, git-объекты не тронуты).

## Вывод
**НЕ В СБОРКЕ.** Файл `.04-Src\src\index.html` — легаси-копия старой однофайловой страницы (1248 строк, sha256 `b998612152bec1f7…`, последний коммит `a3f5a8b` 14.09 14:37). Точка входа продукта — другой файл: корневой `index.html` (245 строк), его зеркало `06-DevOps-and-Release\cf-publish\index.html` (243) и копия внутри APK `06-DevOps-and-Release\apk_proj\assets\www\index.html` (239). Ни один из них не совпадает по хешу с целевым; в зеркалах папки `src\` нет вовсе.

## Доказательства (команда → вывод)

### 1. Хеши и длины кандидатов — `node tools\probe_index_html.mjs`
```
.04-Src/src/index.html                        lines=1248 bytes=43867 sha=b998612152bec1f7 = ЦЕЛЕВОЙ
index.html                                    lines=245  bytes=18408 sha=3062b0357f03f968
06-DevOps-and-Release/cf-publish/index.html   lines=243  bytes=19183 sha=5f5eb8c78aae69f7
06-DevOps-and-Release/apk_proj/assets/www/index.html  lines=239 bytes=18125 sha=753510193b14b8d0
06-DevOps-and-Release/android/app/src/main/assets/public/index.html  НЕТ ФАЙЛА
06-DevOps-and-Release/deploy-repo/.04-Src/src/index.html  lines=1251 bytes=43863 sha=e0b3a298668ad375
.04-Src/dist-lab/lab/index.html               lines=1    bytes=1826  sha=539e2fe72c64cade
.04-Src/v3-webgl/index.html                   lines=480  bytes=32837 sha=43610d7c165a41fa
```
Целевой файл не равен ни одному из отдаваемых `index.html`.

### 2. Ссылки в build-скриптах — `rg -i "src[/\\]+index\.html"` по `*.{json,ps1,mjs,js,toml,cjs}`
```
tools\probe_index_html.mjs        (мой пробник, создан этим кругом)
10-Archive\scripts_backup\test.js  html = fs.readFileSync('src/index.html') — архивный скрипт, в сборке не участвует
```
В действующих скриптах ссылок на `src/index.html` — 0.

### 3. Откуда берётся веб для APK/AAB — `grep -n webDir 06-DevOps-and-Release\android\capacitor.config.json`
```
4: "webDir": "../cf-publish"
```
То есть сборка берёт `cf-publish`, а не `.04-Src\src`.

### 4. Состав зеркал — `ls 06-DevOps-and-Release\cf-publish\04-Src\` и проверка наличия `src`
```
cf-publish\04-Src: assets  fonts  js  shaders  v3-webgl
cf-publish\04-Src\src\index.html   — нет
apk_proj\assets\www\04-Src\src\index.html — нет
```

### 5. `deploy.ps1` (легаси-путь деплоя на Cloudflare) — `sed -n 1,25p 06-DevOps-and-Release\deploy.ps1`
```
$SourceIndex = "$ProjectRoot\index.html"      → копируется КОРНЕВОЙ index.html, не .04-Src\src\index.html
Copy-Item "$ProjectRoot\04-Src" -Recurse      → в deploy-repo уезжает всё дерево, поэтому там и лежит
                                                устаревшая копия .04-Src\src\index.html (1251 строк, sha e0b3a298)
```
Копия в `deploy-repo` — слепок дерева, а не отдаваемый экран: точка входа `deploy-repo\index.html` создаётся из корневого `index.html`.

### 6. Ссылок из HTML нет — `rg -i "src[/\\]index\.html|\.\./src/|["']src/" по *.html`
```
No matches found
```
Ни один HTML (корень, зеркала, вики) не грузит `src/…` через iframe/script/link.

## Что это значит для №25
По варианту **25.1** (рекомендование аналитика): PROBE сделан → файл **не в сборке** → его длина 1248 строк не влияет на продукт и на размер AAB. Основание для легаси-исключения из правила «≤500 строк в продукте»; резать его не нужно. Решение за владельцем (№25) — я ничего не удаляю и не правлю (в `.04-Src\src\` по §19 не трогаем).
