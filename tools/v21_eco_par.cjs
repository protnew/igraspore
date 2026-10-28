// v21: параллельный прогон eco_run — 5 сидов одновременно (spawn 5 процессов, ожидание всех).
// Продуктовый stepping (speed×updateWorld(0.05)) делает сид ~72k вызовов — последовательно слишком долго.
const { spawn } = require('child_process');
const seeds = process.argv[2] ? process.argv[2].split(',').map(Number) : [1, 2, 3, 4, 5];
const t0 = Date.now();
const kids = seeds.map(s => {
  const k = spawn('node', ['tools/v21_eco_run.cjs', 'http://127.0.0.1:8821', '09-Docs/out-dev-factory/eco-par-s' + s, String(s), '60'], { stdio: 'inherit' });
  k.on('exit', code => console.log(`seed ${s} exit=${code} t=${Math.round((Date.now() - t0) / 1000)}s`));
  return k;
});
let left = kids.length;
kids.forEach(k => k.on('exit', () => { if (--left === 0) { console.log('ALL DONE'); process.exit(0); } }));
