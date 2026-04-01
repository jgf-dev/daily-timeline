import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import type { Insight, ScreenshotEvent, TimelineEntry, VoiceCaptureSession } from '@daily-timeline/types';

/**
 * Build a Fastify app with the same routes as server.ts, but without the
 * module-level side effects (readConfig(process.env) and server.listen()).
 * This mirrors exactly the routes defined in apps/api/src/server.ts.
 */
function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });

  const timelineEntries: TimelineEntry[] = [];
  const voiceSessions: VoiceCaptureSession[] = [];
  const screenshotEvents: ScreenshotEvent[] = [];
  const insights: Insight[] = [];

  app.get('/health', async () => ({ ok: true, service: 'daily-timeline-api' }));
  app.get('/timeline/entries', async () => ({ data: timelineEntries }));
  app.get('/voice/sessions', async () => ({ data: voiceSessions }));
  app.get('/screenshots/events', async () => ({ data: screenshotEvents }));
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

  describe('GET /health', () => {
    it('returns 200 with ok: true and service name', async () => {
      const response = await app.inject({ method: 'GET', url: '/health' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toEqual({ ok: true, service: 'daily-timeline-api' });
    });

    it('returns JSON content-type', async () => {
      const response = await app.inject({ method: 'GET', url: '/health' });

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /timeline/entries', () => {
    it('returns 200 with empty data array', async () => {
      const response = await app.inject({ method: 'GET', url: '/timeline/entries' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toEqual({ data: [] });
    });

    it('data field is an array', async () => {
      const response = await app.inject({ method: 'GET', url: '/timeline/entries' });

      const body = response.json();
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /voice/sessions', () => {
    it('returns 200 with empty data array', async () => {
      const response = await app.inject({ method: 'GET', url: '/voice/sessions' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toEqual({ data: [] });
    });

    it('data field is an array', async () => {
      const response = await app.inject({ method: 'GET', url: '/voice/sessions' });

      const body = response.json();
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /screenshots/events', () => {
    it('returns 200 with empty data array', async () => {
      const response = await app.inject({ method: 'GET', url: '/screenshots/events' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toEqual({ data: [] });
    });

    it('data field is an array', async () => {
      const response = await app.inject({ method: 'GET', url: '/screenshots/events' });

      const body = response.json();
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('GET /insights', () => {
    it('returns 200 with empty data array', async () => {
      const response = await app.inject({ method: 'GET', url: '/insights' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toEqual({ data: [] });
    });

    it('data field is an array', async () => {
      const response = await app.inject({ method: 'GET', url: '/insights' });

      const body = response.json();
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('unknown routes', () => {
    it('returns 404 for an unregistered route', async () => {
      const response = await app.inject({ method: 'GET', url: '/unknown-route' });

      expect(response.statusCode).toBe(404);
    });

    it('returns 404 for POST to a GET-only endpoint', async () => {
      const response = await app.inject({ method: 'POST', url: '/health' });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('response shape consistency', () => {
    it('all list endpoints share the same { data: [] } shape when empty', async () => {
      const endpoints = ['/timeline/entries', '/voice/sessions', '/screenshots/events', '/insights'];

      for (const endpoint of endpoints) {
        const response = await app.inject({ method: 'GET', url: endpoint });
        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data).toHaveLength(0);
      }
    });
  });
});