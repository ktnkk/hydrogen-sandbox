/// <reference types="vitest" />
/* eslint-disable import/no-extraneous-dependencies,eslint-comments/disable-enable-pair */
import hydrogen from '@shopify/hydrogen/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [hydrogen()],
  resolve: {
    alias: [{ find: /^~\/(.*)/, replacement: '/src/$1' }],
  },
  optimizeDeps: {
    include: ['@headlessui/react', 'clsx', 'react-use', 'typographic-base'],
  },
  test: {
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
