class CompatibilityAnalyzer {
    constructor() {
        this.cache = new Map();
        this.compoundDatabase = this.initializeCompoundDatabase();
        this.temperatureEffects = this.initializeTemperatureEffects();
        this.spiceSynergies = this.initializeSpiceSynergies();
    }
    
    initializeCompoundDatabase() {
        return {
            'эвгенол': {
                properties: ['антиоксидант', 'антимикробный', 'анестетик'],
                temperature_stability: '150°C',
                synergies: ['линалоол', 'тимол'],
                effects: 'придает гвоздичный аромат, усиливает вкус мяса'
            },
            'линалоол': {
                properties: ['седативный', 'антибактериальный', 'ароматический'],
                temperature_stability: '180°C',
                synergies: ['эвгенол', 'гераниол'],
                effects: 'создает цветочные ноты, смягчает острые вкусы'
            },
            'тимол': {
                properties: ['антисептический', 'противогрибковый', 'отхаркивающий'],
                temperature_stability: '200°C',
                synergies: ['карвакрол', 'эвгенол'],
                effects: 'усиливает пряный вкус, консервирует продукты'
            },
            'карвакрол': {
                properties: ['антимикробный', 'антиоксидант', 'противовоспалительный'],
                temperature_stability: '190°C',
                synergies: ['тимол', 'розмариновая кислота'],
                effects: 'создает острый пряный вкус, улучшает пищеварение'
            },
            'камфора': {
                properties: ['стимулирующий', 'охлаждающий', 'антисептический'],
                temperature_stability: '160°C',
                synergies: ['цинеол', 'розмариновая кислота'],
                effects: 'придает смолистый аромат, стимулирует аппетит'
            },
            'цинеол': {
                properties: ['отхаркивающий', 'противовоспалительный', 'охлаждающий'],
                temperature_stability: '170°C',
                synergies: ['камфора', 'туйон'],
                effects: 'создает свежий ментоловый оттенок'
            },
            'куминальдегид': {
                properties: ['пищеварительный', 'ветрогонный', 'антиспазматический'],
                temperature_stability: '180°C',
                synergies: ['лимонен', 'карвон'],
                effects: 'придает характерный земляной аромат кумина'
            },
            'анетол': {
                properties: ['эстрогенный', 'отхаркивающий', 'ветрогонный'],
                temperature_stability: '160°C',
                synergies: ['фенхон', 'лимонен'],
                effects: 'создает сладкий анисовый вкус'
            }
        };
    }
    
    initializeTemperatureEffects() {
        return {
            'низкая': {
                range: '20-60°C',
                effects: 'сохранение летучих соединений, свежие ароматы',
                suitable_compounds: ['линалоол', 'гераниол', 'лимонен']
            },
            'средняя': {
                range: '60-120°C',
                effects: 'частичное разрушение летучих масел, концентрация вкуса',
                suitable_compounds: ['тимол', 'карвакрол', 'эвгенол']
            },
            'высокая': {
                range: '120-200°C',
                effects: 'карамелизация, реакция Майяра, новые ароматы',
                suitable_compounds: ['камфора', 'цинеол', 'куминальдегид']
            },
            'очень_высокая': {
                range: '200°C+',
                effects: 'пиролиз, дымные ароматы, концентрированные вкусы',
                suitable_compounds: ['тимол', 'карвакрол']
            }
        };
    }
    
    initializeSpiceSynergies() {
        return {
            'средиземноморские': {
                spices: ['базилик', 'орегано', 'тимьян', 'розмарин'],
                synergy: 'общие фенольные соединения создают гармоничный букет',
                best_with: ['мясо', 'овощи', 'паста']
            },
            'восточные': {
                spices: ['кориандр', 'кумин', 'кардамон', 'корица'],
                synergy: 'терпеновые соединения усиливают друг друга',
                best_with: ['рис', 'мясо', 'бобовые']
            },
            'пряные': {
                spices: ['черный перец', 'красный перец', 'имбирь', 'чеснок'],
                synergy: 'капсаициноиды и пиперин создают многослойную остроту',
                best_with: ['мясо', 'овощи']
            }
        };
    }
    
