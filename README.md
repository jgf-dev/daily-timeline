[![build-bun](https://github.com/jgeofil/daily-timeline/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/jgeofil/daily-timeline/actions/workflows/build.yml)

# Daily Timeline Monorepo

Production-ready monorepo scaffold for a product that captures timeline events from voice, screenshots, and manual input, then generates daily insights and review sessions.

## Repository structure

```text
daily-timeline/
├── apps/
│   ├── api/         # Fastify backend for ingestion/orchestration/insights
│   └── web/         # React + Vite rolling timeline canvas UI starter
├── packages/
│   └── types/       # Shared domain model and schema contracts
├── .env.example     # Global env template
├── package.json     # Workspace root
└── tsconfig.base.json
```

## Domain model initialized

The shared package includes the key entities for end-to-end product evolution:

- `TimelineEntry`
- `VoiceCaptureSession`
- `ScreenshotEvent`
- `Insight`
- `DailyReviewSession`

These are defined in `packages/types/src/index.ts` and consumed by both web and API workspaces.

## Tech stack

- **Monorepo:** npm workspaces
- **Frontend (`apps/web`):** React + TypeScript + Vite
- **Backend (`apps/api`):** Fastify + TypeScript + Zod configuration validation
- **Shared contracts (`packages/types`):** TypeScript package for domain models

## Quick start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy templates and fill required secrets:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Required values to set for real environments:

- `JWT_SECRET`
- provider API keys (`OPENAI_API_KEY`, `DEEPGRAM_API_KEY`, etc.)
- storage credentials (`S3_*`)

### 3) Run services locally

```bash
npm run dev:api
npm run dev:web
```

- API default URL: `http://localhost:4000`
- Web default URL: `http://localhost:5173`

## Build and validation

```bash
npm run typecheck
npm run build
```

## Pre-commit checks

This repo includes a versioned Git pre-commit hook at `.githooks/pre-commit` that runs:

- `npm run lint`
- `npm run test`
- `npm run build`

Enable it locally:

```bash
git config core.hooksPath .githooks
```

## API starter routes

- `GET /health`
- `GET /timeline/entries`
- `GET /voice/sessions`
- `GET /screenshots/events`
- `GET /insights`

## Production-hardening checklist

Use this scaffold as the baseline and add:

- persistent storage (PostgreSQL + object storage)
- background jobs for transcription and insight generation
- event queue for ingestion pipelines
- authN/authZ middleware and request scoping by user
- observability (metrics, tracing, structured logs)
- CI/CD with lint, test, security scans, and migrations
