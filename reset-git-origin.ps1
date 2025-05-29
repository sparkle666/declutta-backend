# Powershell script to reset git origin to a new remote
# Usage: Run this script in your project root

git remote remove origin

git remote add origin https://github.com/sparkle666/declutta-backend

git remote -v
