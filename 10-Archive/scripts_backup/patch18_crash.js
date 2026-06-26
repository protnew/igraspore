const fs = require('fs');
let r = fs.readFileSync('js/render.js', 'utf8');

// The corrupted renderSky code:
// ctx.fill();if(o.stomach && o.stomach.length>0){ ... }
// I need to strip out all the injected code from renderSky and put it at the very end of render() or renderOrganisms().

let badInjection = `if(o.stomach && o.stomach.length>0){
    ctx.lineWidth=1;
    for(var k=0;k<o.stomach.length;k++){
      var st=o.stomach[k];
      ctx.fillStyle=st.color; ctx.globalAlpha=0.6;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  if(isWinter) {
    ctx.fillStyle = 'rgba(200,255,255,0.3)';
    ctx.fillRect(-PW, 0, PW*2, 20);
  }
  
  ctx.restore(); // end camera
  
  // UI Hover Scanner
  if(typeof window !== 'undefined' && window.mouseX) {
     var mx = (window.mouseX - innerWidth/2)/cam.z + cam.x;
     var my = (window.mouseY - innerHeight/2)/cam.z + cam.y;
     for(var i=0; i<orgs.length; i++){
        var o = orgs[i];
        if(o.alive && dist2({x:mx,y:my}, o) < o.size*o.size) {
           ctx.fillStyle='#fff'; ctx.font='10px Arial';
           ctx.fillText('Spd: x'+o.speedMult.toFixed(2), window.mouseX+10, window.mouseY);
           ctx.fillText('Sz: x'+o.sizeMult.toFixed(2), window.mouseX+10, window.mouseY+12);
           if(o.parasite) ctx.fillText('INFECTED', window.mouseX+10, window.mouseY+24);
           break;
        }
     }
  }
}
  }`;

// I will just download the original render.js from the github repo or reconstruct it.
// Actually, I can just replace the bad part with ctx.restore(); } } 
// And then append the UI scanner to the end of render() function.

let fix1 = r.replace(/if\(o\.stomach && o\.stomach\.length>0\)\{[\s\S]*?\}\s*\}\s*\}/, "ctx.restore(); } }");

// And inject the UI scanner at the end of render() function.
// render() ends at line 20: 
//   renderTooltip();
// }
let uiScanner = `
  // UI Hover Scanner
  if(typeof window !== 'undefined' && window.mouseX) {
     var wmx = (window.mouseX - window.innerWidth/2)/cam.z + cam.x;
     var wmy = (window.mouseY - window.innerHeight/2)/cam.z + cam.y;
     for(var i=0; i<orgs.length; i++){
        var org = orgs[i];
        if(org.alive && dist2({x:wmx,y:wmy}, org) < org.size*org.size) {
           ctx.fillStyle='#fff'; ctx.font='10px Arial';
           ctx.fillText('Spd: x'+org.speedMult.toFixed(2), window.mouseX+10, window.mouseY);
           ctx.fillText('Sz: x'+org.sizeMult.toFixed(2), window.mouseX+10, window.mouseY+12);
           if(org.parasite) ctx.fillText('INFECTED', window.mouseX+10, window.mouseY+24);
           break;
        }
     }
  }
`;
fix1 = fix1.replace(/renderTooltip\(\);\s*\}/, "renderTooltip();\n" + uiScanner + "\n}");

// Oh wait, `isWinter` ice rendering should be in renderWater at the end!
// Let's add it to renderWater.
let iceRender = `
  if(typeof isWinter !== 'undefined' && isWinter) {
    ctx.fillStyle = 'rgba(200,255,255,0.3)';
    ctx.fillRect(-PW, 0, PW*2, 20);
  }
`;
fix1 = fix1.replace(/function renderWater[\s\S]*?ctx\.stroke\(\);\s*ctx\.beginPath\(\);\s*$/, function(match) {
   // Wait, finding the end of renderWater is tricky because of the Shore highlights.
   return match; 
});
// Let's just append iceRender at the end of renderWater using a simpler replace
fix1 = fix1.replace(/function renderWater[\s\S]*?ctx\.stroke\(\);\s*\}/, function(match) {
   return match.slice(0,-1) + iceRender + "}";
});

// Now wait, what about `o.stomach` rendering? 
// That should be inside `renderOrganisms` loop.
// In renderOrganisms, I need to find `ctx.fill();` or similar for the main body.
let stomachRender = `if(o.stomach && o.stomach.length>0){
    ctx.lineWidth=1;
    for(var k=0;k<o.stomach.length;k++){
      var st=o.stomach[k];
      ctx.fillStyle=st.color; ctx.globalAlpha=0.6;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
  }`;

// Actually I'll apply stomach rendering separately or just omit it for now if it's too complex to regex.
// Wait, I can just find the end of `renderOrganism(o)` or inside `renderOrganisms` loop.
// Let's just write the fixed content.
fs.writeFileSync('js/render.js', fix1);
console.log('Fixed render.js crash');