    analyzeSelection(selectedProducts, selectedMethods, selectedSpices, data) {
        const cacheKey = this.generateCacheKey(selectedProducts, selectedMethods, selectedSpices);
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const analysis = {
            compatibility: [],
            cookingProcesses: [],
            chemicalReactions: [],
            recommendations: []
        };
        
        if (selectedProducts.length > 0 && selectedSpices.length > 0) {
            analysis.compatibility = this.analyzeProductSpiceCompatibility(
                selectedProducts, selectedSpices, data
            );
        }
        
        if (selectedMethods.length > 0 && selectedSpices.length > 0) {
            analysis.cookingProcesses = this.analyzeCookingProcesses(
                selectedMethods, selectedSpices, data
            );
        }
        
        if (selectedSpices.length >= 2) {
            analysis.chemicalReactions = this.analyzeChemicalReactions(
                selectedSpices, data
            );
        }
        
        analysis.recommendations = this.generateRecommendations(
            selectedProducts, selectedMethods, selectedSpices, data
        );
        
        this.cache.set(cacheKey, analysis);
        return analysis;
    }
    
    analyzeProductSpiceCompatibility(productIds, spiceIds, data) {
        const explanations = [];
        
        productIds.forEach(productId => {
            const product = data.products.find(p => p.id === productId);
            if (!product) return;
            
            spiceIds.forEach(spiceId => {
                const spice = data.spices.find(s => s.id === spiceId);
                if (!spice) return;
                
                const compatibility = this.analyzeDetailedCompatibility(product, spice);
                if (compatibility.compatible) {
                    explanations.push({
                        title: `${spice.name} + ${product.name}`,
                        reason: compatibility.reason,
                        chemical_basis: compatibility.chemical_basis,
                        taste_interaction: compatibility.taste_interaction,
                        nutritional_benefits: compatibility.nutritional_benefits
                    });
                } else if (compatibility.incompatible) {
                    explanations.push({
                        title: `Несовместимость: ${spice.name} + ${product.name}`,
                        reason: compatibility.incompatible_reason,
                        chemical_conflict: compatibility.chemical_conflict,
                        taste_clash: compatibility.taste_clash,
                        recommendation: compatibility.recommendation
                    });
                }
            });
        });
        
        return explanations;
    }
    
    analyzeDetailedCompatibility(product, spice) {
        const result = {
            compatible: false,
            incompatible: false,
            reason: '',
            chemical_basis: '',
            taste_interaction: '',
            nutritional_benefits: ''
        };
        
        if (product.compatible_spices && product.compatible_spices.includes(spice.id)) {
            result.compatible = true;
            result.reason = this.getDetailedCompatibilityReason(product, spice);
            result.chemical_basis = this.analyzeChemicalCompatibility(product, spice);
            result.taste_interaction = this.analyzeTasteInteraction(product, spice);
            result.nutritional_benefits = this.getNutritionalBenefits(product, spice);
        } else if (product.incompatible_spices && product.incompatible_spices.includes(spice.id)) {
            result.incompatible = true;
            result.incompatible_reason = this.getIncompatibilityReason(product, spice);
            result.chemical_conflict = this.analyzeChemicalConflict(product, spice);
            result.taste_clash = this.analyzeTasteClash(product, spice);
            result.recommendation = this.getAlternativeRecommendation(product, spice);
        }
        
        return result;
    }
    
    analyzeCookingProcesses(methodIds, spiceIds, data) {
        const processes = [];
        
        methodIds.forEach(methodId => {
            const method = data.methods.find(m => m.id === methodId);
            if (!method) return;
            
            spiceIds.forEach(spiceId => {
                const spice = data.spices.find(s => s.id === spiceId);
                if (!spice) return;
                
                const process = {
                    title: `${method.name} + ${spice.name}`,
                    temperature_effect: this.getTemperatureEffect(method, spice),
                    chemical_changes: this.getChemicalChanges(method, spice),
                    aroma_development: this.getAromaDevelopment(method, spice),
                    optimal_timing: this.getOptimalTiming(method, spice),
                    technique_tips: this.getTechniqueTips(method, spice)
                };
                
                processes.push(process);
            });
        });
        
        return processes;
    }
    
