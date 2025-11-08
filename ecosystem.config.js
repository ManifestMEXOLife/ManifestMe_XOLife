const path = require('path');

module.exports = {
  apps: [
    {
      name: 'manifestme-backend-dev',
      script: './dist/server.js',        // compiled JS
      watch: true,                       // auto-restart on changes
      instances: 1,
      autorestart: true,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'development',
        PORT: 8080,
      },
      error_file: path.join(__dirname, 'logs', 'dev-error.log'),
      out_file: path.join(__dirname, 'logs', 'dev-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
    {
      name: 'manifestme-backend-prod',
      script: './dist/server.js',       // compiled JS
      watch: false,                      // no watch in prod
      instances: 1,                      // single instance for now
      autorestart: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8080,
      },
      error_file: path.join(__dirname, 'logs', 'error.log'),
      out_file: path.join(__dirname, 'logs', 'out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],

  /**
   * Optional: deploy section (if you ever use PM2 deploy)
   */
  deploy: {
    production: {
      user: 'node',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/ManifestMe_XOLife.git',
      path: '/var/www/manifestme-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --only manifestme-backend-prod',
      'pre-setup': '',
    },
  },
};
