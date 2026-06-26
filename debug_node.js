const fs = require('fs');

global.window = global;
global.document = {
    getElementById: () => ({
        getContext: () => ({}),
        addEventListener: () => {},
        classList: { add: () => {}, remove: () => {} },
        style: {},
    }),
    body: { classList: { add: () => {} } }
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.addEventListener = () => {};
global.innerWidth = 1920;
global.innerHeight = 1080;
global.requestAnimationFrame = () => {};

const files = ['js/config.js', 'js/world.js', 'js/render.js', 'js/ui.js', 'js/main.js'];

try {
    for(let f of files) {
        console.log('Loading', f);
        let code = fs.readFileSync(f, 'utf8');
        eval(code);
        console.log('Loaded', f);
    }
    console.log('All loaded successfully!');
} catch(e) {
    console.error('Error during load:', e);
}
