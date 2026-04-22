SHELL := /bin/bash

.PHONY: up down api web seed lint test

up:
	docker compose up --build -d

down:
	docker compose down -v

api:
	cd apps/api && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8080

web:
	cd apps/web && npm run dev

seed:
	cd apps/api && uv run python -m app.workers.seed

lint:
	cd apps/api && uv run ruff check .
	cd apps/web && npm run lint

test:
	cd apps/api && uv run pytest -q
	cd apps/web && npm run test
