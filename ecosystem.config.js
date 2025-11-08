module.exports = {
  apps: [
    {
      name: "manifestme-backend",
      script: "./server.ts",
      interpreter: "ts-node",
      watch: true,
      env: {
        NODE_ENV: "development",
        PORT: 8080
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080
      }
    }
  ]
};
