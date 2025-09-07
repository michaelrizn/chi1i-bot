class ComprehensiveAnalyzer {
    constructor() {
        this.compatibilityAnalyzer = new CompatibilityAnalyzer();
        this.detailedAnalysis = new DetailedAnalysis();
        this.spiceMixtureAnalysis = new SpiceMixtureAnalysis();
    }
    
    generateCompleteAnalysis(productIds, methodIds, spiceIds, data) {
        const analysis = {
            overview: this.generateOverview(productIds, methodIds, spiceIds, data),
            compatibility: this.analyzeCompatibility(productIds, methodIds, spiceIds, data),
            spiceMixtures: this.analyzeSpiceMixtures(spiceIds, data),
            cookingProcess: this.analyzeCookingProcess(productIds, methodIds, spiceIds, data),
            chemicalReactions: this.analyzeChemicalReactions(productIds, methodIds, spiceIds, data),
            recommendations: this.generateComprehensiveRecommendations(productIds, methodIds, spiceIds, data),
            scientificBasis: this.generateScientificBasis(productIds, methodIds, spiceIds, data)
        };
        
        return analysis;
    }
    
    generateOverview(productIds, methodIds, spiceIds, data) {
        const products = productIds.map(id => data.products.find(p => p.id === id)).filter(Boolean);
        const methods = methodIds.map(id => data.methods.find(m => m.id === id)).filter(Boolean);
        const spices = spiceIds.map(id => data.spices.find(s => s.id === id)).filter(Boolean);
        
        if (products.length === 0 && methods.length === 0 && spices.length === 0) {
            return {
                title: 'Анализ сочетаний',
            description: 'Выберите продукты, методы приготовления и специи для получения детального анализа их совместимости и взаимодействий.',
                complexity: 'none'
            };
        }
        
        const complexity = this.calculateComplexity(products, methods, spices);
        const flavorProfile = this.generateFlavorProfile(spices);
        const cuisineStyle = this.determineCuisineStyle(products, methods, spices);
        
        return {
            title: this.generateOverviewTitle(products, methods, spices),
            description: this.generateOverviewDescription(products, methods, spices, flavorProfile, cuisineStyle),
            complexity: complexity,
            flavorProfile: flavorProfile,
            cuisineStyle: cuisineStyle,
            estimatedTime: this.estimateCookingTime(methods, spices),
            difficulty: this.assessDifficulty(methods, spices)
        };
    }
    
    generateOverviewTitle(products, methods, spices) {
        const parts = [];
        
        if (products.length > 0) {
            parts.push(products.map(p => p.name).join(', '));
        }
        
        if (methods.length > 0) {
            const methodNames = methods.map(m => m.name).join(', ');
            parts.push(`приготовленные методом: ${methodNames}`);
        }
        
        if (spices.length > 0) {
            const spiceNames = spices.slice(0, 3).map(s => s.name).join(', ');
            const additional = spices.length > 3 ? ` и еще ${spices.length - 3}` : '';
            parts.push(`со специями: ${spiceNames}${additional}`);
        }
        
        return parts.join(' ') || 'Анализ сочетаний';
    }
    
    generateOverviewDescription(products, methods, spices, flavorProfile, cuisineStyle) {
        const descriptions = [];
        
        if (cuisineStyle) {
            descriptions.push(`Это сочетание характерно для ${cuisineStyle} кухни`);
        }
        
        if (flavorProfile.dominant.length > 0) {
            descriptions.push(`Доминирующие вкусы: ${flavorProfile.dominant.join(', ')}.`);
        }
        
        if (spices.length >= 2) {
            const synergies = this.findFlavorSynergies(spices);
            if (synergies.length > 0) {
                descriptions.push(`Специи создают синергетические эффекты: ${synergies.join(', ')}.`);
            }
        }
        
        if (methods.length > 0 && spices.length > 0) {
            const methodSpiceInteraction = this.analyzeMethodSpiceInteraction(methods, spices);
            if (methodSpiceInteraction) {
                descriptions.push(methodSpiceInteraction);
            }
        }
        
        return descriptions.join(' ') || 'Выберите продукты, методы приготовления и специи для получения детального анализа их совместимости и взаимодействий.';
    }
    
    calculateComplexity(products, methods, spices) {
        let score = 0;
        
        score += products.length * 1;
        score += methods.length * 2;
        score += spices.length * 1.5;
        
        const highIntensitySpices = spices.filter(s => s.intensity >= 7).length;
        score += highIntensitySpices * 2;
        
        const complexMethods = methods.filter(m => m.difficulty >= 3).length;
        score += complexMethods * 3;
        
        if (score <= 3) return 'simple';
        if (score <= 8) return 'medium';
        if (score <= 15) return 'complex';
        return 'expert';
    }
    
    generateFlavorProfile(spices) {
        const profiles = {
            sweet: 0, sour: 0, bitter: 0, salty: 0, umami: 0,
            spicy: 0, aromatic: 0, earthy: 0, citrus: 0, herbal: 0
        };
        
        spices.forEach(spice => {
            if (spice.profile) {
                spice.profile.forEach(profile => {
                    if (profiles.hasOwnProperty(profile)) {
                        profiles[profile] += spice.intensity || 1;
                    }
                });
            }
        });
        
        const sortedProfiles = Object.entries(profiles)
            .filter(([_, value]) => value > 0)
            .sort(([_, a], [__, b]) => b - a);
        
        return {
            dominant: sortedProfiles.slice(0, 3).map(([profile, _]) => profile),
            secondary: sortedProfiles.slice(3, 6).map(([profile, _]) => profile),
            balance: this.assessFlavorBalance(sortedProfiles)
        };
    }
    
    assessFlavorBalance(sortedProfiles) {
        if (sortedProfiles.length === 0) return 'neutral';
        
        const topScore = sortedProfiles[0][1];
        const secondScore = sortedProfiles[1] ? sortedProfiles[1][1] : 0;
        
        if (topScore > secondScore * 2) return 'unbalanced';
        if (sortedProfiles.length >= 4) return 'complex';
        if (sortedProfiles.length >= 2) return 'balanced';
        return 'simple';
    }
    
    determineCuisineStyle(products, methods, spices) {
        const cuisineIndicators = {
            'средиземноморская': ['базилик', 'орегано', 'тимьян', 'розмарин'],
            'азиатская': ['имбирь', 'чеснок', 'соевый соус', 'кунжут'],
            'индийская': ['куркума', 'кориандр', 'кумин', 'кардамон'],
            'мексиканская': ['чили', 'кумин', 'кориандр', 'лайм'],
            'французская': ['тимьян', 'лавровый лист', 'эстрагон', 'петрушка']
        };
        
        const spiceNames = spices.map(s => s.name.toLowerCase());
        let bestMatch = null;
        let bestScore = 0;
        
        Object.entries(cuisineIndicators).forEach(([cuisine, indicators]) => {
            const matches = indicators.filter(indicator => 
                spiceNames.some(spice => spice.includes(indicator))
            ).length;
            
            if (matches > bestScore) {
                bestScore = matches;
                bestMatch = cuisine;
            }
        });
        
        return bestScore >= 2 ? bestMatch : null;
    }
    
    findFlavorSynergies(spices) {
        const synergies = [];
        
        const spiceGroups = {
            'теплые': ['корица', 'гвоздика', 'мускатный орех', 'кардамон'],
            'цитрусовые': ['лимон', 'лайм', 'апельсин', 'бергамот'],
            'острые': ['перец', 'чили', 'имбирь', 'васаби'],
            'травяные': ['базилик', 'орегано', 'тимьян', 'розмарин']
        };
        
        const spiceNames = spices.map(s => s.name.toLowerCase());
        
        Object.entries(spiceGroups).forEach(([group, groupSpices]) => {
            const matches = groupSpices.filter(spice => 
                spiceNames.some(selected => selected.includes(spice))
            );
            
            if (matches.length >= 2) {
                synergies.push(`${group} теплые специи создают гармоничное сочетание`);
            }
        });
        
        return synergies;
    }
    
    estimateCookingTime(methods, spices) {
        if (methods.length === 0) return 'не определено';
        
        let totalTime = 0;
        methods.forEach(method => {
            if (method.time) {
                totalTime += method.time;
            }
        });
        
        const spicePrep = spices.length * 2;
        return `${totalTime + spicePrep} минут`;
    }
    
    assessDifficulty(methods, spices) {
        let difficulty = 1;
        
        methods.forEach(method => {
            if (method.difficulty) {
                difficulty = Math.max(difficulty, method.difficulty);
            }
        });
        
        if (spices.length > 5) difficulty += 1;
        if (spices.some(s => s.intensity >= 8)) difficulty += 1;
        
        const levels = ['очень легко', 'легко', 'средне', 'сложно', 'очень сложно'];
        return levels[Math.min(difficulty - 1, levels.length - 1)];
    }
    
    analyzeMethodSpiceInteraction(methods, spices) {
        if (methods.length === 0 || spices.length === 0) return null;
        
        const highHeatMethods = methods.filter(m => m.temperature && m.temperature > 150);
        const delicateSpices = spices.filter(s => s.heat_sensitive);
        
        if (highHeatMethods.length > 0 && delicateSpices.length > 0) {
            return 'Некоторые специи могут потерять аромат при высокой температуре - добавляйте их в конце приготовления.';
        }
        
        return 'Выбранные методы приготовления хорошо сочетаются со специями.';
    }
    
    analyzeCompatibility(productIds, methodIds, spiceIds, data) {
        return this.compatibilityAnalyzer.analyzeSelection(productIds, methodIds, spiceIds, data);
    }
    
    analyzeSpiceMixtures(spiceIds, data) {
        if (spiceIds.length < 2) return null;
        if (this.spiceMixtureAnalysis && this.spiceMixtureAnalysis.analyzeMixture) {
            return this.spiceMixtureAnalysis.analyzeMixture(spiceIds, data);
        }
        return null;
    }
    
    analyzeCookingProcess(productIds, methodIds, spiceIds, data) {
        return this.compatibilityAnalyzer.analyzeCookingProcesses(methodIds, spiceIds, data);
    }
    
    analyzeChemicalReactions(productIds, methodIds, spiceIds, data) {
        return this.compatibilityAnalyzer.analyzeChemicalReactions(spiceIds, data);
    }
    
    generateComprehensiveRecommendations(productIds, methodIds, spiceIds, data) {
        return this.compatibilityAnalyzer.generateRecommendations(productIds, methodIds, spiceIds, data);
    }
    
    generateScientificBasis(productIds, methodIds, spiceIds, data) {
        const products = productIds.map(id => data.products.find(p => p.id === id)).filter(Boolean);
        const methods = methodIds.map(id => data.methods.find(m => m.id === id)).filter(Boolean);
        const spices = spiceIds.map(id => data.spices.find(s => s.id === id)).filter(Boolean);
        
        if (spices.length === 0) return null;
        
        const scientificBasis = {
            chemicalCompounds: this.analyzeChemicalCompounds(spices),
            flavorChemistry: this.analyzeFlavorChemistry(spices),
            nutritionalAspects: this.analyzeNutritionalAspects(products, spices),
            preservationEffects: this.analyzePreservationScience(methods, spices),
            bioavailability: this.analyzeBioavailability(products, spices)
        };
        
        return scientificBasis;
    }
    
    analyzeChemicalCompounds(spices) {
        const compounds = {};
        
        spices.forEach(spice => {
            if (spice.chemical_compounds) {
                const allCompounds = [
                    ...(spice.chemical_compounds.volatile_oils || []),
                    ...(spice.chemical_compounds.phenolic_compounds || []),
                    ...(spice.chemical_compounds.alkaloids || [])
                ];
                
                allCompounds.forEach(compoundName => {
                    if (!compounds[compoundName]) {
                        compounds[compoundName] = {
                            sources: [],
                            properties: [],
                            effects: []
                        };
                    }
                    compounds[compoundName].sources.push(spice.name);
                });
            }
        });
        
        return Object.entries(compounds).map(([name, data]) => ({
            name,
            sources: data.sources,
            properties: data.properties,
            effects: data.effects,
            synergy: data.sources.length > 1
        }));
    }
    
    analyzeFlavorChemistry(spices) {
        const interactions = [];
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const spice1 = spices[i];
                const spice2 = spices[j];
                
                const interaction = this.findChemicalInteraction(spice1, spice2);
                if (interaction) {
                    interactions.push(interaction);
                }
            }
        }
        
        return interactions;
    }
    
    findChemicalInteraction(spice1, spice2) {
        if (!spice1.chemical_compounds || !spice2.chemical_compounds) return null;
        
        const compounds1 = [
            ...(spice1.chemical_compounds.volatile_oils || []),
            ...(spice1.chemical_compounds.phenolic_compounds || []),
            ...(spice1.chemical_compounds.alkaloids || [])
        ];
        
        const compounds2 = [
            ...(spice2.chemical_compounds.volatile_oils || []),
            ...(spice2.chemical_compounds.phenolic_compounds || []),
            ...(spice2.chemical_compounds.alkaloids || [])
        ];
        
        const commonCompounds = compounds1.filter(c1 => compounds2.includes(c1));
        
        if (commonCompounds.length > 0) {
            return {
                spices: [spice1.name, spice2.name],
                type: 'synergy',
                compounds: commonCompounds,
                effect: 'Усиление общих ароматических соединений'
            };
        }
        
        const complementaryCompounds = this.findComplementaryCompounds(spice1.taste_profile, spice2.taste_profile);
        if (complementaryCompounds) {
            return {
                spices: [spice1.name, spice2.name],
                type: 'complementary',
                compounds: complementaryCompounds,
                effect: 'Создание сложного вкусового профиля'
            };
        }
        
        return null;
    }
    
    findComplementaryCompounds(profile1, profile2) {
        if (!profile1 || !profile2) return null;
        
        const complementaryPairs = [
            ['сладкий', 'горьковатый'],
            ['кислый', 'сладкий'],
            ['острый', 'охлаждающий'],
            ['земляной', 'цитрусовый'],
            ['ароматный', 'пряный'],
            ['смолистый', 'свежий']
        ];
        
        for (const [taste1, taste2] of complementaryPairs) {
            if (profile1.includes(taste1) && profile2.includes(taste2)) {
                return [taste1, taste2];
            }
            if (profile1.includes(taste2) && profile2.includes(taste1)) {
                return [taste2, taste1];
            }
        }
        
        return null;
    }
    
    analyzeNutritionalAspects(products, spices) {
        const aspects = [];
        
        const antioxidantSpices = spices.filter(s => s.chemical_compounds && 
            (s.chemical_compounds.phenolic_compounds && s.chemical_compounds.phenolic_compounds.length > 0));
        
        if (antioxidantSpices.length > 0) {
            aspects.push({
                type: 'antioxidant',
                spices: antioxidantSpices.map(s => s.name),
                benefit: 'Защита от окислительного стресса и улучшение сохранности продуктов'
            });
        }
        
        const antiInflammatorySpices = spices.filter(s => s.chemical_compounds && 
            (s.chemical_compounds.volatile_oils && s.chemical_compounds.volatile_oils.some(oil => 
                ['эвгенол', 'куркумин', 'гингерол'].includes(oil))));
        
        if (antiInflammatorySpices.length > 0) {
            aspects.push({
                type: 'anti-inflammatory',
                spices: antiInflammatorySpices.map(s => s.name),
                benefit: 'Противовоспалительное действие'
            });
        }
        
        return aspects;
    }
    
    analyzePreservationScience(methods, spices) {
        const preservativeSpices = spices.filter(s => s.chemical_compounds && 
            (s.chemical_compounds.volatile_oils && s.chemical_compounds.volatile_oils.some(oil => 
                ['тимол', 'карвакрол', 'эвгенол', 'цинеол'].includes(oil))));
        
        if (preservativeSpices.length === 0) return null;
        
        return {
            spices: preservativeSpices.map(s => s.name),
            mechanism: 'Антимикробные соединения подавляют рост бактерий и грибков',
            effectiveness: this.calculatePreservationEffectiveness(preservativeSpices, methods)
        };
    }
    
    calculatePreservationEffectiveness(preservativeSpices, methods) {
        let effectiveness = preservativeSpices.length * 20;
        
        const highTempMethods = methods.filter(m => m.temperature && m.temperature > 150);
        if (highTempMethods.length > 0) {
            effectiveness += 30;
        }
        
        return Math.min(effectiveness, 100);
    }
    
    analyzeBioavailability(products, spices) {
        const enhancers = spices.filter(s => s.chemical_compounds && 
            (s.chemical_compounds.volatile_oils && s.chemical_compounds.volatile_oils.some(oil => 
                ['пиперин', 'куркумин', 'гингерол'].includes(oil))));
        
        if (enhancers.length === 0) return null;
        
        return {
            enhancers: enhancers.map(s => s.name),
            mechanism: 'Улучшение всасывания питательных веществ в кишечнике',
            targetNutrients: ['жирорастворимые витамины', 'минералы', 'антиоксиданты']
        };
    }
}