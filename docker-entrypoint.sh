#!/bin/sh
set -e

# Wait for PostgreSQL to be ready (when using docker-compose)
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database..."
  sleep 2
  npx prisma migrate deploy 2>/dev/null || true
fi

exec node server.js
