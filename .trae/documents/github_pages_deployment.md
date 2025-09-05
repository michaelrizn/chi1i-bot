# GitHub Pages Deployment Guide

## 1. Подготовка проекта

### 1.1 Структура проекта для статического хостинга

```
chi1i-bot/
├── src/
│   ├── components/
│   ├── data/
│   │   ├── spices.json
│   │   ├── products.json
│   │   └── methods.json
│   ├── hooks/
│   ├── utils/
│   └── main.tsx
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── sw.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── vite.config.ts
├── package.json
└── tsconfig.json
```

### 1.2 Ключевые требования

- **Только клиентские технологии**: React, TypeScript, Vite
- **Статические данные**: JSON файлы вместо базы данных
- **Hash Router**: Для корректной работы маршрутизации на GitHub Pages
- **Относительные пути**: Настройка base URL в Vite конфигурации

## 2. Конфигурация Vite

### 2.1 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chi1i-bot/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          telegram: ['@twa-dev/sdk'],
          router: ['react-router-dom']
        }
      }
    }
  },
  publicDir: 'public'
})
```

### 2.2 Настройка маршрутизации

```typescript
// src/App.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  )
}
```

## 3. GitHub Actions Workflow

### 3.1 .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 4. Настройка репозитория

### 4.1 Включение GitHub Pages

1. Перейти в Settings репозитория
2. Найти секцию "Pages"
3. Выбрать Source: "GitHub Actions"
4. Сохранить настройки

### 4.2 Переменные окружения

```bash
# .env.production
VITE_BASE_URL=/chi1i-bot/
VITE_TELEGRAM_BOT_NAME=your_bot_name
```

## 5. Оптимизация для статического хостинга

### 5.1 Service Worker для кэширования

```javascript
// public/sw.js
const CACHE_NAME = 'chi1i-bot-v1'
const urlsToCache = [
  '/',
  '/assets/index.js',
  '/assets/index.css',
  '/data/spices.json',
  '/data/products.json',
  '/data/methods.json'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  )
})
```

### 5.2 Манифест PWA

```json
{
  "name": "Chi1i Bot - Spice Compatibility Analyzer",
  "short_name": "Chi1i Bot",
  "description": "Анализатор совместимости специй для Telegram",
  "start_url": "/chi1i-bot/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 6. Команды развертывания

### 6.1 Локальная сборка и тестирование

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

### 6.2 Автоматическое развертывание

```bash
# Пуш в main ветку автоматически запускает деплой
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 7. Проверка развертывания

### 7.1 URL приложения

```
https://username.github.io/chi1i-bot/
```

### 7.2 Проверочный список

- [ ] Приложение загружается без ошибок
- [ ] Маршрутизация работает корректно
- [ ] Данные загружаются из JSON файлов
- [ ] Telegram WebApp API инициализируется
- [ ] PWA функции работают (кэширование, офлайн)
- [ ] Responsive дизайн адаптируется под разные экраны

## 8. Устранение проблем

### 8.1 Частые ошибки

**404 при переходе по прямым ссылкам**
- Решение: Использовать HashRouter вместо BrowserRouter

**Ресурсы не загружаются**
- Решение: Проверить настройку base в vite.config.ts

**GitHub Actions не запускается**
- Решение: Проверить права доступа в Settings > Actions

### 8.2 Отладка

```bash
# Проверка сборки локально
npm run build
npm run preview

# Проверка GitHub Actions логов
# Перейти в Actions tab в GitHub репозитории
```