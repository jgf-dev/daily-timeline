import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { registerRoutes } from '../routes';

function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });
  registerRoutes(app);
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

  it('returns health status', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true, service: 'daily-timeline-api' });
  });

  it('accepts final transcripts and persists to timeline entries', async () => {
    const payload = {
      sessionId: 'session-a',
      chunkId: 'chunk-1',
      text: 'Finished writing project plan',
      startTime: '2026-04-04T10:00:00.000Z',
      endTime: '2026-04-04T10:00:05.000Z',
      isFinal: true,
      confidence: 0.93,
      deviceId: 'browser-mic-1',
      projectId: 'project-123',
      taskId: 'task-456'
    };

    const postResponse = await app.inject({ method: 'POST', url: '/api/transcription/chunk', payload });
    expect(postResponse.statusCode).toBe(200);
    expect(postResponse.json().accepted).toBe(true);

    const entriesResponse = await app.inject({ method: 'GET', url: '/timeline/entries' });
    const entries = entriesResponse.json().data;

    expect(entries).toHaveLength(1);
    expect(entries[0].speech).toMatchObject({
      utteranceStartAt: payload.startTime,
      utteranceEndAt: payload.endTime,
      confidence: payload.confidence,
      deviceId: payload.deviceId,
      sessionId: payload.sessionId,
      projectId: payload.projectId,
      taskId: payload.taskId
    });
  });

  it('rejects partial transcripts from creating timeline entries', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/transcription/chunk',
      payload: {
        sessionId: 'session-a',
        chunkId: 'chunk-2',
        text: 'this is still streaming',
        startTime: '2026-04-04T10:01:00.000Z',
        endTime: '2026-04-04T10:01:02.000Z',
        isFinal: false,
        deviceId: 'browser-mic-1'
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ accepted: false, reason: 'partial transcript', entry: null });
  });
});
