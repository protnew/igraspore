# iGraSpore Mobile Stack — как выйти на телефон (08.2026)

Не дублирует gfx-таблицы iGraSpore. Вопрос: как доставить текущий Canvas/JS sim на mobile без rewrite. Победитель: Responsive Web+Touch → PWA → Capacitor/TWA при store. Критики: keep-JS 16%, rewrite Godot/Unity/Native внизу; baseline CF без touch проигрывает; Electron=false mobile.

**table_id:** `igraspore-mobile-stack-2026-08`

## Веса

| # | Параметр | Вес |
|---|----------|----:|
| 1 | Скорость до mobile UX (18%) | 18% |
| 2 | Сохранить Canvas/JS (16%) | 16% |
| 3 | FPS mid-phone 4–6GB (14%) | 14% |
| 4 | Touch / one-hand (12%) | 12% |
| 5 | TCO / free host+build (10%) | 10% |
| 6 | Offline / install (8%) | 8% |
| 7 | Store (Play/App) (7%) | 7% |
| 8 | Батарея / thermal (6%) | 6% |
| 9 | Один codebase (5%) | 5% |
| 10 | Нативный UX/haptics (4%) | 4% |

## Рейтинг (Utility)

| # | Объект | U | Цена | Link |
|--:|--------|--:|------|------|
| 1 | [PWA (manifest + SW)](https://web.dev/progressive-web-apps/) | 8.33 | $0 | Шаг 2 после responsive |
| 2 | [Responsive Web + Touch (CF Pages)](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) | 7.80 | $0 | WINNER шаг 1 — тот же igraspore.pages.dev |
| 3 | [PWA + TWA (Bubblewrap → Play)](https://developer.chrome.com/docs/android/trusted-web-activity/) | 7.73 | $25 | Play без полного native shell |
| 4 | [Capacitor 6 wrapper](https://capacitorjs.com/) | 7.67 | $99/y | Store когда product-fit; Apple Developer $99/y |
| 5 | [Ionic + Capacitor UI kit](https://ionicframework.com/) | 6.87 | $99/y | Лишний UI-слой для canvas-игры |
| 6 | [Expo + WebView](https://docs.expo.dev/) | 6.56 | $0 | Быстрый store path, но всё ещё оболочка |
| 7 | [Tauri 2 mobile](https://v2.tauri.app/) | 6.54 | $0 | Mobile API ещё maturing 2026 |
| 8 | [Cordova / PhoneGap](https://cordova.apache.org/) | 6.50 | $0 | Legacy — не брать на greenfield |
| 9 | [Flutter WebView shell](https://docs.flutter.dev/platform-integration/web) | 6.18 | $0 | Двойной runtime без выигрыша для sim |
| 10 | [React Native WebView](https://github.com/react-native-webview/react-native-webview) | 6.18 | $0 | Лишний bridge |
| 11 | [CF Pages only (no mobile UI)](https://igraspore.pages.dev/) | 6.12 | $0 | BASELINE — сейчас; desktop-first |
| 12 | [Godot 4 HTML5/mobile export](https://godotengine.org/) | 4.81 | $0 | Полный rewrite sim — нет |
| 13 | [Native Kotlin + Swift](https://developer.android.com/) | 4.78 | $5000+ | Только если hit-продукт |
| 14 | [Unity export](https://unity.com/) | 4.19 | $0+ | Overkill + rewrite + license risk |
| 15 | [Desktop Electron wrap](https://www.electronjs.org/) | 4.17 | $0 | Не mobile — контроль ложный кандидат |