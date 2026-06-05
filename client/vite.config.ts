import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Проксирование запросов к бэкенду при локальной разработке
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      // Направляем скомпилированный фронтенд строго в папку public нашего Express-сервера
      outDir: '../public',
      // Очищаем целевую папку перед сборкой, чтобы избежать конфликтов старых кэшей
      emptyOutDir: true,
    }
  };
});