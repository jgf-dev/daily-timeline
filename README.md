# Daily Timeline (Minimal Full-Stack Starter)

A minimal full-stack application that separates:

- **Capture**: API endpoints for timeline events, transcript chunks, screenshots, and diary data.
- **Storage**: SQLite schema for sessions + timestamped artifacts.
- **Analysis**: background job modules and integration provider stubs.
- **UI**: browser UI with timeline canvas, review workflow, and settings section.

## Project Layout

- `server/`
  - `routes/`: API routes (`/api/sessions`, `/api/events`, `/api/insights`)
  - `jobs/`: background pipelines (enrichment + review)
  - `integrations/`: provider adapters for transcription, voice chat, screenshot analysis, image generation
  - `storage/`: SQLite initialization + repositories
  - `config.ts`: env/secret loading and validation
- `app/`
  - `index.html`: timeline canvas view, review session UI, settings screen
  - `scripts/main.js`: browser behavior
  - `styles/main.css`: minimal styling
- `shared/models.ts`
  - shared domain models for `DiaryEntry`, `TranscriptSegment`, `ScreenshotEvent`, `Insight`, `ProjectContext`, and `DailySession`
- `.env.example`
  - local development configuration + secret placeholders

## Requirements

- Node.js 20+

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template:
   ```bash
   cp .env.example .env
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open:
   - `http://localhost:3000` for UI
   - `http://localhost:3000/api/health` for API health

## API Quickstart

Create a session:

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H 'Content-Type: application/json' \
  -d '{"timezone":"UTC","status":"active"}'
```

Add timestamped event:

```bash
curl -X POST http://localhost:3000/api/events \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"<session-id>","eventType":"activity","payload":{"source":"desktop"}}'
```

Add insight (review result):

```bash
curl -X POST http://localhost:3000/api/insights \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"<session-id>","content":"Focused coding block after lunch"}'
```

## Persistence Model

`server/storage/db.ts` defines tables for:

- sessions
- diary entries
- transcript segments
- screenshot events
- timestamped events
- insights (enrichment results)
- user corrections

The SQLite DB file is controlled by `DATABASE_PATH` (defaults to `./data/daily-timeline.db`).

## Notes

- Integration clients are intentionally lightweight stubs so you can wire real APIs later.
- This setup aims to be a clean starting point, not a production-ready architecture.
