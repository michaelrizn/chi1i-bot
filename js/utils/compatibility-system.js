class CompatibilitySystem {
    constructor() {
        this.spices = window.SPICES_DATA || [];
        this.products = window.PRODUCTS_DATA || [];
        this.cookingMethods = window.COOKING_METHODS_DATA || [];
        this.cache = new Map();
    }

    analyzeSpiceMix(spiceIds, productIds, cookingMethodIds) {
        const cacheKey = `${spiceIds.sort().join(',')}-${productIds.sort().join(',')}-${cookingMethodIds.sort().join(',')}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const analysis = {
            compatibility_score: 0,
            chemical_synergies: [],
            conflicts: [],
            recommendations: [],
            scientific_explanation: '',
            temperature_compatibility: {},
            flavor_balance: {},
            health_benefits: []
        };

        const selectedSpices = this.spices.filter(s => spiceIds.includes(s.id));
        const selectedProducts = this.products.filter(p => productIds.includes(p.id));
        const selectedMethods = this.cookingMethods.filter(m => cookingMethodIds.includes(m.id));

        analysis.compatibility_score = this.calculateCompatibilityScore(
            selectedSpices, selectedProducts, selectedMethods
        );

        analysis.chemical_synergies = this.findChemicalSynergies(selectedSpices);
        analysis.conflicts = this.findConflicts(selectedSpices, selectedProducts, selectedMethods);
        analysis.recommendations = this.generateRecommendations(selectedSpices, selectedProducts, selectedMethods);
        analysis.scientific_explanation = this.generateScientificExplanation(selectedSpices, selectedProducts, selectedMethods);
        analysis.temperature_compatibility = this.analyzeTemperatureCompatibility(selectedSpices, selectedMethods);
        analysis.flavor_balance = this.analyzeFlavorBalance(selectedSpices);
        analysis.health_benefits = this.analyzeHealthBenefits(selectedSpices, selectedProducts);

        this.cache.set(cacheKey, analysis);
        return analysis;
    }

    calculateCompatibilityScore(spices, products, methods) {
        let score = 50;
        let factors = 0;

        spices.forEach(spice => {
            products.forEach(product => {
                if (product.compatible_spices && product.compatible_spices.includes(spice.id)) {
                    score += 15;
                    factors++;
                }
            });

            methods.forEach(method => {
                if (spice.compatible_methods && spice.compatible_methods.includes(method.id)) {
                    score += 10;
                    factors++;
                }
            });
        });

        const conflictPenalty = this.calculateConflictPenalty(spices);
        score -= conflictPenalty;

        const chemicalBonus = this.calculateChemicalBonus(spices);
        score += chemicalBonus;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    calculateConflictPenalty(spices) {
        let penalty = 0;
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const spice1 = spices[i];
                const spice2 = spices[j];
                
                if (spice1.incompatible_spices && spice1.incompatible_spices.includes(spice2.id)) {
                    penalty += 20;
                }
                if (spice2.incompatible_spices && spice2.incompatible_spices.includes(spice1.id)) {
                    penalty += 20;
                }
            }
        }
        
        return penalty;
    }

    calculateChemicalBonus(spices) {
        let bonus = 0;
        const compounds = {};
        
        spices.forEach(spice => {
            Object.values(spice.chemical_compounds).flat().forEach(compound => {
                compounds[compound] = (compounds[compound] || 0) + 1;
            });
        });
        
        Object.values(compounds).forEach(count => {
            if (count > 1) {
                bonus += count * 5;
            }
        });
        
        return bonus;
    }

    findChemicalSynergies(spices) {
        const synergies = [];
        const compoundMap = {};
        
        spices.forEach(spice => {
            Object.entries(spice.chemical_compounds).forEach(([type, compounds]) => {
                compounds.forEach(compound => {
                    if (!compoundMap[compound]) {
                        compoundMap[compound] = [];
                    }
                    compoundMap[compound].push({ spice: spice.name, type });
                });
            });
        });
        
        Object.entries(compoundMap).forEach(([compound, sources]) => {
            if (sources.length > 1) {
                synergies.push({
                    compound,
                    spices: sources.map(s => s.spice),
                    effect: this.getCompoundEffect(compound),
                    strength: sources.length
                });
            }
        });
        
        return synergies;
    }

    getCompoundEffect(compound) {
        const effects = {
            'эвгенол': 'Антибактериальное действие и пряный аромат',
            'линалоол': 'Цветочный аромат и успокаивающий эффект',
            'карвакрол': 'Антимикробные свойства',
            'тимол': 'Антисептическое действие',
            'пиперин': 'Усиление биодоступности других соединений',
            'капсаицин': 'Жгучесть и ускорение метаболизма',
            'куркумин': 'Противовоспалительное действие',
            'анетол': 'Сладкий анисовый вкус',
            'цинеол': 'Освежающий эффект',
            'гингерол': 'Противовоспалительное и согревающее действие'
        };
        
        return effects[compound] || 'Усиление общего аромата';
    }

    findConflicts(spices, products, methods) {
        const conflicts = [];
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const spice1 = spices[i];
                const spice2 = spices[j];
                
                if (spice1.incompatible_spices && spice1.incompatible_spices.includes(spice2.id)) {
                    conflicts.push({
                        type: 'spice_conflict',
                        spices: [spice1.name, spice2.name],
                        reason: 'Конфликтующие вкусовые профили',
                        severity: 'high'
                    });
                }
            }
        }
        
        methods.forEach(method => {
            spices.forEach(spice => {
                if (spice.compatible_methods && !spice.compatible_methods.includes(method.id)) {
                    const temperatureConflict = this.checkTemperatureConflict(spice, method);
                    if (temperatureConflict) {
                        conflicts.push({
                            type: 'temperature_conflict',
                            spice: spice.name,
                            method: method.name,
                            reason: temperatureConflict,
                            severity: 'medium'
                        });
                    }
                }
            });
        });
        
        return conflicts;
    }

    checkTemperatureConflict(spice, method) {
        const volatileOils = spice.chemical_compounds.volatile_oils || [];
        const highTempMethods = ['жарка', 'гриль', 'запекание'];
        const delicateCompounds = ['линалоол', 'гераниол', 'линалилацетат'];
        
        if (highTempMethods.includes(method.name.toLowerCase()) && 
            volatileOils.some(oil => delicateCompounds.includes(oil))) {
            return 'Высокие температуры могут разрушить деликатные эфирные масла';
        }
        
        return null;
    }

    generateRecommendations(spices, products, methods) {
        const recommendations = [];
        
        const spiceCategories = {};
        spices.forEach(spice => {
            spiceCategories[spice.category] = (spiceCategories[spice.category] || 0) + 1;
        });
        
        if (!spiceCategories['травы'] && products.some(p => p.category === 'овощи')) {
            recommendations.push({
                type: 'add_spice',
                suggestion: 'Добавьте свежие травы (базилик, петрушка) для овощных блюд',
                reason: 'Травы усиливают вкус овощей'
            });
        }
        
        if (!spiceCategories['перцы'] && products.some(p => p.category === 'мясо')) {
            recommendations.push({
                type: 'add_spice',
                suggestion: 'Рассмотрите добавление черного перца для мясных блюд',
                reason: 'Пиперин усиливает вкус мяса'
            });
        }
        
        if (methods.some(m => m.name === 'Жарка') && !spices.some(s => s.name === 'Чеснок')) {
            recommendations.push({
                type: 'cooking_tip',
                suggestion: 'При жарке добавляйте чеснок в конце приготовления',
                reason: 'Предотвращает горение и сохраняет аромат'
            });
        }
        
        return recommendations;
    }

    generateScientificExplanation(spices, products, methods) {
        let explanation = 'Научное обоснование совместимости:\n\n';
        
        const dominantCompounds = this.findDominantCompounds(spices);
        if (dominantCompounds.length > 0) {
            explanation += `Основные активные соединения: ${dominantCompounds.join(', ')}. `;
        }
        
        const synergies = this.findChemicalSynergies(spices);
        if (synergies.length > 0) {
            explanation += `Обнаружены химические синергии между ${synergies.length} соединениями, что усиливает общий эффект. `;
        }
        
        methods.forEach(method => {
            explanation += `${method.name} при ${method.temperature_range} ${method.spice_interaction.toLowerCase()}. `;
        });
        
        return explanation;
    }

    findDominantCompounds(spices) {
        const compounds = {};
        
        spices.forEach(spice => {
            Object.values(spice.chemical_compounds).flat().forEach(compound => {
                compounds[compound] = (compounds[compound] || 0) + 1;
            });
        });
        
        return Object.entries(compounds)
            .filter(([_, count]) => count >= 2)
            .map(([compound, _]) => compound)
            .slice(0, 3);
    }

    analyzeTemperatureCompatibility(spices, methods) {
        const compatibility = {};
        
        methods.forEach(method => {
            compatibility[method.name] = {
                suitable_spices: [],
                problematic_spices: [],
                temperature_range: method.temperature_range
            };
            
            spices.forEach(spice => {
                if (spice.compatible_methods && spice.compatible_methods.includes(method.id)) {
                    compatibility[method.name].suitable_spices.push(spice.name);
                } else {
                    compatibility[method.name].problematic_spices.push(spice.name);
                }
            });
        });
        
        return compatibility;
    }

    analyzeFlavorBalance(spices) {
        const profiles = {};
        
        spices.forEach(spice => {
            spice.taste_profile.forEach(profile => {
                profiles[profile] = (profiles[profile] || 0) + 1;
            });
        });
        
        const total = Object.values(profiles).reduce((sum, count) => sum + count, 0);
        const balance = {};
        
        Object.entries(profiles).forEach(([profile, count]) => {
            balance[profile] = Math.round((count / total) * 100);
        });
        
        return balance;
    }

    analyzeHealthBenefits(spices, products) {
        const benefits = [];
        
        spices.forEach(spice => {
            if (spice.chemical_compounds.phenolic_compounds && spice.chemical_compounds.phenolic_compounds.length > 0) {
                benefits.push(`${spice.name}: антиоксидантные свойства`);
            }
            
            if (spice.chemical_compounds.volatile_oils && spice.chemical_compounds.volatile_oils.includes('эвгенол')) {
                benefits.push(`${spice.name}: антибактериальное действие`);
            }
        });
        
        return benefits.slice(0, 5);
    }

    getSpiceRecommendations(productIds, cookingMethodIds) {
        const selectedProducts = this.products.filter(p => productIds.includes(p.id));
        const selectedMethods = this.cookingMethods.filter(m => cookingMethodIds.includes(m.id));
        
        const recommendedSpices = new Set();
        
        selectedProducts.forEach(product => {
            if (product.compatible_spices) {
                product.compatible_spices.forEach(spiceId => {
                    recommendedSpices.add(spiceId);
                });
            }
        });
        
        selectedMethods.forEach(method => {
            if (method.compatible_spices) {
                method.compatible_spices.forEach(spiceId => {
                    recommendedSpices.add(spiceId);
                });
            }
        });
        
        return Array.from(recommendedSpices)
            .map(id => this.spices.find(s => s.id === id))
            .filter(Boolean)
            .slice(0, 10);
    }

    clearCache() {
        this.cache.clear();
    }
}

window.CompatibilitySystem = CompatibilitySystem;