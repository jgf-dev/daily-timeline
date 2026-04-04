import Fastify from 'fastify';
import { readConfig } from './config';
import { registerRoutes } from './routes';

const config = readConfig(process.env);
const server = Fastify({ logger: { level: config.LOG_LEVEL } });

registerRoutes(server);

server.listen({ port: config.PORT, host: '0.0.0.0' }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
