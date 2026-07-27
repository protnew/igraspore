const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

code = code.replace(/document\.getElementById\('bPause'\)\.addEventListener\('click',function\(\)\{/, 
`
// Leaderboard Logic
window.saveToLeaderboard = function(org) {
    if(!org) return;
    let score = {
        spName: org.sp.name,
        size: Math.round(org.size),
        age: Math.round(org.age),
        eaten: org.eaten,
        date: new Date().toLocaleDateString()
    };
    let lb = JSON.parse(localStorage.getItem('igraspore_lb') || '[]');
    lb.push(score);
    lb.sort((a,b) => b.size - a.size); // Sort by max size
    if(lb.length > 10) lb = lb.slice(0, 10);
    localStorage.setItem('igraspore_lb', JSON.stringify(lb));
};

function showLeaderboard() {
    let lb = JSON.parse(localStorage.getItem('igraspore_lb') || '[]');
    let html = '';
    if(lb.length===0) html = 'No records yet.';
    else {
        lb.forEach((s,i) => {
            html += \`\${i+1}. \${s.spName} | Size: \${s.size} | Age: \${s.age} | Eaten: \${s.eaten} <br>\`;
        });
    }
    document.getElementById('lbList').innerHTML = html;
    document.getElementById('leaderboardO').classList.add('show');
}
document.getElementById('btnLeaderboard').addEventListener('click', showLeaderboard);
document.getElementById('lbClose').addEventListener('click', () => document.getElementById('leaderboardO').classList.remove('show'));

// Sandbox Tools
let sbOpen = false;
document.getElementById('bSandbox').addEventListener('click', function(){
    sbOpen = !sbOpen;
    document.getElementById('sandboxTools').style.display = sbOpen ? 'block' : 'none';
});
document.getElementById('btnAcid').addEventListener('click', function(){
    window.globalCatastrophe = {active: true, type: 'acid', timer: 30};
});
document.getElementById('btnEclipse').addEventListener('click', function(){
    window.globalCatastrophe = {active: true, type: 'eclipse', timer: 30};
});

document.getElementById('bPause').addEventListener('click',function(){`);

// Save leaderboard when player dies
code = code.replace(/document\.getElementById\('deadO'\)\.classList\.add\('show'\);/, 
`if(player) window.saveToLeaderboard(player);
  document.getElementById('deadO').classList.add('show');`);

fs.writeFileSync('js/ui.js', code, 'utf8');
console.log('ui.js patched successfully!');
