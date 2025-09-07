# Система интерактивных облаков тегов с взаимоисключениями (Клиентская)

## 1. Обзор системы

**ВАЖНО: Полностью клиентская система без серверной части**

Интерактивная система облаков тегов - это **статическое клиентское приложение**, которое обеспечивает динамическое взаимодействие между продуктами, способами приготовления и специями на единой странице. Система автоматически анализирует совместимость в браузере, обрабатывает взаимоисключения продуктов и методов, предоставляя мгновенную обратную связь пользователю в минималистичном дизайне.

**Статические принципы системы:**
- Все данные загружаются из статических JSON файлов
- Вся логика выполняется в браузере пользователя
- Отсутствие серверных запросов и баз данных
- Состояние сохраняется в LocalStorage браузера

### 1.1 Ключевые принципы

- **Единая страница**: Все облака тегов размещены на одной странице без брендинга
- **Взаимоисключения**: Автоматическая блокировка несовместимых продуктов и методов
- **Динамическое взаимодействие**: Выбор любого тега влияет на доступность других
- **Подробные объяснения**: Система генерирует научные обоснования с конкретными процессами
- **Мгновенная обратная связь**: Реакция на действия пользователя < 150ms
- **Минималистичность**: Чистый дизайн без лишних элементов

## 2. Архитектура системы

### 2.1 Состояния тегов

```typescript
type TagState = 'default' | 'selected' | 'incompatible' | 'disabled' | 'mutually_excluded'

interface TagStateManager {
  getTagState(tagId: number, category: TagCategory): TagState
  updateTagStates(selectedTags: SelectedTags): void
  calculateIncompatibilities(selection: SelectedTags): IncompatibleTags
  calculateMutualExclusions(selection: SelectedTags): MutualExclusions
}

interface MutualExclusions {
  products: number[]
  methods: number[]
}
```

**Описание состояний:**
- `default` - обычное состояние, доступен для выбора
- `selected` - выбран пользователем, выделен визуально
- `incompatible` - несовместим с текущим выбором специй, затемнен
- `mutually_excluded` - заблокирован взаимоисключением продуктов/методов, сильно затемнен
- `disabled` - временно недоступен (например, при загрузке)

### 2.2 Логика взаимоисключений и совместимости

```typescript
interface CompatibilityEngine {
  checkProductSpiceCompatibility(productId: number, spiceId: number): boolean
  checkMethodSpiceCompatibility(methodId: number, spiceId: number): boolean
  checkSpiceSpiceCompatibility(spiceId1: number, spiceId2: number): boolean
  checkProductMutualExclusion(productId1: number, productId2: number): boolean
  checkMethodMutualExclusion(methodId1: number, methodId2: number): boolean
  getIncompatibleTags(selection: SelectedTags): IncompatibleTags
  getMutuallyExcludedTags(selection: SelectedTags): MutualExclusions
}
```

**Правила совместимости и взаимоисключений:**
1. **Продукт + Специя**: проверка по матрице совместимости продуктов
2. **Способ + Специя**: проверка температурной устойчивости специй
3. **Специя + Специя**: проверка химической совместимости соединений
4. **Продукт ↔ Продукт**: взаимоисключения (мясо vs рыба, крупы vs овощи)
5. **Способ ↔ Способ**: температурные конфликты (сырое vs термообработка)
6. **Комплексная проверка**: анализ всей комбинации с приоритетами

### 2.3 Система анализа

```typescript
interface AnalysisEngine {
  analyzeSelection(selection: SelectedTags): CompatibilityAnalysis
  generateExplanations(analysis: CompatibilityAnalysis): ExplanationSections
  shouldShowExplanations(selection: SelectedTags): boolean
}

interface ExplanationSections {
  compatibility: string[]
  cookingProcesses: string[]
  chemicalReactions: ChemicalReaction[]
  recommendations: string[]
}
```

## 3. Пользовательские сценарии

### 3.1 Базовый сценарий выбора

1. **Начальное состояние**
   - Все теги в состоянии `default`
   - Облака тегов видны полностью
   - Разделы выбранного и объяснений скрыты

2. **Выбор первого тега**
   - Тег переходит в состояние `selected`
   - Появляется раздел "Выбранное"
   - Несовместимые теги переходят в состояние `incompatible`
   - Визуальная обратная связь (анимация нажатия)

3. **Выбор дополнительных тегов**
   - Обновление раздела "Выбранное"
   - Пересчет совместимости для всех тегов
   - Обновление визуальных состояний

4. **Достижение порога для объяснений**
   - Появление разделов с объяснениями
   - Анимация появления контента
   - Автоматическая прокрутка к объяснениям

### 3.2 Сценарий удаления тегов

1. **Удаление из раздела выбранного**
   - Тег возвращается в состояние `default`
   - Пересчет совместимости
   - Обновление объяснений или их скрытие

2. **Удаление через повторный клик**
   - Альтернативный способ отмены выбора
   - Аналогичная логика обновления состояний

### 3.3 Сценарий конфликтов

