import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import type { Insight, TimelineEntry, VoiceCaptureSession } from '@daily-timeline/types';
import { registerScreenshotRoutes } from '../services/screenshots/routes';
import { InMemoryScreenshotStorage } from '../services/screenshots/storage';

function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });

  const timelineEntries: TimelineEntry[] = [];
  const voiceSessions: VoiceCaptureSession[] = [];
  const insights: Insight[] = [];
  const screenshotStorage = new InMemoryScreenshotStorage();

  app.get('/health', async () => ({ ok: true, service: 'daily-timeline-api' }));
  app.get('/timeline/entries', async () => ({ data: timelineEntries }));
  app.get('/voice/sessions', async () => ({ data: voiceSessions }));
  registerScreenshotRoutes(app, { storage: screenshotStorage, timelineEntries, insights });
  app.get('/insights', async () => ({ data: insights }));

  return app;
}

describe('API server routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health returns service status', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true, service: 'daily-timeline-api' });
  });

  it('GET /screenshots/events returns array shape', async () => {
    const response = await app.inject({ method: 'GET', url: '/screenshots/events' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ data: [] });
  });

  it('POST /screenshots/events stores enriched screenshot event and creates timeline entry', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/screenshots/events',
      payload: {
        imageUrl: 'https://storage.example.com/editor-error-warning.png',
        capturedAt: '2024-01-15T09:00:00.000Z',
        windowTitle: 'VSCode deploy warning',
        hintedText: 'TODO fix deploy error before review',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.data.imageUrl).toContain('editor-error-warning');
    expect(body.data.taskClues).toContain('todo');
    expect(body.data.anomalies).toContain('error');

    const listResponse = await app.inject({ method: 'GET', url: '/screenshots/events' });
    expect(listResponse.json().data).toHaveLength(1);

    const timelineResponse = await app.inject({ method: 'GET', url: '/timeline/entries' });
    expect(timelineResponse.json().data).toHaveLength(1);

    const insightResponse = await app.inject({ method: 'GET', url: '/insights' });
    expect(insightResponse.json().data).toHaveLength(1);
    expect(insightResponse.json().data[0].summary).toContain('Possible missed detail');
  });

  it('POST /screenshots/events validates payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/screenshots/events',
      payload: { imageUrl: 'not-a-url' },
    });

    expect(response.statusCode).toBe(400);
  });
});
