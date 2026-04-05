import { defineConfig } from 'vitest/config';

export default defineConfig({
  logLevel: 'info',
  test: {
    environment: 'node',
    globals: true
  },
});