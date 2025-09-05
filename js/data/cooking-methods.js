window.COOKING_METHODS_DATA = [
  {
    "id": 1,
    "name": "Варка",
    "category": "влажная_обработка",
    "color": "#3b82f6",
    "temperature_range": "100°C",
    "duration": "средняя",
    "chemical_effects": {
      "protein_changes": ["денатурация", "коагуляция"],
      "volatile_retention": "низкая",
      "texture_changes": ["размягчение"]
    },
    "compatible_spices": [6, 7, 28, 25, 16],
    "best_products": ["овощи", "злаки", "бобовые"],
    "spice_interaction": "Водорастворимые соединения экстрагируются в бульон",
    "description": "Мягкая обработка при 100°C, сохраняет водорастворимые витамины."
  },
  {
    "id": 2,
    "name": "Жарка",
    "category": "сухая_обработка",
    "color": "#ef4444",
    "temperature_range": "150-200°C",
    "duration": "быстрая",
    "chemical_effects": {
      "protein_changes": ["реакция Майяра"],
      "volatile_retention": "высокая",
      "texture_changes": ["корочка", "карамелизация"]
    },
    "compatible_spices": [1, 2, 3, 8, 9, 15, 19, 21, 22],
    "best_products": ["мясо", "птица", "рыба", "овощи"],
    "spice_interaction": "Высокие температуры активируют эфирные масла",
    "description": "Быстрая обработка при высоких температурах, создает корочку."
  },
  {
    "id": 3,
    "name": "Тушение",
    "category": "комбинированная",
    "color": "#f59e0b",
    "temperature_range": "80-95°C",
    "duration": "длительная",
    "chemical_effects": {
      "protein_changes": ["медленная денатурация"],
      "volatile_retention": "средняя",
      "texture_changes": ["размягчение", "концентрация вкуса"]
    },
    "compatible_spices": [28, 24, 4, 30, 11],
    "best_products": ["мясо", "овощи", "морепродукты"],
    "spice_interaction": "Длительная экстракция ароматических соединений",
    "description": "Медленная готовка в небольшом количестве жидкости."
  },
  {
    "id": 4,
    "name": "Запекание",
    "category": "сухая_обработка",
    "color": "#dc2626",
    "temperature_range": "160-220°C",
    "duration": "средняя",
    "chemical_effects": {
      "protein_changes": ["реакция Майяра"],
      "volatile_retention": "средняя",
      "texture_changes": ["карамелизация", "подсушивание"]
    },
    "compatible_spices": [4, 27, 29, 24, 13, 22, 26],
    "best_products": ["мясо", "птица", "овощи", "фрукты"],
    "spice_interaction": "Сухой жар концентрирует ароматы специй",
    "description": "Равномерная обработка сухим жаром в духовке."
  },
  {
    "id": 5,
    "name": "Гриль",
    "category": "сухая_обработка",
    "color": "#991b1b",
    "temperature_range": "200-300°C",
    "duration": "быстрая",
    "chemical_effects": {
      "protein_changes": ["интенсивная реакция Майяра"],
      "volatile_retention": "высокая",
      "texture_changes": ["обугливание", "дымный вкус"]
    },
    "compatible_spices": [19, 21, 23, 1, 2, 30],
    "best_products": ["мясо", "рыба", "овощи"],
    "spice_interaction": "Высокие температуры создают новые ароматические соединения",
    "description": "Приготовление на открытом огне или раскаленной поверхности."
  },
  {
    "id": 6,
    "name": "Копчение",
    "category": "специальная",
    "color": "#6b7280",
    "temperature_range": "60-120°C",
    "duration": "очень_длительная",
    "chemical_effects": {
      "protein_changes": ["медленная денатурация"],
      "volatile_retention": "очень_высокая",
      "texture_changes": ["подсушивание", "консервация"]
    },
    "compatible_spices": [9, 30, 21, 23],
    "best_products": ["мясо", "рыба", "птица"],
    "spice_interaction": "Дым добавляет фенольные соединения",
    "description": "Обработка дымом при низких температурах."
  },
  {
    "id": 7,
    "name": "Припускание",
    "category": "влажная_обработка",
    "color": "#0ea5e9",
    "temperature_range": "85-95°C",
    "duration": "быстрая",
    "chemical_effects": {
      "protein_changes": ["мягкая денатурация"],
      "volatile_retention": "высокая",
      "texture_changes": ["сохранение структуры"]
    },
    "compatible_spices": [6, 7, 15, 25],
    "best_products": ["рыба", "морепродукты", "овощи"],
    "spice_interaction": "Минимальная потеря летучих соединений",
    "description": "Готовка в небольшом количестве жидкости под крышкой."
  },
  {
    "id": 8,
    "name": "Бланширование",
    "category": "влажная_обработка",
    "color": "#06b6d4",
    "temperature_range": "100°C",
    "duration": "очень_быстрая",
    "chemical_effects": {
      "protein_changes": ["частичная денатурация"],
      "volatile_retention": "очень_высокая",
      "texture_changes": ["сохранение хруста"]
    },
    "compatible_spices": [6, 7, 15],
    "best_products": ["овощи", "морепродукты"],
    "spice_interaction": "Быстрая обработка сохраняет свежие ароматы",
    "description": "Кратковременная обработка кипятком."
  },
  {
    "id": 9,
    "name": "Маринование",
    "category": "химическая",
    "color": "#84cc16",
    "temperature_range": "комнатная",
    "duration": "очень_длительная",
    "chemical_effects": {
      "protein_changes": ["кислотная денатурация"],
      "volatile_retention": "максимальная",
      "texture_changes": ["размягчение", "консервация"]
    },
    "compatible_spices": [12, 17, 24],
    "best_products": ["мясо", "рыба", "овощи"],
    "spice_interaction": "Кислоты экстрагируют и фиксируют ароматы",
    "description": "Обработка кислотами без нагревания."
  },
  {
    "id": 10,
    "name": "Су-вид",
    "category": "специальная",
    "color": "#8b5cf6",
    "temperature_range": "50-85°C",
    "duration": "очень_длительная",
    "chemical_effects": {
      "protein_changes": ["точная денатурация"],
      "volatile_retention": "максимальная",
      "texture_changes": ["равномерная готовность"]
    },
    "compatible_spices": [1, 3, 4, 15, 25],
    "best_products": ["мясо", "рыба", "овощи"],
    "spice_interaction": "Вакуум усиливает проникновение ароматов",
    "description": "Приготовление в вакууме при точной температуре."
  }
];