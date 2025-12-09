const http = require('http');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (pathname === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
  } else if (pathname === '/device') {
    // /device?venue=<venueId>&name=<deviceName>&state=on|off
    // /device?venue=<venueId>&name=<deviceName>&value=<0-100>

    // Simulate delay
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'success',
        message: 'Command received',
        ...query
      }));
    }, 100);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Mock ESP32 Server running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET /ping');
  console.log('  GET /device?name=light&state=on');
});
