class CompatibilityChecker {
    constructor() {
        this.cache = new Map();
    }
    
    getCompatibleSpices(selectedProducts, selectedMethods, selectedSpices) {
        const cacheKey = `${selectedProducts.join(',')}-${selectedMethods.join(',')}-${selectedSpices.join(',')}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const result = {
            compatible: [],
            incompatible: [],
            neutral: []
        };
        
        window.SPICES_DATA.forEach(spice => {
            const compatibility = this.checkSpiceCompatibility(
                spice, 
                selectedProducts, 
                selectedMethods, 
                selectedSpices
            );
            
            if (compatibility.isIncompatible) {
                result.incompatible.push(spice.id);
            } else if (compatibility.isHighlyCompatible) {
                result.compatible.push(spice.id);
            } else {
                result.neutral.push(spice.id);
            }
        });
        
        this.cache.set(cacheKey, result);
        return result;
    }
    
    checkSpiceCompatibility(spice, selectedProducts, selectedMethods, selectedSpices) {
        let isIncompatible = false;
        let isHighlyCompatible = false;
        let compatibilityScore = 0;
        const reasons = [];
        
        if (selectedProducts.length > 0) {
            const productCompatibility = this.checkProductCompatibility(spice, selectedProducts);
            if (!productCompatibility.compatible) {
                isIncompatible = true;
                reasons.push(productCompatibility.reason);
            } else if (productCompatibility.score > 0.8) {
                isHighlyCompatible = true;
                compatibilityScore += productCompatibility.score;
            }
        }
        
        if (selectedMethods.length > 0 && !isIncompatible) {
            const methodCompatibility = this.checkMethodCompatibility(spice, selectedMethods);
            if (!methodCompatibility.compatible) {
                isIncompatible = true;
                reasons.push(methodCompatibility.reason);
            } else {
                compatibilityScore += methodCompatibility.score;
            }
        }
        
        if (selectedSpices.length > 0 && !isIncompatible) {
            const spiceCompatibility = this.checkSpiceSpiceCompatibility(spice, selectedSpices);
            if (!spiceCompatibility.compatible) {
                isIncompatible = true;
                reasons.push(spiceCompatibility.reason);
            } else {
                compatibilityScore += spiceCompatibility.score;
            }
        }
        
        return {
            isIncompatible,
            isHighlyCompatible: isHighlyCompatible || compatibilityScore > 1.5,
            score: compatibilityScore,
            reasons
        };
    }
    
    checkProductCompatibility(spice, selectedProducts) {
        if (!spice.best_products || spice.best_products.length === 0) {
            return { compatible: true, score: 0.5, reason: 'Универсальная специя' };
        }
        
        const products = selectedProducts.map(id => 
            window.PRODUCTS_DATA.find(p => p.id === id)
        ).filter(Boolean);
        
        let compatibleCount = 0;
        let totalProducts = products.length;
        
        products.forEach(product => {
            const isCompatible = spice.best_products.some(bestProduct => {
                const productName = product.name.toLowerCase();
                const productCategory = product.category.toLowerCase();
                const bestProductLower = bestProduct.toLowerCase();
                
                return bestProductLower === productName ||
                       bestProductLower === productCategory ||
                       this.checkCategoryMatch(bestProductLower, productCategory);
            });
            
            if (isCompatible) {
                compatibleCount++;
            }
        });
        
        const score = compatibleCount / totalProducts;
        const compatible = score > 0;
        
        return {
            compatible,
            score,
            reason: compatible ? 
                `Подходит для ${compatibleCount} из ${totalProducts} выбранных продуктов` :
                'Не подходит для выбранных продуктов'
        };
    }
    
    checkMethodCompatibility(spice, selectedMethods) {
        if (!spice.compatible_methods || spice.compatible_methods.length === 0) {
            return { compatible: true, score: 0.5, reason: 'Универсальная для всех методов' };
        }
        
        let compatibleCount = 0;
        let totalMethods = selectedMethods.length;
        
        selectedMethods.forEach(methodId => {
            if (spice.compatible_methods.includes(methodId)) {
                compatibleCount++;
            }
        });
        
        const score = compatibleCount / totalMethods;
        const compatible = score > 0;
        
        return {
            compatible,
            score,
            reason: compatible ?
                `Подходит для ${compatibleCount} из ${totalMethods} выбранных методов` :
                'Не подходит для выбранных методов приготовления'
        };
    }
    
    checkSpiceSpiceCompatibility(spice, selectedSpices) {
        if (!spice.incompatible_spices || spice.incompatible_spices.length === 0) {
            return { compatible: true, score: 1, reason: 'Совместима с другими специями' };
        }
        
        const hasIncompatible = selectedSpices.some(selectedSpiceId => 
            spice.incompatible_spices.includes(selectedSpiceId)
        );
        
        if (hasIncompatible) {
            const incompatibleSpices = selectedSpices
                .filter(id => spice.incompatible_spices.includes(id))
                .map(id => window.SPICES_DATA.find(s => s.id === id))
                .filter(Boolean)
                .map(s => s.name);
            
            return {
                compatible: false,
                score: 0,
                reason: `Несовместима с: ${incompatibleSpices.join(', ')}`
            };
        }
        
        const synergyScore = this.calculateSpiceSynergy(spice, selectedSpices);
        
        return {
            compatible: true,
            score: 1 + synergyScore,
            reason: synergyScore > 0.5 ? 'Отлично дополняет выбранные специи' : 'Совместима с выбранными специями'
        };
    }
    
    calculateSpiceSynergy(spice, selectedSpices) {
        let synergyScore = 0;
        
        const selectedSpiceObjects = selectedSpices
            .map(id => window.SPICES_DATA.find(s => s.id === id))
            .filter(Boolean);
        
        selectedSpiceObjects.forEach(selectedSpice => {
            if (spice.category === selectedSpice.category) {
                synergyScore += 0.2;
            }
            
            const commonCompounds = this.findCommonChemicalCompounds(spice, selectedSpice);
            synergyScore += commonCompounds.length * 0.1;
            
            const complementaryTastes = this.checkComplementaryTastes(spice, selectedSpice);
            if (complementaryTastes) {
                synergyScore += 0.3;
            }
        });
        
        return Math.min(synergyScore, 1);
    }
    
    findCommonChemicalCompounds(spice1, spice2) {
        const compounds1 = this.extractAllCompounds(spice1);
        const compounds2 = this.extractAllCompounds(spice2);
        
        return compounds1.filter(compound => compounds2.includes(compound));
    }
    
    extractAllCompounds(spice) {
        const allCompounds = [];
        
        if (spice.chemical_compounds) {
            Object.values(spice.chemical_compounds).forEach(compounds => {
                if (Array.isArray(compounds)) {
                    allCompounds.push(...compounds);
                } else if (typeof compounds === 'string') {
                    allCompounds.push(compounds);
                }
            });
        }
        
        return allCompounds;
    }
    
    checkComplementaryTastes(spice1, spice2) {
        const complementaryPairs = [
            ['сладкий', 'острый'],
            ['кислый', 'сладкий'],
            ['горьковатый', 'сладкий'],
            ['землистый', 'цитрусовый'],
            ['ароматный', 'пряный'],
            ['свежий', 'пряный']
        ];
        
        const profile1 = spice1.taste_profile || [];
        const profile2 = spice2.taste_profile || [];
        
        return complementaryPairs.some(([taste1, taste2]) => 
            (profile1.includes(taste1) && profile2.includes(taste2)) ||
            (profile1.includes(taste2) && profile2.includes(taste1))
        );
    }
    
    checkCategoryMatch(bestProduct, productCategory) {
        const categoryMappings = {
            'мясо': ['птица', 'мясо'],
            'рыба': ['рыба', 'морепродукты'],
            'птица': ['птица'],
            'овощи': ['овощи'],
            'молочные': ['молочные'],
            'крупы': ['крупы'],
            'десерты': ['десерты', 'фрукты']
        };
        
        const mappedCategories = categoryMappings[bestProduct] || [bestProduct];
        return mappedCategories.includes(productCategory);
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    getCompatibilityExplanation(spiceId, selectedProducts, selectedMethods, selectedSpices) {
        const spice = window.SPICES_DATA.find(s => s.id === spiceId);
        if (!spice) return null;
        
        const compatibility = this.checkSpiceCompatibility(
            spice, selectedProducts, selectedMethods, selectedSpices
        );
        
        return {
            spice: spice.name,
            compatible: !compatibility.isIncompatible,
            score: compatibility.score,
            reasons: compatibility.reasons,
            recommendation: this.getRecommendation(compatibility)
        };
    }
    
    getRecommendation(compatibility) {
        if (compatibility.isIncompatible) {
            return 'Не рекомендуется';
        } else if (compatibility.isHighlyCompatible) {
            return 'Отлично подходит';
        } else if (compatibility.score > 1) {
            return 'Хорошо подходит';
        } else {
            return 'Подходит';
        }
    }
}