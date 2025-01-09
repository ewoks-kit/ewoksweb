import fs from 'node:fs/promises';

import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

// Inspired by https://github.com/vitejs/vite/discussions/16295#discussioncomment-10736176
const pngDataUrlLoader: Plugin = {
  name: 'pngDataUrlLoader',
  async transform(_, id) {
    const url = new URL(id, 'file:');
    if (!url.searchParams.has('dataUrl')) {
      return undefined;
    }
    const path = url.pathname;
    const data = await fs.readFile(path);
    const mimeType = 'image/png';
    return `export default 'data:${mimeType};base64,${data.toString(
      'base64',
    )}';`;
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pngDataUrlLoader],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
