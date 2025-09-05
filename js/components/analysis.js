class AnalysisEngine {
    constructor() {
        this.compatibilityChecker = new CompatibilityChecker();
    }
    
    async analyze(productIds, methodIds, spiceIds) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const analysis = {
                    compatibility: this.analyzeCompatibility(productIds, methodIds, spiceIds),
                    compounds: this.analyzeCompounds(spiceIds),
                    synergies: this.analyzeSynergies(spiceIds),
                    recommendations: this.generateRecommendations(productIds, methodIds, spiceIds),
                    score: this.calculateCompatibilityScore(productIds, methodIds, spiceIds)
                };
                
                resolve(analysis);
            }, 1500);
        });
    }
    
    analyzeCompatibility(productIds, methodIds, spiceIds) {
        const products = productIds.map(id => window.PRODUCTS_DATA.find(p => p.id === id));
        const methods = methodIds.map(id => window.COOKING_METHODS_DATA.find(m => m.id === id));
        const spices = spiceIds.map(id => window.SPICES_DATA.find(s => s.id === id));
        
        return {
            productSpiceCompatibility: this.checkProductSpiceCompatibility(products, spices),
            methodSpiceCompatibility: this.checkMethodSpiceCompatibility(methods, spices),
            spiceSpiceCompatibility: this.checkSpiceSpiceCompatibility(spices),
            overallCompatibility: this.calculateOverallCompatibility(products, methods, spices)
        };
    }
    
    analyzeCompounds(spiceIds) {
        const compounds = new Map();
        const spices = spiceIds.map(id => window.SPICES_DATA.find(s => s.id === id));
        
        spices.forEach(spice => {
            if (spice.chemical_compounds) {
                Object.entries(spice.chemical_compounds).forEach(([type, compoundList]) => {
                    if (Array.isArray(compoundList)) {
                        compoundList.forEach(compound => {
                            if (!compounds.has(compound)) {
                                compounds.set(compound, {
                                    name: compound,
                                    type: type,
                                    spices: [],
                                    count: 0
                                });
                            }
                            
                            const compoundData = compounds.get(compound);
                            compoundData.spices.push(spice.name);
                            compoundData.count++;
                        });
                    }
                });
            }
        });
        
        return Array.from(compounds.values()).sort((a, b) => b.count - a.count);
    }
    
    analyzeSynergies(spiceIds) {
        const spices = spiceIds.map(id => window.SPICES_DATA.find(s => s.id === id));
        const synergies = [];
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const synergy = this.checkSpiceSynergy(spices[i], spices[j]);
                if (synergy.strength > 0) {
                    synergies.push({
                        spice1: spices[i],
                        spice2: spices[j],
                        ...synergy
                    });
                }
            }
        }
        
        return synergies.sort((a, b) => b.strength - a.strength);
    }
    
    checkSpiceSynergy(spice1, spice2) {
        let strength = 0;
        const reasons = [];
        
        if (spice1.category === spice2.category) {
            strength += 0.3;
            reasons.push('Одинаковая категория');
        }
        
        const commonCompounds = this.findCommonCompounds(spice1, spice2);
        if (commonCompounds.length > 0) {
            strength += commonCompounds.length * 0.2;
            reasons.push(`Общие соединения: ${commonCompounds.join(', ')}`);
        }
        
        const complementaryProfiles = this.checkComplementaryProfiles(spice1, spice2);
        if (complementaryProfiles) {
            strength += 0.4;
            reasons.push('Дополняющие вкусовые профили');
        }
        
        return { strength, reasons };
    }
    
    findCommonCompounds(spice1, spice2) {
        const compounds1 = this.getAllCompounds(spice1);
        const compounds2 = this.getAllCompounds(spice2);
        
        return compounds1.filter(compound => compounds2.includes(compound));
    }
    
    getAllCompounds(spice) {
        const allCompounds = [];
        
        if (spice.chemical_compounds) {
            Object.values(spice.chemical_compounds).forEach(compounds => {
                if (Array.isArray(compounds)) {
                    allCompounds.push(...compounds);
                }
            });
        }
        
        return allCompounds;
    }
    
    checkComplementaryProfiles(spice1, spice2) {
        const complementaryPairs = [
            ['сладкий', 'острый'],
            ['кислый', 'сладкий'],
            ['горьковатый', 'сладкий'],
            ['землистый', 'цитрусовый'],
            ['ароматный', 'пряный']
        ];
        
        const profile1 = spice1.taste_profile || [];
        const profile2 = spice2.taste_profile || [];
        
        return complementaryPairs.some(([taste1, taste2]) => 
            (profile1.includes(taste1) && profile2.includes(taste2)) ||
            (profile1.includes(taste2) && profile2.includes(taste1))
        );
    }
    
    checkProductSpiceCompatibility(products, spices) {
        const compatibility = [];
        
        products.forEach(product => {
            spices.forEach(spice => {
                const isCompatible = this.isSpiceCompatibleWithProduct(spice, product);
                compatibility.push({
                    product: product.name,
                    spice: spice.name,
                    compatible: isCompatible,
                    reason: this.getProductSpiceCompatibilityReason(spice, product, isCompatible)
                });
            });
        });
        
        return compatibility;
    }
    
    checkMethodSpiceCompatibility(methods, spices) {
        const compatibility = [];
        
        methods.forEach(method => {
            spices.forEach(spice => {
                const isCompatible = spice.compatible_methods && 
                                   spice.compatible_methods.includes(method.id);
                compatibility.push({
                    method: method.name,
                    spice: spice.name,
                    compatible: isCompatible,
                    reason: this.getMethodSpiceCompatibilityReason(spice, method, isCompatible)
                });
            });
        });
        
        return compatibility;
    }
    
    checkSpiceSpiceCompatibility(spices) {
        const compatibility = [];
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const spice1 = spices[i];
                const spice2 = spices[j];
                
                const isIncompatible = spice1.incompatible_spices && 
                                     spice1.incompatible_spices.includes(spice2.id);
                
                compatibility.push({
                    spice1: spice1.name,
                    spice2: spice2.name,
                    compatible: !isIncompatible,
                    reason: isIncompatible ? 'Несовместимые специи' : 'Совместимые специи'
                });
            }
        }
        
        return compatibility;
    }
    
    isSpiceCompatibleWithProduct(spice, product) {
        if (!spice.best_products) return true;
        
        return spice.best_products.some(bestProduct => {
            const productName = product.name.toLowerCase();
            const productCategory = product.category.toLowerCase();
            const bestProductLower = bestProduct.toLowerCase();
            
            return bestProductLower === productName ||
                   bestProductLower === productCategory ||
                   (bestProductLower === 'мясо' && ['птица', 'мясо'].includes(productCategory)) ||
                   (bestProductLower === 'рыба' && ['рыба', 'морепродукты'].includes(productCategory));
        });
    }
    
    getProductSpiceCompatibilityReason(spice, product, isCompatible) {
        if (isCompatible) {
            return `${spice.name} хорошо сочетается с ${product.category}`;
        } else {
            return `${spice.name} не рекомендуется для ${product.category}`;
        }
    }
    
    getMethodSpiceCompatibilityReason(spice, method, isCompatible) {
        if (isCompatible) {
            return `${spice.name} подходит для ${method.name.toLowerCase()}`;
        } else {
            return `${spice.name} может потерять свойства при ${method.name.toLowerCase()}`;
        }
    }
    
    calculateOverallCompatibility(products, methods, spices) {
        let score = 0;
        let maxScore = 0;
        
        products.forEach(product => {
            spices.forEach(spice => {
                maxScore++;
                if (this.isSpiceCompatibleWithProduct(spice, product)) {
                    score++;
                }
            });
        });
        
        methods.forEach(method => {
            spices.forEach(spice => {
                maxScore++;
                if (spice.compatible_methods && spice.compatible_methods.includes(method.id)) {
                    score++;
                }
            });
        });
        
        return maxScore > 0 ? (score / maxScore) * 100 : 0;
    }
    
    generateRecommendations(productIds, methodIds, spiceIds) {
        const recommendations = [];
        
        const compatibleSpices = this.compatibilityChecker.getCompatibleSpices(
            productIds, methodIds, spiceIds
        );
        
        if (compatibleSpices.compatible.length > 0) {
            const suggestedSpices = compatibleSpices.compatible
                .filter(id => !spiceIds.includes(id))
                .slice(0, 3)
                .map(id => window.SPICES_DATA.find(s => s.id === id))
                .filter(Boolean);
            
            if (suggestedSpices.length > 0) {
                recommendations.push({
                    type: 'addition',
                    title: 'Рекомендуемые добавления',
                    items: suggestedSpices.map(spice => ({
                        name: spice.name,
                        reason: `Хорошо дополнит выбранную смесь`
                    }))
                });
            }
        }
        
        return recommendations;
    }
    
    calculateCompatibilityScore(productIds, methodIds, spiceIds) {
        const products = productIds.map(id => window.PRODUCTS_DATA.find(p => p.id === id));
        const methods = methodIds.map(id => window.COOKING_METHODS_DATA.find(m => m.id === id));
        const spices = spiceIds.map(id => window.SPICES_DATA.find(s => s.id === id));
        
        return this.calculateOverallCompatibility(products, methods, spices);
    }
}