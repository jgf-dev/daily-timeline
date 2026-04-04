import { defaultLocalDeviceConfig } from './devices';
import { defaultProviderConfig } from './providers';

export const appConfig = {
  environment: process.env.NODE_ENV ?? 'development',
  server: {
    host: process.env.HOST ?? '127.0.0.1',
    port: Number(process.env.PORT ?? 4200)
  },
  providers: defaultProviderConfig,
  devices: defaultLocalDeviceConfig
};

export * from './devices';
export * from './providers';
