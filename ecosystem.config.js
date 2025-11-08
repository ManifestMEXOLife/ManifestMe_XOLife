/** 
 * ecosystem.config.js
 * PM2 configuration for ManifestMe_XOLife backend (TypeScript)
 */

module.exports = {
  apps: [
    {
      name: 'manifestme-backend',              // Name of your app
      script: './server.ts',                   // Entry file
      interpreter: './node_modules/.bin/ts-node', // Use local ts-node
      watch: false,                            // Set true to auto-restart on changes
      instances: 1,                            // Number of instances (1 for fork mode)
      autorestart: true,                       // Auto restart if it crashes
      max_memory_restart: '500M',              // Restart if memory exceeds limit
      env: {
        NODE_ENV: 'development',
        PORT: 8080,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
