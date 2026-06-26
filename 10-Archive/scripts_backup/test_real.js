const fs = require('fs');

let elementMock = function(tag) {
  let e = {
    style: {},
    className: '',
    textContent: '',
    innerHTML: '',
    setAttribute: function() {},
    appendChild: function() {},
    addEventListener: function() {},
    querySelector: function() { return elementMock('canvas'); },
    getContext: () => ({
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillRect: () => {},
      clearRect: () => {},
      arc: () => {},
      ellipse: () => {},
      fill: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      strokeRect: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      globalAlpha: 1,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1
    }),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
    width: 1000,
    height: 800
  };
  return e;
};

let windowMock = {
  addEventListener: () => {},
  spectatorMode: false,
  initAudio: () => {},
  localStorage: { getItem: () => null, setItem: () => {} },
  AudioContext: function() {},
  webkitAudioContext: function() {},
  requestAnimationFrame: () => {}
};

let documentMock = {
  getElementById: (id) => elementMock(id),
  querySelector: () => elementMock(),
  querySelectorAll: () => [],
  createElement: (tag) => elementMock(tag),
  addEventListener: () => {}
};

let code = "";
for (let file of ['js/config.js', 'js/world.js', 'js/ui.js', 'js/render.js', 'js/main.js']) {
  code += fs.readFileSync(file, 'utf8') + "\n";
}

let testFunc = new Function('window', 'document', 'localStorage', 'requestAnimationFrame', `
  ${code}
  console.log("Files parsed.");
  try {
    initUI();
    console.log("initUI executed successfully.");
    startGame();
    console.log("startGame executed successfully.");
  } catch(e) {
    console.error("initUI/startGame ERROR:", e);
  }
`);

try {
  testFunc(windowMock, documentMock, windowMock.localStorage, windowMock.requestAnimationFrame);
} catch(e) {
  console.error("GLOBAL ERROR:", e);
}
