const fs = require('fs');

let elementMock = function(tag) {
  let e = {
    style: {},
    className: '',
    textContent: '',
    innerHTML: '',
    setAttribute: function() {},
    getAttribute: function() { return '0'; },
    appendChild: function() {},
    addEventListener: function() {},
    querySelector: function() { return elementMock('canvas'); },
    getContext: () => new Proxy({}, {
      get: function(target, prop) {
        if (['canvas', 'fillStyle', 'strokeStyle', 'lineWidth', 'globalAlpha', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'font', 'textAlign', 'textBaseline'].includes(prop)) return '';
        if (prop === 'measureText') return () => ({width: 10});
        return () => new Proxy({}, { get: () => () => {} });
      }
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
  requestAnimationFrame: (cb) => { windowMock._raf = cb; }
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

let testFunc = new Function('window', 'document', 'localStorage', 'requestAnimationFrame', 'Date', 'Math', `
  ${code}
  try {
    startGame();
    
    // Simulate 1000 frames
    for(let i = 0; i < 1000; i++) {
      if(window._raf) {
         let cb = window._raf;
         window._raf = null;
         cb(Date.now() + i * 16);
      }
    }
    console.log("SUCCESS: 1000 frames executed without error.");
  } catch(e) {
    console.error("SIMULATION ERROR:", e);
  }
`);

try {
  testFunc(windowMock, documentMock, windowMock.localStorage, windowMock.requestAnimationFrame, Date, Math);
} catch(e) {
  console.error("GLOBAL ERROR:", e);
}
