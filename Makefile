SHELL := /bin/bash

.PHONY: up down reset logs install env migrate seed dev check

up:
	./scripts/dev-up.sh

down:
	./scripts/dev-down.sh

reset:
	docker compose down -v
	rm -rf node_modules
	rm -f .env

logs:
	docker compose logs -f db

install:
	npm install

env:
	@if [ ! -f .env ]; then cp .env.example .env; echo ".env created from .env.example"; else echo ".env already exists"; fi

migrate:
	npx prisma generate
	npx prisma migrate dev --name init || true

dev:
	npm run dev

check:
	npx prisma validate
	npm run check