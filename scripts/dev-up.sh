#!/usr/bin/env bash
set -euo pipefail

echo "==> Ensuring .env exists"
if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created from .env.example"
else
  echo ".env already exists"
fi

echo "==> Starting local Postgres"
docker compose up -d db

echo "==> Waiting for Postgres to become healthy"
until docker compose exec -T db pg_isready -U sveltetracker -d sveltetracker >/dev/null 2>&1; do
  sleep 1
done

echo "==> Installing npm dependencies"
npm install

echo "==> Generating Prisma client"
npx prisma generate

echo "==> Applying database migrations"
npx prisma migrate deploy || npx prisma migrate dev --name local_init

echo "==> Seeding local dev user/profile"
node ./scripts/seed-dev-user.mjs

echo "==> Starting app"
npm run dev