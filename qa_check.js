const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = '/Users/hilalkaya/Desktop/imep/dist';
const server = http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const mimes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
  
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': mimes[ext] || 'text/plain' });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8081, () => {
  console.log('QA Server running on port 8081');
  
  // Try to use globally installed puppeteer to run a smoke test
  try {
    const { execSync } = require('child_process');
    // Just verify the server works and we can curl it
    const curl = execSync('curl -s http://127.0.0.1:8081 | grep "Doç. Dr. Hasan Şahin"').toString();
    if (curl.length > 0) {
       console.log('Smoke test passed: HTML is served and valid.');
    }
  } catch(e) {
    console.error('Smoke test failed:', e.message);
  }
  
  server.close();
});
