const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
let errorReported = false;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/error') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      console.log('BROWSER ERROR CAUGHT:', body);
      errorReported = true;
      res.end('ok');
      setTimeout(() => process.exit(0), 500);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/success') {
    console.log('BROWSER REPORTED SUCCESS!');
    res.end('ok');
    setTimeout(() => process.exit(0), 500);
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (req.url === '/' || req.url === '/index.html') {
      let inject = `
      <script>
        window.onerror = function(msg, url, line, col, error) {
          fetch('/error', {method: 'POST', body: msg + ' at ' + line + ':' + col});
        };
        window.addEventListener('unhandledrejection', function(e) {
          fetch('/error', {method: 'POST', body: e.reason});
        });
        setTimeout(() => {
          if(!document.getElementById('startBtn').textContent) {
             fetch('/error', {method: 'POST', body: 'startBtn is empty!'});
          } else {
             fetch('/success', {method: 'POST'});
          }
        }, 1000);
      </script>
      `;
      content = content.replace('<head>', '<head>' + inject);
    }
    res.end(content);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  exec(`start chrome http://localhost:${PORT}`);
  setTimeout(() => {
    if (!errorReported) {
      console.log('Timeout waiting for browser.');
      process.exit(1);
    }
  }, 10000);
});
