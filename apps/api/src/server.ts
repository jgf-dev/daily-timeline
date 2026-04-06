import Fastify from 'fastify';
import type { Insight, TimelineEntry, VoiceCaptureSession } from '@daily-timeline/types';
import { readConfig } from './config';
import { registerScreenshotRoutes } from './services/screenshots/routes';
import { InMemoryScreenshotStorage } from './services/screenshots/storage';

const config = readConfig(process.env);
const server = Fastify({ logger: { level: config.LOG_LEVEL } });

const timelineEntries: TimelineEntry[] = [];
const voiceSessions: VoiceCaptureSession[] = [];
const insights: Insight[] = [];
const screenshotStorage = new InMemoryScreenshotStorage();

server.get('/health', async () => ({ ok: true, service: 'daily-timeline-api' }));

server.get('/timeline/entries', async () => ({ data: timelineEntries }));
server.get('/voice/sessions', async () => ({ data: voiceSessions }));
registerScreenshotRoutes(server, { storage: screenshotStorage, timelineEntries, insights });
server.get('/insights', async () => ({ data: insights }));

server.listen({ port: config.PORT, host: '0.0.0.0' }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
