#!/usr/bin/env bash
# Make the script executable
# chmod +x .platform/hooks/postdeploy/00_pm2_restart.sh

# Navigate to application directory
cd /var/app/current || exit 1

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

# Start or restart the backend process
pm2 start dist/server.js --name manifestme-backend --update-env || pm2 restart manifestme-backend --update-env

# Save PM2 process list to resurrect on reboot
pm2 save

# Ensure PM2 restarts on system reboot
pm2 startup systemd -u webapp --hp /home/webapp
