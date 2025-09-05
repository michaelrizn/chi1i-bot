# UI/UX Design Guide

## 1. Дизайн-философия

### 1.1 Принципы дизайна

**Flat Design**
- Отсутствие теней, градиентов и 3D эффектов
- Четкие границы и контрастные цвета
- Простые геометрические формы
- Фокус на типографике и иконографии

**Минимализм**
- "Меньше значит больше"
- Максимум функциональности при минимуме элементов
- Много белого пространства (whitespace)
- Иерархия через размер и цвет, а не декорации

**Mobile-First подход**
- Приоритет мобильных устройств
- Touch-friendly интерфейс
- Быстрая загрузка на медленных соединениях
- Экономия трафика и батареи

## 2. Цветовая система

### 2.1 Основная палитра

```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Neutral Colors */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #06b6d4;
}
```

### 2.2 Использование цветов

| Цвет | Назначение | Примеры использования |
|------|------------|----------------------|
| Primary | Основные действия | Кнопки, ссылки, активные элементы |
| Gray | Текст и фоны | Основной текст, границы, неактивные элементы |
| Success | Успешные операции | Уведомления об успехе, валидация |
| Warning | Предупреждения | Важные уведомления, ограничения |
| Error | Ошибки | Сообщения об ошибках, валидация |

## 3. Типографика

### 3.1 Шрифтовая система

**Основной шрифт:** Inter (Google Fonts)
- Отличная читаемость на экранах
- Поддержка кириллицы
- Оптимизирован для UI

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 3.2 Типографическая шкала

```css
.text-xs { font-size: 0.75rem; line-height: 1rem; }     /* 12px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-base { font-size: 1rem; line-height: 1.5rem; }   /* 16px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }    /* 24px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
```

## 4. Компонентная библиотека

### 4.1 Кнопки

**Primary Button**
```tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### 4.2 Карточки

```tsx
interface CardProps {
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
  border?: boolean
  className?: string
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = true,
  border = true,
  className = ''
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  return (
    <div className={`
      bg-white rounded-lg
      ${paddingClasses[padding]}
      ${shadow ? 'shadow-sm' : ''}
      ${border ? 'border border-gray-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}
```

### 4.3 Поля ввода

```tsx
interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'number'
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  type = 'text'
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
        `}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

## 5. Адаптивный дизайн

### 5.1 Breakpoints

```css
/* Mobile First подход */
.container {
  width: 100%;
  padding: 0 1rem;
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
    margin: 0 auto;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding: 0 1.5rem;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}
```

### 5.2 Touch-friendly элементы

**Минимальные размеры для touch:**
- Кнопки: минимум 44px × 44px
- Ссылки: минимум 44px высота
- Поля ввода: минимум 44px высота
- Отступы между кликабельными элементами: минимум 8px

```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.touch-spacing {
  margin: 8px 0;
}
```

## 6. Анимации и переходы

### 6.1 Принципы анимации

- **Быстрые и плавные**: 200-300ms для большинства переходов
- **Естественные**: easing функции, имитирующие физику
- **Целенаправленные**: анимация должна помогать пониманию интерфейса

```css
.transition-base {
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition-property: color, background-color, border-color;
}

.transition-transform {
  transition-property: transform;
}
```

### 6.2 Микроанимации

```css
/* Hover эффекты */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Loading состояния */
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

## 7. Иконография

### 7.1 Система иконок

**Рекомендуемые библиотеки:**
- Heroicons (основная)
- Lucide React (дополнительная)

**Принципы использования:**
- Размеры: 16px, 20px, 24px
- Стиль: outline для основных, solid для акцентов
- Цвет: наследуется от родительского элемента

```tsx
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const SearchButton = () => (
  <button className="p-2 text-gray-500 hover:text-gray-700">
    <MagnifyingGlassIcon className="w-5 h-5" />
  </button>
)
```

## 8. Accessibility (A11y)

### 8.1 Основные требования

- **Контрастность**: минимум 4.5:1 для обычного текста
- **Фокус**: видимые индикаторы фокуса
- **Семантика**: правильные HTML теги
- **Клавиатурная навигация**: доступность без мыши

```css
/* Фокус индикаторы */
.focus-visible:focus {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

/* Скрытие для скринридеров */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 9. Производительность

### 9.1 Оптимизация загрузки

- **Critical CSS**: инлайн критических стилей
- **Font loading**: font-display: swap
- **Image optimization**: WebP формат, lazy loading
- **Code splitting**: разделение по маршрутам

```css
/* Оптимизация шрифтов */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter.woff2') format('woff2');
}

/* Lazy loading изображений */
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s;
}

.lazy-image.loaded {
  opacity: 1;
}
```

### 9.2 Telegram WebApp оптимизации

```typescript
// Адаптация под тему Telegram
const applyTelegramTheme = () => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    document.documentElement.style.setProperty('--tg-bg', tg.backgroundColor)
    document.documentElement.style.setProperty('--tg-text', tg.textColor)
    document.documentElement.style.setProperty('--tg-hint', tg.hintColor)
  }
}

// Haptic feedback
const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type)
}
```

## 10. Чек-лист качества

### 10.1 Дизайн
- [ ] Соответствие Flat Design принципам
- [ ] Минималистичный подход
- [ ] Консистентная цветовая схема
- [ ] Читаемая типографика
- [ ] Достаточные отступы и whitespace

### 10.2 Адаптивность
- [ ] Mobile-first подход
- [ ] Touch-friendly элементы (44px+)
- [ ] Корректное отображение на всех экранах
- [ ] Быстрая загрузка на мобильных
- [ ] Экономия трафика

### 10.3 Accessibility
- [ ] Достаточная контрастность
- [ ] Клавиатурная навигация
- [ ] Семантическая разметка
- [ ] Alt-тексты для изображений
- [ ] ARIA-атрибуты где необходимо

### 10.4 Производительность
- [ ] Оптимизированные изображения
- [ ] Минифицированный CSS/JS
- [ ] Lazy loading
- [ ] Кэширование статических ресурсов
- [ ] Быстрое время первой отрисовки (FCP < 1.5s)