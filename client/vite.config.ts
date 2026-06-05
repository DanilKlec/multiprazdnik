import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Настройка конфигурации Vite с автоматическим выводом билда в папку public сервера
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // Все запросы, начинающиеся с /api, Vite автоматически перенаправит на Node.js сервер
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Указываем Vite собирать готовый фронтенд прямо в папку public нашего бэкенда
    outDir: '../public',
    // Очищать папку public перед каждой новой сборкой
    emptyOutDir: true,
  }
});