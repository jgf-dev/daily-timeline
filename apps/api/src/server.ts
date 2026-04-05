import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { env } from 'node:process';
import Fastify, { type FastifyServerOptions } from 'fastify';
import { readConfig, type ApiConfig } from './config';
import { registerRoutes } from './routes';

loadEnv({ path: path.resolve(process.cwd(), '../../.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

function buildLoggerOptions(level: ApiConfig['LOG_LEVEL']): FastifyServerOptions['logger'] {
  if (process.env.NODE_ENV === 'production') {
    return { level };
  }
  return {
    level,
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  };
}

const config = readConfig(env);
const server = Fastify({ logger: buildLoggerOptions(config.LOG_LEVEL) });

registerRoutes(server);

server
  .listen({ port: config.PORT, host: '0.0.0.0' })
  .then((address) => {
    server.log.info({ address }, 'server listening');
  })
  .catch((error) => {
    server.log.error(error);
    process.exit(1);
  });