    analyzeChemicalReactions(spiceIds, data) {
        const reactions = [];
        
        for (let i = 0; i < spiceIds.length; i++) {
            for (let j = i + 1; j < spiceIds.length; j++) {
                const spice1 = data.spices.find(s => s.id === spiceIds[i]);
                const spice2 = data.spices.find(s => s.id === spiceIds[j]);
                
                if (spice1 && spice2) {
                    const reaction = this.getDetailedChemicalReaction(spice1, spice2);
                    if (reaction) {
                        reactions.push(reaction);
                    }
                }
            }
        }
        
        return reactions;
    }
    
    generateRecommendations(productIds, methodIds, spiceIds, data) {
        const recommendations = [];
        
        if (spiceIds.length > 0) {
            const spices = spiceIds.map(id => data.spices.find(s => s.id === id)).filter(Boolean);
            const mixture = this.identifySpiceMixture(spices);
            
            if (mixture) {
                recommendations.push({
                    type: 'mixture',
                    title: `Смесь специй: ${mixture.name}`,
                    content: mixture.description,
                    priority: 'high'
                });
            }
            
            const incompatiblePairs = this.findIncompatibleSpicePairs(spices);
            if (incompatiblePairs.length > 0) {
                recommendations.push({
                    type: 'warning',
                    title: 'Потенциальные конфликты',
                    content: `Осторожно с сочетанием: ${incompatiblePairs.map(p => `${p.spice1} + ${p.spice2}`).join(', ')}`,
                    priority: 'high'
                });
            }
        }
        
        if (methodIds.length > 0 && spiceIds.length > 0) {
            const methods = methodIds.map(id => data.methods.find(m => m.id === id)).filter(Boolean);
            const spices = spiceIds.map(id => data.spices.find(s => s.id === id)).filter(Boolean);
            
            const timingRecommendation = this.generateTimingRecommendation(methods, spices);
            if (timingRecommendation) {
                recommendations.push({
                    type: 'timing',
                    title: 'Рекомендации по времени',
                    content: timingRecommendation,
                    priority: 'medium'
                });
            }
        }
        
        return recommendations;
    }
    
    getDetailedCompatibilityReason(product, spice) {
        return `${spice.name} отлично сочетается с ${product.name} благодаря дополняющим профилям.`;
    }

    analyzeChemicalCompatibility(product, spice) {
        return `Химические соединения ${spice.name} усиливают натуральные вкусы ${product.name} без конфликтующих реакций.`;
    }

    analyzeTasteInteraction(product, spice) {
        return `Вкусовые ноты ${spice.name} гармонично дополняют основной вкус ${product.name}, создавая сбалансированный профиль.`;
    }

    getNutritionalBenefits(product, spice) {
        return `Сочетание ${product.name} с ${spice.name} улучшает усвоение питательных веществ.`;
    }
    
    getIncompatibilityReason(product, spice) {
        return `${spice.name} может перебить натуральный вкус ${product.name} или создать неприятные сочетания.`;
    }

    analyzeChemicalConflict(product, spice) {
        return `Химические соединения ${spice.name} могут нежелательно реагировать с компонентами ${product.name}.`;
    }

    analyzeTasteClash(product, spice) {
        return `Интенсивность ${spice.name} может подавить деликатные вкусовые ноты ${product.name}.`;
    }

    getAlternativeRecommendation(product, spice) {
        return `Рекомендуем использовать более мягкие специи или уменьшить количество ${spice.name}.`;
    }
    
    getTemperatureEffect(method, spice) {
        const temp = method.temperature || 100;
        if (temp > 180) {
            return `Высокая температура ${method.name} может разрушить летучие соединения ${spice.name}.`;
        } else if (temp < 60) {
            return `Низкая температура ${method.name} сохранит ароматические свойства ${spice.name}.`;
        }
        return `Температура ${method.name} оптимальна для аромата ${spice.name}.`;
    }

    getChemicalChanges(method, spice) {
        return `Во время ${method.name} происходят химические изменения в ${spice.name}, которые усиливают ароматические свойства.`;
    }

