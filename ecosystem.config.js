module.exports = {
  apps: [
    {
      name: 'manifestme-backend',
      script: './server.ts',                      // exact path to your TS entry point
      interpreter: './node_modules/.bin/ts-node', // use ts-node for TypeScript
      watch: true,                                // auto-restart on changes
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
