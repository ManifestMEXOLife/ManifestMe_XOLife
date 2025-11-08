module.exports = {
  apps: [
    {
      name: "manifestme-backend",
      script: "./server.ts",    // relative to ManifestMe_XOLife
      interpreter: "ts-node",   // use ts-node to run TypeScript
      watch: true,              // optional: restart on changes
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
