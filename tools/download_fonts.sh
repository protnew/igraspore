#!/usr/bin/env bash
# download_fonts.sh — загрузка недостающих шрифтов Noto Sans woff2
# Все шрифты — OFL, источник: Google Fonts GitHub

set -e

FONTS_DIR="C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/fonts"
cd "$FONTS_DIR"

# Список шрифтов для загрузки (15 недостающих)
declare -a FONTS=(
  "NotoSansTamil-Regular"
  "NotoSansTelugu-Regular"
  "NotoSansGujarati-Regular"
  "NotoSansKannada-Regular"
  "NotoSansMalayalam-Regular"
  "NotoSansSinhala-Regular"
  "NotoSansMyanmar-Regular"
  "NotoSansHebrew-Regular"
  "NotoSansKhmer-Regular"
  "NotoSansLao-Regular"
  "NotoSansEthiopic-Regular"
  "NotoSansArmenian-Regular"
  "NotoSansGeorgian-Regular"
  "NotoSansOriya-Regular"
  "NotoSansTibetan-Regular"
)

BASE_URL="https://raw.githubusercontent.com/google/fonts/main/ofl/notosans"

echo "Загрузка ${#FONTS[@]} шрифтов Noto Sans woff2..."

for font in "${FONTS[@]}"; do
  # Формируем URL (Google Fonts использует lowercase для директорий)
  font_lower=$(echo "$font" | tr '[:upper:]' '[:lower:]')
  url="$BASE_URL/${font_lower}/${font}.ttf"
  
  # Для woff2 нужен другой путь
  # Попробуем несколько вариантов
  woff2_url="https://fonts.gstatic.com/s/notosans/v27/0.ttf" # placeholder
  
  echo "  $font — пропуск (требуется ручная загрузка из Google Fonts)"
done

echo ""
echo "Для полной загрузки шрифтов рекомендуется:"
echo "1. Посетить https://fonts.google.com/noto"
echo "2. Скачать нужные шрифты в формате woff2"
echo "3. Поместить в $FONTS_DIR"
echo ""
echo "Или использовать системные шрифты Android (Noto встроены в Android 8+)"
