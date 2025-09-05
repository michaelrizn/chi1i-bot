window.PRODUCTS_DATA = [
  {
    "id": 1,
    "name": "Говядина",
    "category": "мясо",
    "color": "#dc2626",
    "chemical_profile": {
      "proteins": ["миозин", "актин"],
      "fats": ["олеиновая кислота"],
      "minerals": ["железо", "цинк"]
    },
    "compatible_spices": [1, 2, 3, 4, 8, 9, 15, 19, 27],
    "cooking_methods": [2, 4, 5, 6],
    "flavor_compounds": ["глутамат", "инозинат"],
    "texture": "плотная",
    "description": "Богата белками и железом, хорошо сочетается с пряными травами."
  },
  {
    "id": 2,
    "name": "Свинина",
    "category": "мясо",
    "color": "#dc2626",
    "chemical_profile": {
      "proteins": ["миозин"],
      "fats": ["пальмитиновая кислота"],
      "minerals": ["тиамин"]
    },
    "compatible_spices": [1, 3, 4, 11, 13, 22, 27, 28],
    "cooking_methods": [2, 4, 6],
    "flavor_compounds": ["глутамат"],
    "texture": "нежная",
    "description": "Содержит много тиамина, сочетается со сладкими специями."
  },
  {
    "id": 3,
    "name": "Баранина",
    "category": "мясо",
    "color": "#dc2626",
    "chemical_profile": {
      "proteins": ["миозин"],
      "fats": ["стеариновая кислота"],
      "minerals": ["цинк"]
    },
    "compatible_spices": [2, 3, 4, 8, 9, 15, 24, 30],
    "cooking_methods": [2, 4, 5, 6],
    "flavor_compounds": ["бранчированные жирные кислоты"],
    "texture": "плотная",
    "description": "Имеет характерный вкус, требует ароматных специй."
  },
  {
    "id": 4,
    "name": "Курица",
    "category": "птица",
    "color": "#f59e0b",
    "chemical_profile": {
      "proteins": ["миозин"],
      "fats": ["линолевая кислота"],
      "minerals": ["селен"]
    },
    "compatible_spices": [1, 2, 3, 5, 15, 18, 20, 22],
    "cooking_methods": [2, 4, 5, 6, 7],
    "flavor_compounds": ["глутамат"],
    "texture": "нежная",
    "description": "Универсальное мясо, хорошо впитывает ароматы специй."
  },
  {
    "id": 5,
    "name": "Утка",
    "category": "птица",
    "color": "#f59e0b",
    "chemical_profile": {
      "proteins": ["миозин"],
      "fats": ["олеиновая кислота"],
      "minerals": ["железо"]
    },
    "compatible_spices": [4, 11, 13, 24, 27, 30],
    "cooking_methods": [4, 6],
    "flavor_compounds": ["жирные кислоты"],
    "texture": "жирная",
    "description": "Жирное мясо, сочетается с кислыми и пряными специями."
  },
  {
    "id": 6,
    "name": "Лосось",
    "category": "рыба",
    "color": "#0ea5e9",
    "chemical_profile": {
      "proteins": ["миозин"],
      "fats": ["омега-3"],
      "minerals": ["селен"]
    },
    "compatible_spices": [1, 6, 7, 11, 15, 25],
    "cooking_methods": [2, 5, 7, 8],
    "flavor_compounds": ["астаксантин"],
    "texture": "нежная",
    "description": "Богат омега-3, хорошо сочетается с травами."
  },
  {
    "id": 7,
    "name": "Треска",
    "category": "рыба",
    "color": "#0ea5e9",
    "chemical_profile": {
      "proteins": ["миозин"],
      "fats": ["минимальные"],
      "minerals": ["йод"]
    },
    "compatible_spices": [6, 7, 17, 19, 20],
    "cooking_methods": [2, 7, 8],
    "flavor_compounds": ["триметиламин"],
    "texture": "слоистая",
    "description": "Нежная белая рыба, не перебивает деликатные специи."
  },
  {
    "id": 8,
    "name": "Тунец",
    "category": "рыба",
    "color": "#0ea5e9",
    "chemical_profile": {
      "proteins": ["миозин"],
      "fats": ["омега-3"],
      "minerals": ["селен"]
    },
    "compatible_spices": [15, 19, 20, 21],
    "cooking_methods": [2, 5, 9],
    "flavor_compounds": ["гемоглобин"],
    "texture": "плотная",
    "description": "Мясистая рыба, выдерживает интенсивные специи."
  },
  {
    "id": 9,
    "name": "Креветки",
    "category": "морепродукты",
    "color": "#06b6d4",
    "chemical_profile": {
      "proteins": ["актомиозин"],
      "fats": ["минимальные"],
      "minerals": ["йод", "цинк"]
    },
    "compatible_spices": [15, 18, 21, 23],
    "cooking_methods": [2, 7, 8],
    "flavor_compounds": ["бетаин"],
    "texture": "упругая",
    "description": "Сладковатый вкус, хорошо с острыми специями."
  },
  {
    "id": 10,
    "name": "Мидии",
    "category": "морепродукты",
    "color": "#06b6d4",
    "chemical_profile": {
      "proteins": ["актомиозин"],
      "fats": ["омега-3"],
      "minerals": ["железо", "цинк"]
    },
    "compatible_spices": [1, 6, 7, 19],
    "cooking_methods": [3, 7],
    "flavor_compounds": ["морские минералы"],
    "texture": "нежная",
    "description": "Морской вкус, сочетается с травами."
  },
  {
    "id": 11,
    "name": "Помидоры",
    "category": "овощи",
    "color": "#22c55e",
    "chemical_profile": {
      "acids": ["лимонная кислота"],
      "sugars": ["фруктоза"],
      "minerals": ["калий"]
    },
    "compatible_spices": [1, 2, 3, 22],
    "cooking_methods": [1, 2, 4, 7],
    "flavor_compounds": ["ликопин", "глутамат"],
    "texture": "сочная",
    "description": "Содержат глутамат, усиливают вкус специй."
  },
  {
    "id": 12,
    "name": "Лук",
    "category": "овощи",
    "color": "#22c55e",
    "chemical_profile": {
      "sulfur_compounds": ["аллицин"],
      "sugars": ["фруктоза"],
      "minerals": ["хром"]
    },
    "compatible_spices": [1, 2, 3, 8, 9],
    "cooking_methods": [2, 4, 7],
    "flavor_compounds": ["сульфиды"],
    "texture": "хрустящая",
    "description": "Аллицин создает острый вкус и аромат."
  },
  {
    "id": 13,
    "name": "Чеснок",
    "category": "овощи",
    "color": "#22c55e",
    "chemical_profile": {
      "sulfur_compounds": ["аллицин"],
      "minerals": ["селен"]
    },
    "compatible_spices": [1, 2, 15, 19, 21],
    "cooking_methods": [2, 4, 7],
    "flavor_compounds": ["диаллилсульфид"],
    "texture": "плотная",
    "description": "Мощный аромат, усиливает действие специй."
  },
  {
    "id": 14,
    "name": "Морковь",
    "category": "овощи",
    "color": "#22c55e",
    "chemical_profile": {
      "sugars": ["сахароза"],
      "carotenoids": ["бета-каротин"],
      "minerals": ["калий"]
    },
    "compatible_spices": [8, 9, 13, 16, 27],
    "cooking_methods": [1, 2, 4, 7],
    "flavor_compounds": ["терпены"],
    "texture": "хрустящая",
    "description": "Сладкий вкус, хорошо с теплыми специями."
  },
  {
    "id": 15,
    "name": "Картофель",
    "category": "овощи",
    "color": "#22c55e",
    "chemical_profile": {
      "starches": ["амилоза"],
      "minerals": ["калий"]
    },
    "compatible_spices": [3, 4, 19, 22],
    "cooking_methods": [4, 5, 6, 7],
    "flavor_compounds": ["минимальные"],
    "texture": "крахмалистая",
    "description": "Нейтральный вкус, хорошо впитывает специи."
  },
  {
    "id": 16,
    "name": "Рис",
    "category": "злаки",
    "color": "#eab308",
    "chemical_profile": {
      "starches": ["амилопектин"],
      "proteins": ["орзенин"]
    },
    "compatible_spices": [16, 25, 13, 8],
    "cooking_methods": [1, 3],
    "flavor_compounds": ["минимальные"],
    "texture": "зернистая",
    "description": "Нейтральная основа для ароматных специй."
  },
  {
    "id": 17,
    "name": "Пшеница",
    "category": "злаки",
    "color": "#eab308",
    "chemical_profile": {
      "proteins": ["глютен"],
      "starches": ["амилоза"]
    },
    "compatible_spices": [10, 11, 27, 29],
    "cooking_methods": [4],
    "flavor_compounds": ["минимальные"],
    "texture": "эластичная",
    "description": "Основа для хлеба, сочетается с семенами."
  },
  {
    "id": 18,
    "name": "Фасоль",
    "category": "бобовые",
    "color": "#a855f7",
    "chemical_profile": {
      "proteins": ["фазеолин"],
      "starches": ["амилоза"],
      "minerals": ["железо"]
    },
    "compatible_spices": [8, 9, 16, 21],
    "cooking_methods": [1, 3],
    "flavor_compounds": ["сапонины"],
    "texture": "мучнистая",
    "description": "Богата белком, хорошо с землистыми специями."
  },
  {
    "id": 19,
    "name": "Чечевица",
    "category": "бобовые",
    "color": "#a855f7",
    "chemical_profile": {
      "proteins": ["легумин"],
      "minerals": ["железо", "фолат"]
    },
    "compatible_spices": [8, 9, 16, 15],
    "cooking_methods": [1, 3],
    "flavor_compounds": ["танины"],
    "texture": "мягкая",
    "description": "Быстро готовится, впитывает ароматы специй."
  },
  {
    "id": 20,
    "name": "Сыр твердый",
    "category": "молочные",
    "color": "#f97316",
    "chemical_profile": {
      "proteins": ["казеин"],
      "fats": ["молочные жиры"],
      "minerals": ["кальций"]
    },
    "compatible_spices": [1, 2, 19, 22],
    "cooking_methods": [4, 5],
    "flavor_compounds": ["тирозин"],
    "texture": "плотная",
    "description": "Выдержанный вкус, сочетается с пряными травами."
  },
  {
    "id": 21,
    "name": "Творог",
    "category": "молочные",
    "color": "#f97316",
    "chemical_profile": {
      "proteins": ["казеин"],
      "minerals": ["кальций"]
    },
    "compatible_spices": [6, 7, 26],
    "cooking_methods": [1, 9],
    "flavor_compounds": ["лактоза"],
    "texture": "зернистая",
    "description": "Мягкий вкус, хорошо с деликатными травами."
  },
  {
    "id": 22,
    "name": "Яблоки",
    "category": "фрукты",
    "color": "#ef4444",
    "chemical_profile": {
      "acids": ["яблочная кислота"],
      "sugars": ["фруктоза"],
      "minerals": ["калий"]
    },
    "compatible_spices": [27, 24, 13],
    "cooking_methods": [4, 1],
    "flavor_compounds": ["эфиры"],
    "texture": "хрустящая",
    "description": "Кислотность балансирует сладкие специи."
  },
  {
    "id": 23,
    "name": "Груши",
    "category": "фрукты",
    "color": "#ef4444",
    "chemical_profile": {
      "sugars": ["фруктоза"],
      "minerals": ["калий"]
    },
    "compatible_spices": [24, 27, 26],
    "cooking_methods": [4, 1],
    "flavor_compounds": ["эфиры"],
    "texture": "мягкая",
    "description": "Сладкий вкус, сочетается с пряными специями."
  },
  {
    "id": 24,
    "name": "Цитрусовые",
    "category": "фрукты",
    "color": "#ef4444",
    "chemical_profile": {
      "acids": ["лимонная кислота"],
      "oils": ["лимонен"],
      "minerals": ["витамин C"]
    },
    "compatible_spices": [8, 15, 18],
    "cooking_methods": [1, 9],
    "flavor_compounds": ["терпены"],
    "texture": "сочная",
    "description": "Кислотность усиливает ароматы специй."
  },
  {
    "id": 25,
    "name": "Орехи",
    "category": "орехи_семена",
    "color": "#92400e",
    "chemical_profile": {
      "fats": ["олеиновая кислота"],
      "proteins": ["аргинин"],
      "minerals": ["магний"]
    },
    "compatible_spices": [27, 13, 22],
    "cooking_methods": [4, 6],
    "flavor_compounds": ["танины"],
    "texture": "хрустящая",
    "description": "Жиры усиливают растворимость специй."
  }
];