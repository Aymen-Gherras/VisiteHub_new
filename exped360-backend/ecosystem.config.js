const path = require('path');

module.exports = {
  apps: [{
    name: 'visiteapihub-backend',
    script: path.join(__dirname, 'dist', 'main.js'),
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: path.join(__dirname, 'logs', 'err.log'),
    out_file: path.join(__dirname, 'logs', 'out.log'),
    log_file: path.join(__dirname, 'logs', 'combined.log'),
    time: true,
    node_args: `-r ${path.join(__dirname, 'polyfill.js')}`
  }]
};