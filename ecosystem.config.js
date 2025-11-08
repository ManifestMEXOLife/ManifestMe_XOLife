module.exports = {
  apps: [
    {
      name: "manifestme-backend",
      script: "dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
};
