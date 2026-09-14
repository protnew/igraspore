const fs = require('fs');

let worldJS = fs.readFileSync('04-Src/js/world.js', 'utf8');
worldJS = worldJS.replace(
  window.spatialGrid = {};\r\n  for(var i=0;i<orgs.length;i++) {\r\n     var o=orgs[i];\r\n     if(!o.alive) continue;\r\n     var gx = Math.floor(o.x / 400);\r\n     var gy = Math.floor(o.y / 400);\r\n     var k = gx+','+gy;\r\n     if(!window.spatialGrid[k]) window.spatialGrid[k]=[];\r\n     window.spatialGrid[k].push(o);\r\n  },
  window.spatialGrid = {};\n  window.spatialGridLarge = {};\n  for(var i=0;i<orgs.length;i++) {\n     var o=orgs[i];\n     if(!o.alive) continue;\n     if (o.size > 30) {\n        var gxL = Math.floor(o.x / 1000);\n        var gyL = Math.floor(o.y / 1000);\n        var kL = gxL+','+gyL;\n        if(!window.spatialGridLarge[kL]) window.spatialGridLarge[kL]=[];\n        window.spatialGridLarge[kL].push(o);\n     }\n     var gx = Math.floor(o.x / 400);\n     var gy = Math.floor(o.y / 400);\n     var k = gx+','+gy;\n     if(!window.spatialGrid[k]) window.spatialGrid[k]=[];\n     window.spatialGrid[k].push(o);\n  }
);
// In case it used \n
worldJS = worldJS.replace(
  window.spatialGrid = {};\n  for(var i=0;i<orgs.length;i++) {\n     var o=orgs[i];\n     if(!o.alive) continue;\n     var gx = Math.floor(o.x / 400);\n     var gy = Math.floor(o.y / 400);\n     var k = gx+','+gy;\n     if(!window.spatialGrid[k]) window.spatialGrid[k]=[];\n     window.spatialGrid[k].push(o);\n  },
  window.spatialGrid = {};\n  window.spatialGridLarge = {};\n  for(var i=0;i<orgs.length;i++) {\n     var o=orgs[i];\n     if(!o.alive) continue;\n     if (o.size > 30) {\n        var gxL = Math.floor(o.x / 1000);\n        var gyL = Math.floor(o.y / 1000);\n        var kL = gxL+','+gyL;\n        if(!window.spatialGridLarge[kL]) window.spatialGridLarge[kL]=[];\n        window.spatialGridLarge[kL].push(o);\n     }\n     var gx = Math.floor(o.x / 400);\n     var gy = Math.floor(o.y / 400);\n     var k = gx+','+gy;\n     if(!window.spatialGrid[k]) window.spatialGrid[k]=[];\n     window.spatialGrid[k].push(o);\n  }
);
fs.writeFileSync('04-Src/js/world.js', worldJS);

let aiJS = fs.readFileSync('04-Src/js/ai.js', 'utf8');
aiJS = aiJS.replace(
window.getNearby = function(x, y, radius) {\r\n   var res=[];\r\n   if(!window.spatialGrid) return orgs;\r\n   var r = Math.ceil(radius/1000);\r\n   var cx = Math.floor(x/1000);\r\n   var cy = Math.floor(y/1000);\r\n   for(var gx=cx-r; gx<=cx+r; gx++){\r\n     for(var gy=cy-r; gy<=cy+r; gy++){\r\n        var arr = window.spatialGrid[gx+','+gy];\r\n        if(arr) {\r\n            for(var i=0; i<arr.length; i++) res.push(arr[i]);\r\n        }\r\n     }\r\n   }\r\n   return res;\r\n};,
window.getNearby = function(x, y, radius, isLargeCaller) {\n   var res=[];\n   if(!window.spatialGrid) return orgs;\n   if (isLargeCaller && window.spatialGridLarge) {\n       var rL = Math.ceil(radius/1000);\n       var cxL = Math.floor(x/1000);\n       var cyL = Math.floor(y/1000);\n       for(var gx=cxL-rL; gx<=cxL+rL; gx++){\n         for(var gy=cyL-rL; gy<=cyL+rL; gy++){\n            var arr = window.spatialGridLarge[gx+','+gy];\n            if(arr) {\n                for(var i=0; i<arr.length; i++) res.push(arr[i]);\n            }\n         }\n       }\n       return res;\n   }\n   var r = Math.ceil(radius/400);\n   var cx = Math.floor(x/400);\n   var cy = Math.floor(y/400);\n   for(var gx=cx-r; gx<=cx+r; gx++){\n     for(var gy=cy-r; gy<=cy+r; gy++){\n        var arr = window.spatialGrid[gx+','+gy];\n        if(arr) {\n            for(var i=0; i<arr.length; i++) res.push(arr[i]);\n        }\n     }\n   }\n   return res;\n};
);
aiJS = aiJS.replace(
window.getNearby = function(x, y, radius) {\n   var res=[];\n   if(!window.spatialGrid) return orgs;\n   var r = Math.ceil(radius/1000);\n   var cx = Math.floor(x/1000);\n   var cy = Math.floor(y/1000);\n   for(var gx=cx-r; gx<=cx+r; gx++){\n     for(var gy=cy-r; gy<=cy+r; gy++){\n        var arr = window.spatialGrid[gx+','+gy];\n        if(arr) {\n            for(var i=0; i<arr.length; i++) res.push(arr[i]);\n        }\n     }\n   }\n   return res;\n};,
window.getNearby = function(x, y, radius, isLargeCaller) {\n   var res=[];\n   if(!window.spatialGrid) return orgs;\n   if (isLargeCaller && window.spatialGridLarge) {\n       var rL = Math.ceil(radius/1000);\n       var cxL = Math.floor(x/1000);\n       var cyL = Math.floor(y/1000);\n       for(var gx=cxL-rL; gx<=cxL+rL; gx++){\n         for(var gy=cyL-rL; gy<=cyL+rL; gy++){\n            var arr = window.spatialGridLarge[gx+','+gy];\n            if(arr) {\n                for(var i=0; i<arr.length; i++) res.push(arr[i]);\n            }\n         }\n       }\n       return res;\n   }\n   var r = Math.ceil(radius/400);\n   var cx = Math.floor(x/400);\n   var cy = Math.floor(y/400);\n   for(var gx=cx-r; gx<=cx+r; gx++){\n     for(var gy=cy-r; gy<=cy+r; gy++){\n        var arr = window.spatialGrid[gx+','+gy];\n        if(arr) {\n            for(var i=0; i<arr.length; i++) res.push(arr[i]);\n        }\n     }\n   }\n   return res;\n};
);

aiJS = aiJS.replace('var near1 = window.getNearby(o.x, o.y, 2000);', 'var near1 = window.getNearby(o.x, o.y, 2000, o.size > 150);');
aiJS = aiJS.replace('var near2 = window.getNearby(o.x, o.y, 500);', 'var near2 = window.getNearby(o.x, o.y, 500, o.size > 150);');
aiJS = aiJS.replace('var near3 = window.getNearby(o.x, o.y, 500);', 'var near3 = window.getNearby(o.x, o.y, 500, o.size > 150);');
aiJS = aiJS.replace('var near4 = window.getNearby(o.x, o.y, 400);', 'var near4 = window.getNearby(o.x, o.y, 400, o.size > 150);');

fs.writeFileSync('04-Src/js/ai.js', aiJS);
console.log('Patched');
