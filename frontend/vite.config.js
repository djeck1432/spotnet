import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), EnvironmentPlugin('all')],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
