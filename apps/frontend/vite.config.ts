import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const port = Number.parseInt(process.env.PORT ?? '5174', 10);

export default defineConfig({
  plugins: [react()],
  server: {
    port
  }
});
