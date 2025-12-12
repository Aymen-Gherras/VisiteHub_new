const http = require('http');

console.log('Testing server connection...');

// Test if server is running
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is running! Status: ${res.statusCode}`);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.log('❌ Server is not running:', err.message);
  console.log('Please start the server first by running: node working-backend.js');
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.log('❌ Server connection timeout');
  req.destroy();
  process.exit(1);
});

req.end();
