import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy only applies to `npm run dev`.
// In production (nginx / ingress) you must route /api -> backend yourself.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:3000',
    },
  },
});