    getAromaDevelopment(method, spice) {
        return `${method.name} способствует постепенному развитию аромата ${spice.name} в процессе приготовления.`;
    }
    
    getOptimalTiming(method, spice) {
        const intensity = spice.intensity || 5;
        if (intensity > 7) {
            return `Добавляйте ${spice.name} в конце ${method.name} чтобы избежать горечи.`;
        } else if (intensity < 3) {
            return `Добавляйте ${spice.name} в начале ${method.name} для лучшего аромата.`;
        }
        return `Добавляйте ${spice.name} в середине ${method.name}.`;
    }

    getTechniqueTips(method, spice) {
        return `Во время ${method.name} рекомендуем предварительно активировать ${spice.name} для усиления аромата.`;
    }
    
    identifySpiceMixture(spices) {
        const spiceNames = spices.map(s => s.name.toLowerCase());
        
        if (spiceNames.includes('кумин') && spiceNames.includes('кориандр') && spiceNames.includes('куркума')) {
            return {
                name: 'карри',
                description: 'классическая индийская смесь специй'
            };
        }
        
        if (spiceNames.includes('базилик') && spiceNames.includes('орегано') && spiceNames.includes('тимьян')) {
            return {
                name: 'прованские травы',
                description: 'традиционная французская смесь трав'
            };
        }
        
        return null;
    }
    
