#!/bin/bash
set -e

echo "🔄 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm ci

echo "⚙️ Building TypeScript..."
npm run build

echo "🚀 Reloading PM2 process..."
pm2 reload ecosystem.config.js --only manifestme-backend --env production

echo "✅ Deployment complete!"
