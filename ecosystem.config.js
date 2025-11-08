module.exports = {
  apps: [
    {
      name: 'manifestme-backend',
      script: 'server.ts',                       // no "./", just the filename is fine
      interpreter: 'ts-node',                     // ts-node from node_modules
      watch: true,
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
