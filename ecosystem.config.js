module.exports = {
  apps: [
    {
      name: "manifestme-backend-dev",
      script: "./server.ts",
      instances: 1,
      autorestart: true,
      watch: true,
      interpreter: "ts-node",
      interpreter_args: "-r tsconfig-paths/register",
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "manifestme-backend-prod",
      script: "./dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
