module.exports = {
  apps: [
    {
      name: "manifestme-backend",
      script: "./dist/server.js",
      watch: false,
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
