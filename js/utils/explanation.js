class ExplanationGenerator {
    constructor() {
        this.templates = {
            introduction: [
                'Анализ совместимости выбранных специй показывает интересные химические взаимодействия.',
                'Научное обоснование данной смеси специй основано на анализе активных соединений.',
                'Химический состав выбранных специй создает уникальные синергетические эффекты.'
            ],
            
            compoundInteraction: {
                synergistic: 'Соединение {compound} в специях {spices} создает синергетический эффект, усиливая {effect}.',
                complementary: 'Взаимодействие {compound1} и {compound2} обеспечивает сбалансированный вкусовой профиль.',
                enhancing: '{compound} усиливает биодоступность других активных веществ в смеси.'
            },
            
            cookingMethod: {
                high_temp: 'При высокотемпературной обработке ({method}) происходит {reaction}, что {effect}.',
                medium_temp: 'Умеренная температура ({method}) позволяет {reaction}, сохраняя {preservation}.',
                low_temp: 'Низкотемпературная обработка ({method}) обеспечивает {reaction} с минимальными потерями.'
            },
            
            productCompatibility: {
                excellent: 'Специи идеально дополняют {product}, так как {reason}.',
                good: 'Сочетание специй хорошо подходит для {product} благодаря {reason}.',
                moderate: 'Специи умеренно совместимы с {product}, обеспечивая {effect}.'
            }
        };
        
        this.compoundEffects = {
            'эвгенол': 'антибактериальные свойства и пряный аромат',
            'линалоол': 'цветочные ноты и успокаивающий эффект',
            'пиперин': 'жгучесть и усиление биодоступности куркумина',
            'куркумин': 'противовоспалительные свойства и золотистый цвет',
            'капсаицин': 'жгучесть и стимуляцию метаболизма',
            'тимол': 'антисептические свойства и травяной аромат',
            'карвакрол': 'антимикробную активность и острый вкус',
            'анетол': 'сладкий анисовый вкус и пищеварительные свойства',
            'цинеол': 'освежающий аромат и отхаркивающие свойства',
            'ментол': 'охлаждающий эффект и освежающие свойства'
        };
        
        this.temperatureCategories = {
            high: { min: 150, methods: ['жарка', 'гриль', 'запекание'] },
            medium: { min: 80, max: 149, methods: ['тушение', 'варка'] },
            low: { max: 79, methods: ['маринование', 'сырое', 'соление'] }
        };
    }
    
    generate(productIds, methodIds, spiceIds, analysis) {
        const products = productIds.map(id => window.PRODUCTS_DATA.find(p => p.id === id)).filter(Boolean);
        const methods = methodIds.map(id => window.COOKING_METHODS_DATA.find(m => m.id === id)).filter(Boolean);
        const spices = spiceIds.map(id => window.SPICES_DATA.find(s => s.id === id)).filter(Boolean);
        
        let explanation = '';
        
        explanation += this.generateIntroduction(analysis.score);
        explanation += this.generateCompoundAnalysis(analysis.compounds, spices);
        explanation += this.generateSynergyAnalysis(analysis.synergies);
        explanation += this.generateCookingMethodAnalysis(methods, spices);
        explanation += this.generateProductCompatibilityAnalysis(products, spices);
        explanation += this.generateRecommendations(analysis.recommendations);
        
        return explanation;
    }
    
    generateIntroduction(score) {
        const template = this.getRandomTemplate(this.templates.introduction);
        const scoreText = this.getScoreDescription(score);
        
        return `<div class="explanation-section">
            <h4>Общая оценка совместимости: ${scoreText}</h4>
            <p>${template}</p>
        </div>`;
    }
    
    generateCompoundAnalysis(compounds, spices) {
        if (!compounds || compounds.length === 0) {
            return '<div class="explanation-section"><h4>Химический анализ</h4><p>Недостаточно данных для анализа химических соединений.</p></div>';
        }
        
        let html = '<div class="explanation-section"><h4>Химический анализ</h4>';
        
        const synergisticCompounds = compounds.filter(c => c.count > 1);
        const uniqueCompounds = compounds.filter(c => c.count === 1);
        
        if (synergisticCompounds.length > 0) {
            html += '<h5>Синергетические соединения:</h5><ul>';
            synergisticCompounds.slice(0, 5).forEach(compound => {
                const effect = this.compoundEffects[compound.name] || 'уникальные свойства';
                html += `<li><strong>${compound.name}</strong> (содержится в: ${compound.spices.join(', ')}) - обеспечивает ${effect}</li>`;
            });
            html += '</ul>';
        }
        
        if (uniqueCompounds.length > 0) {
            html += '<h5>Дополнительные активные соединения:</h5><ul>';
            uniqueCompounds.slice(0, 8).forEach(compound => {
                const effect = this.compoundEffects[compound.name] || 'специфические характеристики';
                html += `<li><strong>${compound.name}</strong> - добавляет ${effect}</li>`;
            });
            html += '</ul>';
        }
        
        html += '</div>';
        return html;
    }
    
    generateSynergyAnalysis(synergies) {
        if (!synergies || synergies.length === 0) {
            return '<div class="explanation-section"><h4>Синергетические эффекты</h4><p>Специи в смеси работают независимо, не создавая значительных синергий.</p></div>';
        }
        
        let html = '<div class="explanation-section"><h4>Синергетические эффекты</h4><ul>';
        
        synergies.slice(0, 3).forEach(synergy => {
            const strengthText = this.getSynergyStrengthText(synergy.strength);
            html += `<li><strong>${synergy.spice1.name} + ${synergy.spice2.name}</strong> (${strengthText}): ${synergy.reasons.join(', ')}</li>`;
        });
        
        html += '</ul></div>';
        return html;
    }
    
    generateCookingMethodAnalysis(methods, spices) {
        if (!methods || methods.length === 0) {
            return '';
        }
        
        let html = '<div class="explanation-section"><h4>Влияние способов приготовления</h4>';
        
        methods.forEach(method => {
            const tempCategory = this.categorizeTemperature(method.temperature_range);
            const effects = this.analyzeCookingEffects(method, spices, tempCategory);
            
            html += `<h5>${method.name} (${method.temperature_range})</h5>`;
            html += `<p>${effects}</p>`;
        });
        
        html += '</div>';
        return html;
    }
    
    generateProductCompatibilityAnalysis(products, spices) {
        if (!products || products.length === 0) {
            return '';
        }
        
        let html = '<div class="explanation-section"><h4>Совместимость с продуктами</h4>';
        
        products.forEach(product => {
            const compatibility = this.analyzeProductSpiceCompatibility(product, spices);
            html += `<h5>${product.name}</h5>`;
            html += `<p>${compatibility}</p>`;
        });
        
        html += '</div>';
        return html;
    }
    
    generateRecommendations(recommendations) {
        if (!recommendations || recommendations.length === 0) {
            return '';
        }
        
        let html = '<div class="explanation-section"><h4>Рекомендации</h4>';
        
        recommendations.forEach(rec => {
            html += `<h5>${rec.title}</h5><ul>`;
            rec.items.forEach(item => {
                html += `<li><strong>${item.name}</strong> - ${item.reason}</li>`;
            });
            html += '</ul>';
        });
        
        html += '</div>';
        return html;
    }
    
    categorizeTemperature(tempRange) {
        const avgTemp = this.parseTemperatureRange(tempRange);
        
        if (avgTemp >= 150) return 'high';
        if (avgTemp >= 80) return 'medium';
        return 'low';
    }
    
    parseTemperatureRange(tempRange) {
        const matches = tempRange.match(/\d+/g);
        if (!matches) return 100;
        if (matches.length === 1) return parseInt(matches[0]);
        return (parseInt(matches[0]) + parseInt(matches[1])) / 2;
    }
    
    analyzeCookingEffects(method, spices, tempCategory) {
        const effects = [];
        
        spices.forEach(spice => {
            if (spice.chemical_compounds) {
                Object.entries(spice.chemical_compounds).forEach(([type, compounds]) => {
                    if (Array.isArray(compounds)) {
                        compounds.forEach(compound => {
                            const effect = this.getCookingEffect(compound, tempCategory, method.name);
                            if (effect) {
                                effects.push(`${compound} в ${spice.name} ${effect}`);
                            }
                        });
                    }
                });
            }
        });
        
        if (effects.length === 0) {
            return `При ${method.name.toLowerCase()} специи сохраняют свои основные свойства.`;
        }
        
        return effects.slice(0, 3).join('; ') + '.';
    }
    
    getCookingEffect(compound, tempCategory, methodName) {
        const effects = {
            high: {
                'эвгенол': 'интенсифицируется, создавая более выраженный пряный аромат',
                'пиперин': 'активируется, усиливая жгучесть',
                'куркумин': 'становится более биодоступным'
            },
            medium: {
                'линалоол': 'медленно высвобождается, обеспечивая длительный аромат',
                'тимол': 'сохраняет антисептические свойства',
                'анетол': 'раскрывает сладкие ноты'
            },
            low: {
                'ментол': 'сохраняет максимальную свежесть',
                'цинеол': 'обеспечивает деликатный аромат'
            }
        };
        
        return effects[tempCategory]?.[compound] || null;
    }
    
    analyzeProductSpiceCompatibility(product, spices) {
        const compatibleSpices = spices.filter(spice => 
            spice.best_products && spice.best_products.some(bp => 
                bp.toLowerCase() === product.name.toLowerCase() ||
                bp.toLowerCase() === product.category.toLowerCase()
            )
        );
        
        if (compatibleSpices.length === spices.length) {
            return `Все выбранные специи идеально подходят для ${product.category}, создавая гармоничное сочетание вкусов.`;
        } else if (compatibleSpices.length > spices.length / 2) {
            return `Большинство специй (${compatibleSpices.map(s => s.name).join(', ')}) отлично дополняют ${product.name}.`;
        } else {
            return `Некоторые специи могут не полностью раскрыться с ${product.name}, но создадут интересный вкусовой контраст.`;
        }
    }
    
    getScoreDescription(score) {
        if (score >= 90) return `${Math.round(score)}% - Превосходно`;
        if (score >= 75) return `${Math.round(score)}% - Отлично`;
        if (score >= 60) return `${Math.round(score)}% - Хорошо`;
        if (score >= 40) return `${Math.round(score)}% - Удовлетворительно`;
        return `${Math.round(score)}% - Требует корректировки`;
    }
    
    getSynergyStrengthText(strength) {
        if (strength >= 0.8) return 'очень сильная синергия';
        if (strength >= 0.6) return 'сильная синергия';
        if (strength >= 0.4) return 'умеренная синергия';
        return 'слабая синергия';
    }
    
    getRandomTemplate(templates) {
        return templates[Math.floor(Math.random() * templates.length)];
    }
}