    findIncompatibleSpicePairs(spices) {
        const incompatible = [];
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const spice1 = spices[i];
                const spice2 = spices[j];
                
                if ((spice1.intensity || 5) + (spice2.intensity || 5) > 15) {
                    incompatible.push({
                        spice1: spice1.name,
                        spice2: spice2.name,
                        reason: 'слишком интенсивное сочетание'
                    });
                }
            }
        }
        
        return incompatible;
    }
    
    generateTimingRecommendation(methods, spices) {
        const recommendations = [];
        
        spices.forEach(spice => {
            const intensity = spice.intensity || 5;
            if (intensity > 7) {
                recommendations.push(`${spice.name} - добавлять в конце приготовления`);
            } else if (intensity < 3) {
                recommendations.push(`${spice.name} - добавлять в начале приготовления`);
            } else {
                recommendations.push(`${spice.name} - добавлять в середине процесса`);
            }
        });
        
        return recommendations.join('; ');
    }
    
    getDetailedChemicalReaction(spice1, spice2) {
        const compounds1 = this.extractCompounds(spice1);
        const compounds2 = this.extractCompounds(spice2);
        
        const commonCompounds = compounds1.filter(c => compounds2.includes(c));
        const synergyCompounds = this.findSynergyCompounds(compounds1, compounds2);
        
        return {
            title: `Химическое взаимодействие: ${spice1.name} + ${spice2.name}`,
            common_compounds: commonCompounds,
            synergy_compounds: synergyCompounds,
            reaction_type: this.determineReactionType(spice1, spice2),
            temperature_range: this.getOptimalTemperatureRange(compounds1, compounds2),
            flavor_result: this.predictFlavorResult(spice1, spice2),
            molecular_explanation: this.getMolecularExplanation(commonCompounds, synergyCompounds, spice1, spice2)
        };
    }
    
    extractCompounds(spice) {
        const compounds = [];
        
        if (spice.chemical_compounds) {
            if (spice.chemical_compounds.volatile_oils) {
                compounds.push(...spice.chemical_compounds.volatile_oils);
            }
            if (spice.chemical_compounds.phenolic_compounds) {
                compounds.push(...spice.chemical_compounds.phenolic_compounds);
            }
            if (spice.chemical_compounds.alkaloids) {
                compounds.push(...spice.chemical_compounds.alkaloids);
            }
        }
        
        return compounds;
    }
    
    findSynergyCompounds(compounds1, compounds2) {
        const synergies = [];
        compounds1.forEach(c1 => {
            compounds2.forEach(c2 => {
                const compound1Data = this.compoundDatabase[c1];
                const compound2Data = this.compoundDatabase[c2];
                if (compound1Data && compound2Data) {
                    if (compound1Data.synergies && compound1Data.synergies.includes(c2)) {
                        synergies.push({ compound1: c1, compound2: c2, effect: compound1Data.effects });
                    }
                }
            });
        });
        return synergies;
    }
    
    determineReactionType(spice1, spice2) {
        const intensity1 = spice1.intensity || 5;
        const intensity2 = spice2.intensity || 5;
        const totalIntensity = intensity1 + intensity2;
        
        if (totalIntensity > 12) {
            return 'интенсивное взаимодействие';
        } else if (totalIntensity < 8) {
            return 'деликатное взаимодействие';
        } else if (Math.abs(intensity1 - intensity2) > 3) {
            return 'контрастное взаимодействие';
        }
        return 'сбалансированное взаимодействие';
    }
    
    getOptimalTemperatureRange(compounds1, compounds2) {
        const allCompounds = [...compounds1, ...compounds2];
        
        if (allCompounds.length === 0) {
            return '60-180°C';
        }
        
        const stableTemps = allCompounds.map(c => {
            const data = this.compoundDatabase[c];
            return data ? parseInt(data.temperature_stability) : 150;
        });
        
        const minTemp = Math.min(...stableTemps);
        const maxTemp = Math.max(...stableTemps);
        
        if (minTemp === maxTemp) {
            return `Оптимальная температура: до ${minTemp}°C для сохранения ароматических свойств`;
        } else {
            return `Температурный диапазон: ${Math.max(60, minTemp - 20)}-${minTemp}°C для максимального сохранения`;
        }
    }
    
    predictFlavorResult(spice1, spice2) {
        const profile1 = spice1.taste_profile || [];
        const profile2 = spice2.taste_profile || [];
        const combinedProfiles = [...new Set([...profile1, ...profile2])];
        
        if (combinedProfiles.length === 0) {
            return `Сочетание ${spice1.name} и ${spice2.name} создает многослойный профиль`;
        }
        
        const commonProfiles = profile1.filter(p => profile2.includes(p));
        
        if (commonProfiles.length > 0) {
            return `Результирующий вкус: ${combinedProfiles.join(', ')} с особым усилением (${commonProfiles.join(', ')})`;
        } else {
            return `Результирующий вкус: ${combinedProfiles.join(', ')} - дополняющее сочетание`;
        }
    }
    
    getMolecularExplanation(commonCompounds, synergyCompounds, spice1, spice2) {
        let explanation = '';
        
        if (commonCompounds.length > 0) {
            explanation += `Общие соединения (${commonCompounds.join(', ')}) создают резонансный эффект. `;
        }
        
        if (synergyCompounds.length > 0) {
            const synergyNames = synergyCompounds.map(s => `${s.compound1}+${s.compound2}`).join(', ');
            explanation += `Синергетические пары (${synergyNames}) создают новые ароматические соединения.`;
        }
        
        if (explanation === '') {
            const compounds1 = this.extractCompounds(spice1);
            const compounds2 = this.extractCompounds(spice2);
            
            if (compounds1.length > 0 && compounds2.length > 0) {
                explanation = `Химические соединения ${spice1.name} (${compounds1.slice(0,2).join(', ')}) взаимодействуют с соединениями ${spice2.name} (${compounds2.slice(0,2).join(', ')}), создавая сложный профиль.`;
            } else {
                explanation = `Молекулярные взаимодействия между ${spice1.name} и ${spice2.name} создают уникальный профиль.`;
            }
        }
        
        return explanation;
    }
    
    generateCacheKey(products, methods, spices) {
        return `${products.sort().join(',')}-${methods.sort().join(',')}-${spices.sort().join(',')}`;
    }
    
    analyzeCompatibility(productIds, methodIds, spiceIds, data) {
        return this.analyzeSelection(productIds, methodIds, spiceIds, data);
    }
    
    getCookingProcess(productIds, methodIds, spiceIds, data) {
        if (methodIds.length === 0 || spiceIds.length === 0) return [];
        return this.analyzeCookingProcesses(methodIds, spiceIds, data);
    }
    
    getChemicalReaction(productIds, methodIds, spiceIds, data) {
        if (spiceIds.length < 2) return [];
        return this.analyzeChemicalReactions(spiceIds, data);
    }
}

window.compatibilityAnalyzer = new CompatibilityAnalyzer();