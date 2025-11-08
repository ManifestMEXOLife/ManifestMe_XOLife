/** ecosystem.config.js */
import path from 'path';

module.exports = {
  apps: [
    {
      name: 'manifestme-backend-dev',       // App name for development
      script: './dist/server.js',           // Compiled JS entry point
      watch: true,                          // Watch for file changes
      ignore_watch: ['node_modules', 'logs'], // Ignore logs & node_modules
      env: {
        NODE_ENV: 'development',
        PORT: 8080,
      },
      error_file: path.join(__dirname, 'logs', 'error.log'),
      out_file: path.join(__dirname, 'logs', 'combined.log'),
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      autorestart: true,                     // Auto-restart on crash
      max_restarts: 10,                      // Max restart attempts
      min_uptime: '5s',                      // Minimum uptime before considered stable
    },
    {
      name: 'manifestme-backend-prod',      // App name for production
      script: './dist/server.js',
      watch: false,                          // No watching in production
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      error_file: path.join(__dirname, 'logs', 'error.log'),
      out_file: path.join(__dirname, 'logs', 'combined.log'),
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '5s',
    },
  ],

  deploy: {
    production: {
      user: 'your-username',                 // SSH user for deployment
      host: 'your-server-ip',                // Server IP
      ref: 'origin/main',                    // Git branch
      repo: 'git@github.com:your-repo.git',  // Git repo
      path: '/var/www/manifestme-backend',   // Deployment path
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --only manifestme-backend-prod',
      'pre-setup': '',
    },
  },
};
