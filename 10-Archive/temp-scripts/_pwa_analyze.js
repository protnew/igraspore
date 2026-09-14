
const https = require('https');

const PWA_URL = 'https://igraspore.pages.dev';

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: options.headers || {} }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

function post(url, body, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...options.headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  // Step 1: Analyze PWA via PWABuilder
  console.log('Analyzing PWA...');
  try {
    const analyzeResult = await post('https://www.pwabuilder.com/api/analyze', { url: PWA_URL });
    console.log('Analyze status:', analyzeResult.status);
    if (analyzeResult.body) {
      const parsed = JSON.parse(analyzeResult.body);
      console.log('Manifest detected:', !!parsed.manifest);
      console.log('SW detected:', !!parsed.serviceWorker);
      console.log('PWA score:', parsed.score || 'N/A');
      console.log('Installable:', parsed.installable);
    }
  } catch(e) {
    console.log('Analyze error:', e.message);
  }
})();
