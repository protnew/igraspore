const fs = require('fs');

let windowMock = {
  addEventListener: () => {},
  spectatorMode: false,
  initAudio: () => {}
};

let documentMock = {
  getElementById: (id) => ({
    style: {},
    className: '',
    addEventListener: () => {},
    getContext: () => ({
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillRect: () => {},
      arc: () => {},
      fill: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {}
    }),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
    width: 1000,
    height: 800
  }),
  addEventListener: () => {}
};

// Use eval instead of vm to make debugging easier
let code = "";
for (let file of ['js/config.js', 'js/world.js', 'js/ui.js', 'js/render.js', 'js/main.js']) {
  code += fs.readFileSync(file, 'utf8') + "\n";
}

let testFunc = new Function('window', 'document', `
  ${code}
  console.log("Files loaded.");
  buildSpeciesGrid();
  console.log("buildSpeciesGrid() done.");
  startGame();
  console.log("startGame() done.");
`);

try {
  testFunc(windowMock, documentMock);
} catch(e) {
  console.error("CAUGHT ERROR:", e);
}
