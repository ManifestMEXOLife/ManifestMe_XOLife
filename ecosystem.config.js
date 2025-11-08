module.exports = {
  apps: [
    {
      name: "manifestme-backend",
      // Use ts-node in development
      script: "./server.ts",
      instances: 1,
      autorestart: true,
      watch: false,
      interpreter: "ts-node",
      interpreter_args: "-r tsconfig-paths/register",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        // Override script and interpreter for production
        script: "./dist/server.js",
        interpreter: "node",
      },
    },
  ],
};
