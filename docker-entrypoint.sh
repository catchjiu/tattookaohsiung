#!/bin/sh
set -e

# Wait for PostgreSQL to be ready, then run migrations
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database..."
  sleep 5
  echo "Running migrations..."
  node ./node_modules/prisma/build/index.js migrate deploy
  echo "Migrations complete."

  # Sync admin user from ADMIN_EMAIL + ADMIN_PASSWORD (Coolify env vars)
  if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "Syncing admin user..."
    npx tsx prisma/bootstrap-admin.ts || true
  fi
fi

exec node server.js
