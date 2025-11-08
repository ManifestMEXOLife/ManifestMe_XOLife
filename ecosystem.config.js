module.exports = {
  apps: [
    {
      name: 'manifestme-backend',
      script: './server.ts',          // path relative to this config file
      interpreter: './node_modules/.bin/ts-node', // use ts-node to run TS directly
      watch: true,                    // restart on file changes
      ignore_watch: ['node_modules', 'dist', 'logs'],
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
