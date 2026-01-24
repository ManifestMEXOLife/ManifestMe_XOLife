const path = require('path');

module.exports = {
  apps: [
    {
      name: 'manifestme-backend-dev',
      script: './dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false, // set true for hot reload in dev if needed
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'development',
        PORT: 8080,
        LOG_DIR: path.join(__dirname, 'logs'),
      },
      error_file: path.join(__dirname, 'logs', 'error-dev.log'),
      out_file: path.join(__dirname, 'logs', 'out-dev.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'manifestme-backend-prod',
      script: './dist/server.js',
      instances: 1, // use 'max' for cluster mode if needed
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
        LOG_DIR: path.join(__dirname, 'logs'),
      },
      error_file: path.join(__dirname, 'logs', 'error-prod.log'),
      out_file: path.join(__dirname, 'logs', 'out-prod.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',               // SSH user
      host: ['YOUR_SERVER_IP'],      // Replace with your server IP
      ref: 'origin/main',            // Git branch to deploy
      repo: 'git@github.com:YOUR_REPO.git', // Replace with your repo
      path: '/home/ubuntu/backend',  // Remote path
      'pre-deploy-local': '',
      'post-deploy':
        'npm ci && npm run build && pm2 reload ecosystem.config.js --only manifestme-backend-prod',
      env: {
        NODE_ENV: 'production',
      },
    },
    development: {
      user: 'ubuntu',
      host: ['YOUR_DEV_SERVER_IP'],
      ref: 'origin/develop',
      repo: 'git@github.com:YOUR_REPO.git',
      path: '/home/ubuntu/backend',
      'post-deploy':
        'npm ci && npm run build && pm2 reload ecosystem.config.js --only manifestme-backend-dev',
      env: {
        NODE_ENV: 'development',
      },
    },
  },
};
