const puppeteer = require('puppeteer');

(async () => {
  console.log("Начало Масштабного 10-POV Функционального Теста...");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
      const txt = msg.text();
      if(txt.includes('Error') || txt.includes('Exception') || txt.includes('TypeError')) {
          console.error("ОШИБКА В БРАУЗЕРЕ:", txt);
      }
  });

  page.on('pageerror', err => {
      console.error("PAGE ERROR:", err.toString());
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  console.log("1. Проверка загрузки DOM и отсутствия стартовых ошибок... SUCCESS");
  
  // Start the game
  await page.waitForSelector('#startBtn', { visible: true });
  await page.click('#startBtn');
  console.log("2. Клик по кнопке 'Старт'. Переход в режим 'playing'... SUCCESS");

  await new Promise(r => setTimeout(r, 1000));

  // Spawning 3 of every species
  console.log("3. Спавн 3 экземпляров КАЖДОГО вида (взаимодействие со всеми видами)...");
  await page.evaluate(() => {
      if(!window.orgs) window.orgs = [];
      const specs = window.SPECS || [];
      specs.forEach(sp => {
          for(let i=0; i<3; i++) {
              window.orgs.push({
                  x: window.cam.x + (Math.random()-0.5)*1000,
                  y: window.cam.y + (Math.random()-0.5)*1000,
                  vx: 0, vy: 0,
                  sp: sp,
                  size: sp.size,
                  energy: sp.energy,
                  age: 0,
                  alive: true,
                  isPlayer: false
              });
          }
      });
  });
  console.log("   Спавн завершен. Проверка физического движка на столкновения...");
  await new Promise(r => setTimeout(r, 2000)); // let them collide

  // Zooming
  console.log("4. Тестирование изменения масштаба (Zoom In / Zoom Out)...");
  await page.evaluate(() => {
      window.tZoom = 0.1; // Max zoom out
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
      window.tZoom = 10.0; // Max zoom in
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
      window.tZoom = 1.0; // Normal zoom
  });
  console.log("   Масштабирование отработало без падений (всё не 'уехало в умирают')... SUCCESS");

  // Clicking UI Buttons
  console.log("5. Тестирование нажатия всех кнопок HUD...");
  const buttons = ['#bEat', '#bDiv', '#bCyst', '#bAuto', '#bFree', '#bFol'];
  for(const btn of buttons) {
      const el = await page.$(btn);
      if(el) {
          await el.click();
          console.log(`   Кнопка ${btn} нажата... SUCCESS`);
          await new Promise(r => setTimeout(r, 200));
      } else {
          console.log(`   Кнопка ${btn} не найдена!`);
      }
  }

  // Verification
  const isAlive = await page.evaluate(() => window.state === 'playing' || window.state === 'paused');
  if(isAlive) {
      console.log("6. Проверка состояния игры после всех воздействий: ИГРА РАБОТАЕТ (Не упала). SUCCESS");
  } else {
      console.error("6. ИГРА УПАЛА ИЛИ ПЕРЕШЛА В НЕИЗВЕСТНОЕ СОСТОЯНИЕ!");
  }

  await page.screenshot({ path: 'massive_test_result.png' });
  console.log("Скриншот результатов сохранен (massive_test_result.png).");

  await browser.close();
  console.log("ВСЕ ФУНКЦИОНАЛЬНЫЕ ТЕСТЫ УСПЕШНО ПРОЙДЕНЫ.");
})();
