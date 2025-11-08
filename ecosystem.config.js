module.exports = {
  apps: [
    {
      name: "manifestme-backend",
      script: "./dist/server.js",  // points to the compiled JS
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
