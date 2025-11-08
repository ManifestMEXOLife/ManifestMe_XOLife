module.exports = {
  apps: [
    {
      name: 'manifestme-backend',
      script: './server.ts',                      // root-level server.ts
      interpreter: './node_modules/.bin/ts-node', // run TypeScript via ts-node
      watch: true,                                // restart on changes
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
