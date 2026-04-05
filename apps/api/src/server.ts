import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { Insight, ScreenshotEvent, TimelineEntry, VoiceCaptureSession } from '@daily-timeline/types';
import { readConfig } from './config';

const config = readConfig(process.env);
const server = Fastify({ logger: { level: config.LOG_LEVEL } });

server.register(cors, {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

const timelineEntries: TimelineEntry[] = [];
const voiceSessions: VoiceCaptureSession[] = [];
const screenshotEvents: ScreenshotEvent[] = [];
const insights: Insight[] = [];

server.get('/health', async () => ({ ok: true, service: 'daily-timeline-api' }));

server.get('/timeline/entries', async () => ({ data: timelineEntries }));
server.get('/voice/sessions', async () => ({ data: voiceSessions }));
server.get('/screenshots/events', async () => ({ data: screenshotEvents }));
server.get('/insights', async () => ({ data: insights }));

server.listen({ port: config.PORT, host: '0.0.0.0' }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
