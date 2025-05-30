#!/bin/bash
# Script to run AdonisJS production server from build directory
# Make it executable with chmod +x start-prod.sh before running on Linux/macOS.

npm run build || exit 1

cp .env build/.env
cd build || exit 1
npm ci --omit=dev
# run migrations
node ace migration:run
node bin/server.js