// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'manifestme-backend',
      script: 'server.ts',                     // relative path from project root
      interpreter: 'npx',                      // use npx to run ts-node
      interpreter_args: 'ts-node',             // run with ts-node
      watch: false,                            // set to true to auto-reload on changes
      instances: 1,
      autorestart: true,
      max_memory_restart: '500M',
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
