# Daily Timeline

Initial monorepo scaffold for a real-time "rolling daily timeline" application with clear boundaries between capture, storage, analysis, and presentation.

## Monorepo Layout

```text
apps/
  frontend/   # Timeline canvas + end-of-day review UI
  backend/    # API + websocket ingestion/retrieval service
packages/
  domain/     # Shared domain models/types
  config/     # Provider and local device configuration
```

## Architecture Boundaries

### Capture
* Transcript and screenshot producers send events to backend ingestion endpoints.
* Websocket channels exist for low-latency event streams (`/ws/transcript`, `/ws/screenshot`, `/ws/review`).

### Storage
* Backend has dedicated in-memory stores/services (`TimelineStore`, `ReviewSessionStore`) and a `DeepSearchQueue` for asynchronous augmentation jobs.
* These are isolated in `apps/backend/src/services` to make persistence swaps easy (SQLite/Postgres/Redis later).

### Analysis
* `POST /jobs/deep-search` creates enrichment jobs tied to timeline entries.
* Shared model types include `GeneratedInsight` and `ReviewCorrection` to support generated summaries and human corrections.

### Presentation
* Frontend contains a `TimelineCanvas` component for rolling timeline playback.
* Frontend contains `EndOfDayReviewPanel` for daily review session controls and correction acceptance.

## API + Channel Surface (Initial)

### REST API
* `POST /ingest/transcript` — live transcript ingestion.
* `POST /ingest/screenshot` — screenshot event ingestion.
* `GET /timeline` — timeline entry retrieval.
* `POST /jobs/deep-search` and `GET /jobs/deep-search` — search/deep-search augmentation jobs.
* `GET /review/session` and `PUT /review/session` — end-of-day review session state.
* `GET /health` — service health check.

### Websocket Channels
* `/ws/transcript`
* `/ws/screenshot`
* `/ws/review`

## Shared Domain Models

`packages/domain/src/models.ts` defines:
* Timeline entries
* Voice transcript segments
* Screenshots
* Projects / tasks / context tags
* Generated insights
* Review corrections
* End-of-day review session

## Provider + Device Configuration

`packages/config` includes configuration points for:
* Speech-to-text provider selection
* Search provider selection
* Screenshot analysis provider selection
* Image generation provider selection
* Local audio devices
* Screenshot capture mode/interval/retention/path

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the API service:
   ```bash
   npm run dev:api

## Real-Time Event Flow (Short)

1. Local capture services produce transcript and screenshot events.
2. Events are ingested through backend REST endpoints and optionally fanned out over websocket channels.
3. Backend normalizes events into `TimelineEntry` records.
4. Frontend pulls timeline entries and renders the rolling canvas.
5. Deep-search jobs augment context and generate insights.
6. End-of-day review session applies user corrections that feed future analysis quality.
