import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@api', replacement: '/src/api' },
      { find: '@assets', replacement: '/src/assets' },
      { find: '@components', replacement: '/src/components' },
      { find: '@constants', replacement: '/src/constants' },
      { find: '@context', replacement: '/src/context' },
      { find: '@hooks', replacement: '/src/hooks' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@stores', replacement: '/src/stores' },
      { find: '@utils', replacement: '/src/utils' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@', replacement: '/src' },
    ],
  },
});
