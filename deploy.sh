# Stop execution immediately if any command fails
set -e

echo "Starting deployment..."

cd ~/SketchFlow 

echo "pulling from production branch..."
git pull origin production

echo "installing dependencies..."
pnpm install

echo "Building Turborepo workspaces..."
pnpm run build

echo "Reloading PM2 processes..."
pm2 reload ecosystem.config.js --update-env

echo "Deployment complete!"