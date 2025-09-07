# UI/UX Design Guide - Минималистичный подход

## 1. Дизайн-философия

### 1.1 Принципы дизайна

**Minimalist Design**
- Чистый интерфейс без брендинга и лишних элементов
- Фокус на функциональности, а не на декоративных элементах
- Убраны все упоминания названий продуктов и логотипы
- Простота и ясность как основные принципы

**Interactive Tag Clouds with Mutual Exclusions**
- Интерактивные облака тегов как основной элемент интерфейса
- Динамическое взаимодействие между элементами
- Автоматическое взаимоисключение несовместимых продуктов и методов
- Плавные анимации состояний (выбран/заблокирован/недоступен/активен)

**Enhanced Real-time Feedback**
- Мгновенная реакция на действия пользователя
- Автоматическое появление разделов при выборе
- Подробные научные объяснения с конкретными процессами
- Визуальная обратная связь для каждого взаимодействия

**Clean Single Page Experience**
- Вся функциональность на одной странице без заголовков и футеров
- Вертикальная прокрутка с логическими секциями
- Контекстные разделы появляются по мере необходимости
- Минимизация переходов между страницами

**Mobile-First подход**
- Приоритет мобильных устройств
- Touch-friendly интерфейс с увеличенными областями нажатия
- Быстрая загрузка на медленных соединениях
- Экономия трафика и батареи

**Dark Theme First**
- Тёмная тема как основная и единственная
- Снижение нагрузки на глаза при длительном использовании
- Экономия батареи на OLED экранах
- Современный профессиональный внешний вид

**No Branding Approach**
- Отсутствие логотипов, названий продуктов и брендинга
- Убраны декоративные элементы (эмодзи в заголовках, футеры с сердечками)
- Фокус на чистой функциональности
- Профессиональный минималистичный вид

## 2. Цветовая система

### 2.1 Основная палитра (Тёмная тема)

```css
:root {
  /* Primary Colors - Dark Theme */
  --primary: #3b82f6;     /* Яркий синий */
  --primary-hover: #2563eb; /* Синий при hover */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Background Colors */
  --background: #0f172a;  /* Тёмный фон */
  --surface: #1e293b;     /* Поверхности карточек */
  --surface-hover: #334155; /* Hover состояние поверхностей */
  
  /* Text Colors */
  --text-primary: #f8fafc;   /* Основной текст */
  --text-secondary: #cbd5e1; /* Вторичный текст */
  --text-muted: #64748b;     /* Приглушённый текст */
  
  /* Neutral Colors - Adapted for Dark */
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
  
  /* Border Colors */
  --border: #374151;      /* Границы */
  --border-light: #4b5563; /* Светлые границы */
  
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

### 4.1 Интерактивные теги

**Tag Component**
```tsx
interface TagProps {
  id: number
  label: string
  category: 'product' | 'method' | 'spice'
  color?: string
  state: 'default' | 'selected' | 'disabled' | 'incompatible'
  onClick: (id: number) => void
  onRemove?: (id: number) => void
}

