module.exports = {
  apps: [
    {
      name: 'manifestme-backend-prod',
      script: './dist/server.js',  // must be JS
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/error.log',   // optional PM2-level logging
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    }
  ]
};
