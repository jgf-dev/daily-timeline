import type { FastifyInstance } from 'fastify';

export function registerWebsocketChannels(app: FastifyInstance) {
  app.get('/ws/transcript', { websocket: true }, (connection) => {
    connection.socket.send(JSON.stringify({ type: 'ready', channel: 'transcript' }));
  });

  app.get('/ws/screenshot', { websocket: true }, (connection) => {
    connection.socket.send(JSON.stringify({ type: 'ready', channel: 'screenshot' }));
  });

  app.get('/ws/review', { websocket: true }, (connection) => {
    connection.socket.send(JSON.stringify({ type: 'ready', channel: 'review' }));
  });
}
