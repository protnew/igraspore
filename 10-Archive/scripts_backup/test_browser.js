const fs = require('fs');
const vm = require('vm');

let context = vm.createContext({
  window: { addEventListener: () => {} },
  document: {
    getElementById: (id) => ({
      style: {},
      addEventListener: () => {},
      getContext: () => ({
        createLinearGradient: () => ({ addColorStop: () => {} })
      }),
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    }),
    addEventListener: () => {}
  },
  Math: Math,
  Date: Date,
  console: console,
  requestAnimationFrame: () => {}
});

context.window = context;

const files = ['js/config.js', 'js/world.js', 'js/ui.js', 'js/render.js', 'js/main.js'];

for (let file of files) {
  try {
    let code = fs.readFileSync(file, 'utf8');
    vm.runInContext(code, context, { filename: file });
    console.log(`${file} loaded successfully.`);
  } catch (err) {
    console.error(`Error in ${file}:`, err);
    break;
  }
}