const Tag: React.FC<TagProps> = ({
  id,
  label,
  category,
  color,
  state,
  onClick,
  onRemove
}) => {
  const stateClasses = {
    default: 'bg-surface text-text-primary hover:bg-surface-hover cursor-pointer border border-border',
    selected: 'bg-primary text-white shadow-lg shadow-primary/20 transform scale-105 border border-primary',
    disabled: 'bg-surface/50 text-text-muted cursor-not-allowed opacity-50 border border-border',
    incompatible: 'bg-surface/30 text-text-muted cursor-not-allowed opacity-30 border border-error/30'
  }
  
  return (
    <button
      className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 ease-in-out
        ${stateClasses[state]}
        ${color ? `border-2 border-${color}` : ''}
      `}
      onClick={() => state !== 'disabled' && state !== 'incompatible' && onClick(id)}
      disabled={state === 'disabled' || state === 'incompatible'}
    >
      {label}
      {state === 'selected' && onRemove && (
        <button
          className="ml-2 text-white hover:text-gray-200"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(id)
          }}
        >
          ×
        </button>
      )}
    </button>
  )
}
```

### 4.2 Облака тегов

**TagCloud Component**
```tsx
interface TagCloudProps {
  title: string
  tags: Tag[]
  selectedTags: number[]
  incompatibleTags: number[]
  onTagSelect: (id: number) => void
  onTagRemove: (id: number) => void
}

const TagCloud: React.FC<TagCloudProps> = ({
  title,
  tags,
  selectedTags,
  incompatibleTags,
  onTagSelect,
  onTagRemove
}) => {
  const getTagState = (tagId: number): TagState => {
    if (selectedTags.includes(tagId)) return 'selected'
    if (incompatibleTags.includes(tagId)) return 'incompatible'
    return 'default'
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Tag
            key={tag.id}
            {...tag}
            state={getTagState(tag.id)}
            onClick={onTagSelect}
            onRemove={selectedTags.includes(tag.id) ? onTagRemove : undefined}
          />
        ))}
      </div>
    </div>
  )
}
```

### 4.3 Кнопки

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
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary/50',
    secondary: 'bg-surface text-text-primary hover:bg-surface-hover focus:ring-border border border-border',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/50'
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

### 4.4 Раздел выбранного

**SelectedSection Component**
```tsx
interface SelectedSectionProps {
  selectedProducts: Product[]
  selectedMethods: CookingMethod[]
  selectedSpices: Spice[]
  onRemove: (type: 'product' | 'method' | 'spice', id: number) => void
}

const SelectedSection: React.FC<SelectedSectionProps> = ({
  selectedProducts,
  selectedMethods,
  selectedSpices,
  onRemove
}) => {
  const hasSelections = selectedProducts.length > 0 || selectedMethods.length > 0 || selectedSpices.length > 0
  
  if (!hasSelections) return null
  
  return (
    <div className="bg-surface rounded-lg p-4 space-y-4 border border-border">
      <h3 className="text-lg font-semibold text-text-primary">Выбранное</h3>
      
      {selectedProducts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Продукты</h4>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map(product => (
              <Tag
                key={product.id}
                id={product.id}
                label={product.name}
                category="product"
                state="selected"
                onClick={() => {}}
                onRemove={(id) => onRemove('product', id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {selectedMethods.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Способы приготовления</h4>
          <div className="flex flex-wrap gap-2">
            {selectedMethods.map(method => (
              <Tag
                key={method.id}
                id={method.id}
                label={method.name}
                category="method"
                state="selected"
                onClick={() => {}}
                onRemove={(id) => onRemove('method', id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {selectedSpices.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">Специи</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSpices.map(spice => (
              <Tag
                key={spice.id}
                id={spice.id}
                label={spice.name}
                category="spice"
                color={spice.color}
                state="selected"
                onClick={() => {}}
                onRemove={(id) => onRemove('spice', id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 4.5 Динамические объяснения

**ExplanationSection Component**
```tsx
interface ExplanationSectionProps {
  analysis: CompatibilityAnalysis
  isVisible: boolean
}

const ExplanationSection: React.FC<ExplanationSectionProps> = ({
  analysis,
  isVisible
}) => {
  if (!isVisible) return null
  
  return (
    <div className="space-y-6">
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-success mb-3">Почему это сочетание подходит</h3>
        <ul className="space-y-2">
          {analysis.reasons.map((reason, index) => (
            <li key={index} className="text-text-primary flex items-start">
              <span className="text-success mr-2">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-primary mb-3">Процессы при готовке</h3>
        <ul className="space-y-2">
          {analysis.cookingProcesses.map((process, index) => (
            <li key={index} className="text-text-primary flex items-start">
              <span className="text-warning mr-2">🔥</span>
              {process}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">Химические процессы</h3>
        <div className="space-y-3">
          {analysis.chemicalReactions.map((reaction, index) => (
            <div key={index} className="border-l-4 border-purple-400 pl-4">
              <div className="font-medium text-text-primary">{reaction.process}</div>
              <div className="text-sm text-text-secondary mt-1">
                <span className="font-medium">Соединения:</span> {reaction.compounds.join(', ')}
              </div>
              <div className="text-sm text-text-secondary">
                <span className="font-medium">Температура:</span> {reaction.temperature}
              </div>
              <div className="text-sm text-text-secondary">
                <span className="font-medium">Результат:</span> {reaction.result}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {analysis.recommendations.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-warning mb-3">Рекомендации</h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="text-text-primary flex items-start">
                <span className="text-warning mr-2">💡</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### 4.6 Карточки

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
      bg-surface rounded-lg
      ${paddingClasses[padding]}
      ${shadow ? 'shadow-lg shadow-black/10' : ''}
      ${border ? 'border border-border' : ''}
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
        <label className="block text-sm font-medium text-text-primary">
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
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          ${error ? 'border-error' : 'border-border'}
          ${disabled ? 'bg-surface/50 cursor-not-allowed' : 'bg-surface'}
          text-text-primary placeholder-text-muted
        `}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
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

### 6.1 Принципы анимации для интерактивных тегов

- **Мгновенная обратная связь**: 150ms для выбора тегов
- **Плавные переходы состояний**: 200-300ms для изменения доступности
- **Появление разделов**: 400ms с easing для контекстных блоков
- **Физичные анимации**: spring-эффекты для выделения выбранных элементов

```css
.tag-transition {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.tag-selected {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.tag-incompatible {
  transform: scale(0.95);
  filter: grayscale(0.8) brightness(0.6);
  opacity: 0.3;
}

.section-appear {
  animation: slideInUp 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 6.2 Интерактивные анимации

```css
/* Анимация выбора тега */
.tag-select {
  animation: tagPulse 300ms ease-out;
}

@keyframes tagPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1.05); }
}

/* Анимация деактивации */
.tag-disable {
  animation: fadeToGray 200ms ease-in;
}

@keyframes fadeToGray {
  from {
    opacity: 1;
    filter: grayscale(0);
  }
  to {
    opacity: 0.3;
    filter: grayscale(0.7);
  }
}

/* Появление объяснений */
.explanation-enter {
  animation: expandIn 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes expandIn {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);
  }
}

/* Hover эффекты для тегов в тёмной теме */
.tag-hover:hover:not(.tag-disabled):not(.tag-incompatible) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  background-color: var(--surface-hover);
}
```

### 6.3 Микроанимации обратной связи

```css
/* Визуальная обратная связь */
.visual-feedback {
  animation: visualPulse 100ms ease-out;
}

@keyframes visualPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* Loading состояния для анализа */
.analysis-loading {
  animation: analysisSpinner 1s linear infinite;
}

@keyframes analysisSpinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Успешное завершение анализа */
.analysis-complete {
  animation: successBounce 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes successBounce {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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

### 9.2 Браузерные оптимизации

```typescript
// Адаптация под системную тёмную тему
const applySystemTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (prefersDark) {
    document.documentElement.classList.add('dark')
    document.documentElement.style.setProperty('--background', '#0f172a')
    document.documentElement.style.setProperty('--text-primary', '#f8fafc')
    document.documentElement.style.setProperty('--text-muted', '#64748b')
    document.documentElement.style.setProperty('--surface', '#1e293b')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.setProperty('--background', '#ffffff')
    document.documentElement.style.setProperty('--text-primary', '#1e293b')
    document.documentElement.style.setProperty('--text-muted', '#64748b')
    document.documentElement.style.setProperty('--surface', '#f8fafc')
  }
}

// Визуальная обратная связь для touch устройств
const triggerVisualFeedback = (element: HTMLElement, type: 'light' | 'medium' | 'heavy') => {
  const intensity = { light: 0.95, medium: 0.9, heavy: 0.85 }[type]
  element.style.transform = `scale(${intensity})`
  setTimeout(() => {
    element.style.transform = 'scale(1)'
  }, 100)
}

// Инициализация темы
const initTheme = () => {
  // Применяем системную тему
  applySystemTheme()
  
  // Слушаем изменения системной темы
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme)
}
```

## 10. Чек-лист качества

### 10.1 Тёмная тема
- [ ] Корректная цветовая палитра для тёмной темы
- [ ] Достаточная контрастность текста (минимум 4.5:1)
- [ ] Адаптация всех компонентов под тёмный фон
- [ ] Адаптация под системную тёмную тему браузера
- [ ] Правильные цвета границ и теней

### 10.2 Интерактивность тегов
- [ ] Мгновенная реакция на выбор тегов (< 150ms)
- [ ] Плавные анимации состояний в тёмной теме
- [ ] Корректное взаимоисключение несовместимых тегов
- [ ] Визуальное выделение выбранных элементов
- [ ] Визуальная обратная связь для touch-устройств

### 10.3 Динамические разделы
- [ ] Автоматическое появление раздела выбранного
- [ ] Плавное появление объяснений при достаточном выборе
- [ ] Корректное удаление тегов из выбранного
- [ ] Обновление объяснений при изменении выбора
- [ ] Анимации появления/исчезновения разделов

### 10.4 Система совместимости
- [ ] Правильная логика взаимоисключений
- [ ] Актуальные данные о совместимости
- [ ] Корректные химические объяснения
- [ ] Точные описания процессов готовки
- [ ] Релевантные рекомендации

### 10.5 Адаптивность
- [ ] Mobile-first подход
- [ ] Touch-friendly элементы (44px+)
- [ ] Корректное отображение облаков тегов на всех экранах
- [ ] Адаптивная компоновка разделов
- [ ] Оптимизация для различных размеров экранов

### 10.6 Производительность
- [ ] Быстрая загрузка данных о специях
- [ ] Оптимизированные анимации (60fps)
- [ ] Эффективные алгоритмы фильтрации
- [ ] Минимальные задержки при взаимодействии
- [ ] Кэширование результатов анализа

### 10.7 Пользовательский опыт
- [ ] Интуитивное понимание системы тегов
- [ ] Понятные визуальные индикаторы состояний
- [ ] Информативные объяснения
- [ ] Простота отмены действий
- [ ] Отсутствие когнитивной перегрузки

## История изменений

### Январь 2025

**Основные обновления:**
- ✅ Переработан дизайн с акцентом на минималистичность
- ✅ Убраны все элементы брендинга и логотипы
- ✅ Добавлены принципы чистого интерфейса
- ✅ Обновлены цветовые схемы для тёмной темы
- ✅ Добавлены анимации для состояний взаимоисключений

**Новые функции дизайна:**
- **Минималистичный подход**: Чистый интерфейс без лишних элементов
- **Состояния взаимоисключений**: Визуальные индикаторы заблокированных тегов
- **Улучшенная тёмная тема**: Оптимизированная цветовая палитра
- **Научные обоснования**: Дизайн для отображения химических объяснений