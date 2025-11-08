// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'manifestme-backend',
      script: './server.ts',       // relative path from project root
      interpreter: 'npx',          // use npx to run ts-node
      interpreter_args: 'ts-node', // tell npx to run ts-node
      watch: ['server.ts'],        // watch only server.ts for changes
      ignore_watch: ['node_modules', 'dist', 'logs'], // ignore these folders
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
