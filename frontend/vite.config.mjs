import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [react(), svgr(), EnvironmentPlugin('all'), tailwindcss()],
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '^src/(.*)$': './src/$1',
      '\\.(svg)\\?react$': './test/__mocks__/svgMock.js',
      '\\.(svg)$': './test/__mocks__/svgMock.js',
      '\\.(css)$': './test/__mocks__/styleMock.js',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
