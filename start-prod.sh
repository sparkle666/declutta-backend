#!/bin/bash
# Script to run AdonisJS production server from build directory
# Make it executable with chmod +x start-prod.sh before running on Linux/macOS.

# npm run build || exit 1




#!/bin/bash
# Build script
set -e  # Exit on any error

# 1. Build the application
echo "Building application..."
npm run build

# 2. Copy static files
echo "Copying static files..."
cp swagger.yml build/
cp swagger.json build/
cp .env build/.env

# 3. Install production dependencies
echo "Installing production dependencies..."
cd build
npm ci --omit=dev

# 4. Run migrations
echo "Running migrations..."
node ace migration:run

# 5. Generate docs in build directory (if needed for production)
# echo "Generating documentation..."
# node ace docs:generate


# 6. Start server
echo "Starting production server..."
node bin/server.js