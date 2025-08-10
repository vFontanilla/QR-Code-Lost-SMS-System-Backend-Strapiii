#!/usr/bin/env bash
set -e

# Ensure disk folders exist
mkdir -p /var/data/uploads
mkdir -p "$(dirname "${SQLITE_FILENAME:-/var/data/data.sqlite}")"

# Symlink public/uploads -> /var/data/uploads (persist across deploys)
if [ ! -L ./public/uploads ]; then
  rm -rf ./public/uploads || true
  ln -s /var/data/uploads ./public/uploads
fi

# Start Strapi
npm run start
