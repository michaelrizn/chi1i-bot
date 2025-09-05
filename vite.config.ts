import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/chi1i-bot/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          telegram: ['@twa-dev/sdk'],
          router: ['react-router-dom'],
          i18n: ['react-i18next', 'i18next']
        }
      }
    }
  },
  publicDir: 'public',
  server: {
    port: 3000,
    host: true
  }
})