1. **Обнаружение несовместимости**
   - Автоматическое затемнение конфликтующих тегов
   - Показ причины несовместимости при hover
   - Предложение альтернативных вариантов

2. **Разрешение конфликтов**
   - Удаление конфликтующих тегов
   - Предложение совместимых замен
   - Объяснение причин несовместимости

## 4. Алгоритмы и логика

### 4.1 Алгоритм обновления состояний

```typescript
function updateTagStates(selectedTags: SelectedTags, allTags: AllTags): TagStates {
  const newStates: TagStates = {}
  
  // Шаг 1: Установка выбранных тегов
  for (const category in selectedTags) {
    for (const tagId of selectedTags[category]) {
      newStates[`${category}-${tagId}`] = 'selected'
    }
  }
  
  // Шаг 2: Расчет несовместимых тегов
  const incompatibleTags = calculateIncompatibilities(selectedTags)
  
  // Шаг 3: Установка несовместимых состояний
  for (const category in incompatibleTags) {
    for (const tagId of incompatibleTags[category]) {
      if (newStates[`${category}-${tagId}`] !== 'selected') {
        newStates[`${category}-${tagId}`] = 'incompatible'
      }
    }
  }
  
  // Шаг 4: Остальные теги в состоянии default
  for (const category in allTags) {
    for (const tag of allTags[category]) {
      const key = `${category}-${tag.id}`
      if (!newStates[key]) {
        newStates[key] = 'default'
      }
    }
  }
  
  return newStates
}
```

### 4.2 Алгоритм генерации объяснений

```typescript
function generateExplanations(selection: SelectedTags): ExplanationSections {
  const explanations: ExplanationSections = {
    compatibility: [],
    cookingProcesses: [],
    chemicalReactions: [],
    recommendations: []
  }
  
  // Анализ совместимости продуктов и специй
  if (selection.products.length > 0 && selection.spices.length > 0) {
    explanations.compatibility = analyzeProductSpiceCompatibility(
      selection.products, 
      selection.spices
    )
  }
  
  // Анализ процессов готовки
  if (selection.methods.length > 0) {
    explanations.cookingProcesses = analyzeCookingProcesses(
      selection.methods,
      selection.spices
    )
  }
  
  // Анализ химических реакций
  if (selection.spices.length >= 2) {
    explanations.chemicalReactions = analyzeChemicalReactions(
      selection.spices
    )
  }
  
  // Генерация рекомендаций
  explanations.recommendations = generateRecommendations(selection)
  
  return explanations
}
```

### 4.3 Условия показа объяснений

```typescript
function shouldShowExplanations(selection: SelectedTags): boolean {
  const totalSelected = 
    selection.products.length + 
    selection.methods.length + 
    selection.spices.length
  
  // Минимальные требования для показа объяснений
  const hasMinimumSelection = totalSelected >= 3
  const hasProductAndSpice = selection.products.length > 0 && selection.spices.length > 0
  const hasMethodAndSpice = selection.methods.length > 0 && selection.spices.length > 0
  const hasMultipleSpices = selection.spices.length >= 2
  
  return hasMinimumSelection && (hasProductAndSpice || hasMethodAndSpice || hasMultipleSpices)
}
```

## 5. Производительность и оптимизация

### 5.1 Кэширование результатов

```typescript
class CompatibilityCache {
  private cache = new Map<string, boolean>()
  
  getCachedCompatibility(key: string): boolean | null {
    return this.cache.get(key) ?? null
  }
  
  setCachedCompatibility(key: string, result: boolean): void {
    this.cache.set(key, result)
  }
  
  generateKey(type: string, id1: number, id2: number): string {
    return `${type}-${Math.min(id1, id2)}-${Math.max(id1, id2)}`
  }
}
```

### 5.2 Дебаунсинг обновлений

```typescript
class TagStateManager {
  private updateTimeout: NodeJS.Timeout | null = null
  
  scheduleUpdate(selectedTags: SelectedTags): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }
    
    this.updateTimeout = setTimeout(() => {
      this.performUpdate(selectedTags)
    }, 50) // 50ms дебаунс для группировки быстрых изменений
  }
}
```

### 5.3 Виртуализация больших списков

```typescript
interface VirtualizedTagCloudProps {
  tags: Tag[]
  visibleCount: number
  onLoadMore: () => void
}

// Показываем только видимые теги для улучшения производительности
const VirtualizedTagCloud: React.FC<VirtualizedTagCloudProps> = ({
  tags,
  visibleCount,
  onLoadMore
}) => {
  const [visibleTags, setVisibleTags] = useState(tags.slice(0, visibleCount))
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore()
      }
    })
    
    // Логика наблюдения за последним элементом
  }, [])
  
  return (
    <div className="tag-cloud">
      {visibleTags.map(tag => (
        <Tag key={tag.id} {...tag} />
      ))}
    </div>
  )
}
```

## 6. Техническая архитектура (Статическая)

**ВАЖНО: Только клиентские компоненты, без серверной части**

### 6.1 Клиентские компоненты системы

