import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Импортируем path для работы с путями

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Настройка алиаса @/
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});