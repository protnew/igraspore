const fs = require('fs');

// 1. Abyss Boundary in renderWater
let r = fs.readFileSync('js/render.js', 'utf8');
let boundary = `
  // Abyss boundary
  ctx.fillStyle = 'rgba(0, 5, 12, 0.95)';
  ctx.fillRect(-PW*2, PD, PW*4, 4000);
  ctx.strokeStyle = 'rgba(20, 40, 60, 0.8)';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 15]);
  ctx.beginPath(); ctx.moveTo(-PW*2, PD); ctx.lineTo(PW*2, PD); ctx.stroke();
  ctx.setLineDash([]);
`;
r = r.replace(/function renderWater[\s\S]*?ctx\.stroke\(\);\s*(if\(typeof isWinter[\s\S]*?\})?\s*\}/, function(match) {
   return match.slice(0,-1) + boundary + "}";
});
fs.writeFileSync('js/render.js', r);

// 2. Scale Bar logic in ui.js
let u = fs.readFileSync('js/ui.js', 'utf8');
if (!u.includes('updateScaleBar')) {
  let scaleCode = `
function updateScaleBar() {
   var sw = document.getElementById('scaleW');
   if(!sw) return;
   if(state !== 'playing') { sw.style.display = 'none'; return; }
   sw.style.display = 'block';
   // 100 micrometers
   var pixels = 100 * zoom;
   var sl = document.getElementById('scaleL');
   if(sl) sl.style.width = Math.max(10, pixels) + 'px';
}
`;
  u += "\n" + scaleCode;
}
u = u.replace("updateLegend();", "updateLegend(); updateScaleBar();");
fs.writeFileSync('js/ui.js', u);

// 3. Make sure scaleW is un-hidden by default, the CSS display:none on html is removed
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('<div id="scaleW" style="display:none">', '<div id="scaleW">');
fs.writeFileSync('index.html', html);

console.log('Scale bar and Abyss boundary added!');
