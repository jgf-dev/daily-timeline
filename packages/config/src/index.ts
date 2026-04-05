import { defaultLocalDeviceConfig } from './devices';
import { defaultProviderConfig } from './providers';

export const appConfig = {
  environment: process.env.NODE_ENV ?? 'development',
  server: {
    host: process.env.HOST ?? '127.0.0.1',
    port: (() => {
      const rawPort = process.env.PORT ?? '4200';
      const parsedPort = Number.parseInt(rawPort, 10);
      if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
        throw new Error(`Invalid PORT value: "${rawPort}"`);
      }
      return parsedPort;
    })()
  },
  providers: defaultProviderConfig,
  devices: defaultLocalDeviceConfig
};

export * from './devices';
export * from './providers';
