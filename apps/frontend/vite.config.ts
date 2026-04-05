import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
const port = Number.isNaN(parsedPort) ? 5174 : parsedPort;

export default defineConfig({
  plugins: [react()],
  server: {
    port
  }
});
