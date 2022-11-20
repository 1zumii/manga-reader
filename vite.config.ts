import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  base: '/manga-reader/',
  plugins: [solidPlugin()],
  server: {
    port: 7900,
  },
  build: {
    target: 'esnext',
  },
});
