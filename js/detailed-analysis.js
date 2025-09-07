class DetailedAnalysisHelpers {
    static getDetailedCompatibilityReason(product, spice) {
        const categoryReasons = {
            'мясо': `${spice.name} содержит соединения, которые расщепляют белки и жиры в мясе, улучшая его усвояемость и вкус`,
            'птица': `Ароматические соединения ${spice.name} проникают в нежные волокна птицы, создавая сбалансированный вкус`,
            'рыба': `${spice.name} нейтрализует специфические амины рыбы и подчеркивает ее деликатный вкус`,
            'овощи': `Фитохимические соединения ${spice.name} усиливают природные сахара и витамины в овощах`,
            'крупы': `${spice.name} обогащает нейтральную крахмалистую основу, добавляя сложность вкуса`
        };
        
        return categoryReasons[product.category] || `${spice.name} химически совместим с ${product.name}`;
    }
    
    static analyzeChemicalCompatibility(product, spice) {
        if (!spice.chemical_compounds) return 'Химический анализ недоступен';
        
        const compounds = [];
        if (spice.chemical_compounds.volatile_oils) {
            compounds.push(...spice.chemical_compounds.volatile_oils);
        }
        if (spice.chemical_compounds.phenolic_compounds) {
            compounds.push(...spice.chemical_compounds.phenolic_compounds);
        }
        
        const effects = compounds.map(compound => {
            const compoundData = window.compatibilityAnalyzer.compoundDatabase[compound];
            return compoundData ? compoundData.effects : `${compound} взаимодействует с продуктом`;
        });
        
        return `Активные соединения: ${compounds.join(', ')}. Эффекты: ${effects.join('; ')}`;
    }
    
    static analyzeTasteInteraction(product, spice) {
        const tasteProfiles = spice.taste_profile || [];
        const intensity = spice.intensity || 5;
        
        const interactions = {
            'ароматный': 'усиливает натуральные ароматы продукта',
            'пряный': 'добавляет теплые пряные ноты',
            'острый': 'создает контраст и стимулирует рецепторы',
            'сладкий': 'балансирует соленые и кислые вкусы',
            'горьковатый': 'добавляет сложность и глубину',
            'цитрусовый': 'освежает и осветляет тяжелые вкусы',
            'земляной': 'создает основу для других вкусов'
        };
        
        const profileEffects = tasteProfiles.map(profile => interactions[profile] || profile).join(', ');
        const intensityEffect = intensity > 6 ? 'доминирует во вкусе' : intensity < 4 ? 'деликатно дополняет' : 'гармонично сочетается';
        
        return `Вкусовой профиль: ${profileEffects}. Интенсивность ${intensity}/10 - ${intensityEffect}`;
    }
    
    static getNutritionalBenefits(product, spice) {
        const benefits = {
            'базилик': 'богат витамином K, антиоксидантами, улучшает пищеварение',
            'орегано': 'высокое содержание антиоксидантов, антибактериальные свойства',
            'тимьян': 'источник витамина C, тимол обладает антисептическими свойствами',
            'розмарин': 'улучшает память, содержит розмариновую кислоту',
            'кориандр': 'помогает пищеварению, содержит витамины A и K',
            'кумин': 'богат железом, улучшает пищеварение',
            'имбирь': 'противовоспалительные свойства, улучшает пищеварение',
            'куркума': 'мощный антиоксидант, противовоспалительные свойства'
        };
        
        return benefits[spice.name.toLowerCase()] || 'обогащает блюдо полезными соединениями';
    }
    
    static getIncompatibilityReason(product, spice) {
        return `${spice.name} может перебить ${product.name} неприятным послевкусием`;
    }
    
    static analyzeChemicalConflict(product, spice) {
        return `Химический конфликт ${spice.name} может нежелательно реагировать с ${product.name}`;
    }
    
    static analyzeTasteClash(product, spice) {
        const intensity = spice.intensity || 5;
        if (intensity > 7) {
            return `Высокая интенсивность ${spice.name} (${intensity}/10) подавляет натуральный вкус ${product.name}`;
        }
        return `Вкусовые профили ${spice.name} и ${product.name} создают дисгармонию`;
    }
    
    static getAlternativeRecommendation(product, spice) {
        const alternatives = {
            'мясо': ['черный перец', 'тимьян', 'розмарин'],
            'рыба': ['укроп', 'лимон', 'петрушка'],
            'овощи': ['базилик', 'орегано', 'тимьян']
        };
        
        const categoryAlts = alternatives[product.category] || ['более мягкие специи'];
        return `Рекомендуем заменить на ${categoryAlts.join(', ')}`;
    }
    
    static getTemperatureEffect(method, spice) {
        const temp = method.temperature_range || '';
        const compounds = spice.chemical_compounds || {};
        
        if (temp.includes('200') || temp.includes('300')) {
            return `При высокой температуре (${temp}) летучие масла ${spice.name} быстро испаряются`;
        } else if (temp.includes('100')) {
            return `При температуре ${temp} соединения ${spice.name} медленно извлекаются`;
        } else {
            return `При низкой температуре (${temp}) деликатные ароматы ${spice.name} сохраняются`;
        }
    }
    
    static getChemicalChanges(method, spice) {
        const methodEffects = {
            'жарка': 'Реакция Майяра усиливает вкус',
            'варка': 'Водорастворимые соединения извлекаются',
            'тушение': 'Медленное извлечение концентрирует вкус',
            'запекание': 'Сухой жар концентрирует ароматы',
            'гриль': 'Высокая температура создает дымные ароматы'
        };
        
        return methodEffects[method.name.toLowerCase()] || 'Соединения трансформируются';
    }
    
    static getAromaDevelopment(method, spice) {
        const duration = method.duration || '';
        const intensity = spice.intensity || 5;
        
        if (duration.includes('час')) {
            return `Длительная обработка (${duration}) позволяет ${spice.name} полностью развить аромат`;
        } else if (duration.includes('мин')) {
            return `Короткая обработка (${duration}) сохраняет яркость ${spice.name}`;
        }
        
        return `Аромат ${spice.name} постепенно развивается в процессе приготовления`;
    }
    
    static getOptimalTiming(method, spice) {
        const role = spice.role || 'базовая';
        
        const timingRules = {
            'базовая': 'добавлять в начале',
            'связывающая': 'добавлять в середине',
            'акцентная': 'добавлять ближе к концу',
            'финишная': 'добавлять в конце'
        };
        
        return timingRules[role] || 'использовать согласно рецепту';
    }
    
    static getTechniqueTips(method, spice) {
        const tips = {
            'жарка': 'добавлять в разогретое масло',
            'варка': 'использовать марлевый мешочек',
            'тушение': 'обжарить перед добавлением',
            'запекание': 'смешать с маслом',
            'гриль': 'использовать в маринаде'
        };
        
        return tips[method.name.toLowerCase()] || 'следовать общим правилам';
    }
}

window.DetailedAnalysisHelpers = DetailedAnalysisHelpers;