#### Основные модули (выполняются в браузере):
- **TagCloudManager** - управление облаками тегов
- **InteractionEngine** - обработка пользовательских взаимодействий
- **CompatibilityAnalyzer** - клиентский анализ совместимости в реальном времени
- **StateManager** - управление состоянием в LocalStorage
- **AnimationController** - управление анимациями и переходами
- **DataLoader** - загрузка статических JSON данных
- **LocalCacheManager** - кэширование в браузере

## 7. Тестирование системы (Клиентское)

**ВАЖНО: Все тесты выполняются в браузерной среде**

### 7.1 Юнит-тесты (клиентские)

```typescript
describe('TagStateManager', () => {
  test('should mark incompatible spices when product is selected', () => {
    const manager = new TagStateManager()
    const selection = { products: [1], methods: [], spices: [] }
    
    const states = manager.updateTagStates(selection)
    
    expect(states['spice-15']).toBe('incompatible') // Имбирь несовместим с говядиной
    expect(states['spice-1']).toBe('default') // Базилик совместим
  })
  
  test('should generate explanations for valid combinations', () => {
    const engine = new AnalysisEngine()
    const selection = { products: [1], methods: [2], spices: [1, 3] }
    
    const analysis = engine.analyzeSelection(selection)
    
    expect(analysis.compatibility).toHaveLength(2)
    expect(analysis.chemicalReactions).toHaveLength(1)
  })
})
```

### 6.2 Интеграционные тесты

```typescript
describe('Interactive Tag System Integration', () => {
  test('should update UI correctly when tags are selected', async () => {
    render(<TagSystemPage />)
    
    // Выбираем продукт
    fireEvent.click(screen.getByText('Говядина'))
    
    // Проверяем появление раздела выбранного
    expect(screen.getByText('Выбранное')).toBeInTheDocument()
    
    // Проверяем затемнение несовместимых специй
    expect(screen.getByText('Имбирь')).toHaveClass('tag-incompatible')
    
    // Выбираем совместимую специю
    fireEvent.click(screen.getByText('Розмарин'))
    
    // Проверяем появление объяснений
    await waitFor(() => {
      expect(screen.getByText('Почему это сочетание подходит')).toBeInTheDocument()
    })
  })
})
```

### 6.3 Тесты производительности

```typescript
describe('Performance Tests', () => {
  test('should update states within 150ms', async () => {
    const manager = new TagStateManager()
    const largeSelection = { products: [1,2,3], methods: [1,2], spices: [1,2,3,4,5] }
    
    const startTime = performance.now()
    manager.updateTagStates(largeSelection)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(150)
  })
  
  test('should handle 1000+ tags without performance degradation', () => {
    const tags = generateMockTags(1000)
    const selection = { products: [1], methods: [], spices: [] }
    
    const startTime = performance.now()
    calculateIncompatibilities(selection, tags)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(100)
  })
})
```

## 7. Мониторинг и аналитика

### 7.1 Метрики производительности

- Время отклика на выбор тега (цель: < 150ms)
- Время генерации объяснений (цель: < 500ms)
- Частота использования различных комбинаций
- Процент успешных взаимодействий

### 7.2 Пользовательская аналитика

- Наиболее популярные комбинации тегов
- Частота отмены выбора
- Время до первого взаимодействия
- Глубина взаимодействия (количество выбранных тегов)

### 7.3 Обработка ошибок

```typescript
class ErrorHandler {
  handleCompatibilityError(error: Error, selection: SelectedTags): void {
    console.error('Compatibility calculation failed:', error)
    
    // Fallback: показать базовые объяснения
    this.showFallbackExplanations(selection)
    
    // Отправить метрику об ошибке
    this.trackError('compatibility_error', error.message)
  }
  
  handleStateUpdateError(error: Error): void {
    console.error('State update failed:', error)
    
    // Сброс к безопасному состоянию
    this.resetToSafeState()
    
    // Уведомление пользователя через браузерное уведомление
    this.showBrowserNotification('Произошла ошибка. Попробуйте обновить страницу.', 'error')
  }
  
  showBrowserNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    // Показ уведомления через браузерный API или toast
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message)
    } else {
      // Fallback к toast уведомлению
      this.showToast(message, type)
    }
  }
}
```

Эта система обеспечивает плавное и интуитивное взаимодействие пользователя с облаками тегов, автоматически управляя совместимостью и предоставляя релевантные объяснения в реальном времени.

## История изменений

### Январь 2025

**Основные обновления:**
- ✅ Добавлено новое состояние тегов 'mutually_excluded'
- ✅ Описана логика взаимоисключений продуктов и методов
- ✅ Обновлены принципы с акцентом на минималистичность
- ✅ Добавлены интерфейсы для MutualExclusions
- ✅ Убраны упоминания брендинга

**Новые функции интерактивности:**
- **Состояние взаимоисключений**: Новое состояние тегов для заблокированных элементов
- **Логика деактивации**: Автоматическая блокировка несовместимых продуктов и методов
- **Минималистичный интерфейс**: Чистый дизайн без лишних элементов
- **Улучшенная обратная связь**: Мгновенная реакция на действия пользователя