#!/usr/bin/env bash
set -euo pipefail
rm -rf www
mkdir -p www
rsync -a \
  --exclude '.git' --exclude '.github' --exclude 'node_modules' \
  --exclude 'android' --exclude 'apk-icons' --exclude 'www' --exclude 'keystore' --exclude 'scripts' \
  --exclude 'package.json' --exclude 'package-lock.json' --exclude 'capacitor.config.json' \
  --exclude '.gitignore' --exclude 'api' --exclude 'vercel.json' --exclude 'package-lock.json.bak' --exclude '*.md' --exclude 'get/*.apk' \
  ./ www/
ls -la www
