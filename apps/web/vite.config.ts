import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { env } from 'node:process';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  define: {
    'process.env': process.env
  }
});
