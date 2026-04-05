import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { registerRoutes } from './api/routes.js';
import { registerWebsocketChannels } from './ws/channels.js';
import { DeepSearchQueue } from './services/jobQueue.js';
import { ReviewSessionStore } from './services/reviewSessionStore.js';
import { TimelineStore } from './services/timelineStore.js';

async function loadAppConfig() {
  try {
    const configModule = await import('@daily-timeline/config');
    return configModule.appConfig;
  } catch {
    const configModule = await import('../../../packages/config/src/index.ts');
    return configModule.appConfig;
  }
}

const appConfig = await loadAppConfig();
const app = Fastify({ logger: true });

const timelineStore = new TimelineStore();
const deepSearchQueue = new DeepSearchQueue();
const reviewSessionStore = new ReviewSessionStore();

await app.register(websocket);
registerRoutes(app, timelineStore, deepSearchQueue, reviewSessionStore);
registerWebsocketChannels(app);

app.get('/health', async () => ({ ok: true, service: 'backend', env: appConfig.environment }));

const host = appConfig.server.host;
const port = appConfig.server.port;

app.listen({ host, port }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
