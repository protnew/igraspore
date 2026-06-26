const fs = require('fs');

let world = fs.readFileSync('js/world.js', 'utf8');

let newProducerAI = `  if(cat==='producer'){
    var lightHere=lightAt(o.y);
    if(lightHere<0.3&&o.y>200)o.vy-=speed*dt*6; // stronger upward pull
    
    // Phototaxis: seek horizontal light beams (sunRays)
    if(sunRays.length>0){
      var bestDx=9999;
      for(var r=0;r<sunRays.length;r++){
        var rx = sunRays[r].x + o.y * sunRays[r].angle;
        var dx = rx - o.x;
        if(Math.abs(dx)<Math.abs(bestDx)) bestDx=dx;
      }
      if(Math.abs(bestDx) > 10 && Math.abs(bestDx) < 400){
        o.vx += Math.sign(bestDx) * speed * dt * 8; // strong pull into the beam
      }
    }
    
    o.vx+=rng(-0.3,0.3)*speed*dt*5;o.vy+=rng(-0.2,0.2)*speed*dt*5;
    if(o.vx || o.vy) o.angle = Math.atan2(o.vy, o.vx);
    return;
  }`;

world = world.replace(/if\(cat==='producer'\)\{[\s\S]*?return;\n  \}/, newProducerAI);

fs.writeFileSync('js/world.js', world);
console.log('Patched phototaxis!');
