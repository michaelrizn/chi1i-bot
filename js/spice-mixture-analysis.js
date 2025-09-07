class SpiceMixtureAnalysis {
    static identifySpiceMixture(spices) {
        const spiceNames = spices.map(s => s.name.toLowerCase());
        
        const knownMixtures = {
            'прованские_травы': {
                required: ['тимьян', 'розмарин', 'орегано'],
                optional: ['базилик', 'лаванда'],
                name: 'Прованские травы',
                origin: 'Франция, регион Прованс'
            },
            'итальянские_травы': {
                required: ['базилик', 'орегано'],
                optional: ['тимьян', 'розмарин', 'майоран'],
                name: 'Итальянские травы',
                origin: 'Италия'
            },
            'гарам_масала': {
                required: ['кориандр', 'кумин', 'кардамон'],
                optional: ['корица', 'гвоздика', 'черный перец'],
                name: 'Гарам масала',
                origin: 'Индия'
            },
            'карри': {
                required: ['куркума', 'кориандр', 'кумин'],
                optional: ['имбирь', 'чеснок', 'красный перец'],
                name: 'Карри',
                origin: 'Индия'
            },
            'китайские_пять_специй': {
                required: ['звездчатый анис', 'корица', 'фенхель'],
                optional: ['гвоздика', 'сычуаньский перец'],
                name: 'Китайские пять специй',
                origin: 'Китай'
            }
        };
        
        for (const [key, mixture] of Object.entries(knownMixtures)) {
            const hasRequired = mixture.required.every(req => 
                spiceNames.some(name => name.includes(req) || req.includes(name))
            );
            
            if (hasRequired) {
                return {
                    name: mixture.name,
                    origin: mixture.origin,
                    composition: this.analyzeMixtureComposition(spices, mixture),
                    synergy_explanation: this.getMixtureSynergyExplanation(mixture.name),
                    chemical_interactions: this.getMixtureChemicalInteractions(spices),
                    flavor_profile: this.getMixtureFlavorProfile(spices),
                    best_applications: this.getMixtureBestApplications(mixture.name),
                    preparation_tips: this.getMixturePreparationTips(mixture.name)
                };
            }
        }
        
        if (spices.length >= 3) {
            return {
                name: 'Авторская смесь специй',
                origin: 'Пользовательская комбинация',
                composition: this.analyzeCustomMixtureComposition(spices),
                synergy_explanation: this.getCustomMixtureSynergy(spices),
                chemical_interactions: this.getMixtureChemicalInteractions(spices),
                flavor_profile: this.getMixtureFlavorProfile(spices),
                best_applications: this.getCustomMixtureBestApplications(spices),
                preparation_tips: this.getCustomMixturePreparationTips(spices)
            };
        }
        
        return null;
    }
    
    static analyzeMixtureComposition(spices, mixture) {
        const composition = spices.map(spice => {
            const role = this.determineSpiceRoleInMixture(spice, mixture);
            const proportion = this.getRecommendedProportion(spice, mixture);
            return `${spice.name}: ${role} (${proportion})`;
        });
        
        return composition.join('; ');
    }
    
    static analyzeCustomMixtureComposition(spices) {
        const totalIntensity = spices.reduce((sum, spice) => sum + (spice.intensity || 5), 0);
        const avgIntensity = totalIntensity / spices.length;
        
        const composition = spices.map(spice => {
            const intensity = spice.intensity || 5;
            const proportion = Math.round((intensity / totalIntensity) * 100);
            const role = spice.role || 'базовая';
            return `${spice.name}: ${role} специя (${proportion}% от общей интенсивности)`;
        });
        
        return `Средняя интенсивность: ${avgIntensity.toFixed(1)}/10. Состав: ${composition.join('; ')}`;
    }
    
    static getMixtureSynergyExplanation(mixtureName) {
        const explanations = {
            'Прованские травы': 'Фенольные соединения тимьяна, розмарина и орегано создают гармоничный букет с антиоксидантными свойствами. Терпены усиливают друг друга, создавая характерный средиземноморский аромат.',
            'Итальянские травы': 'Эвгенол базилика синергирует с карвакролом орегано, создавая классический итальянский профиль. Летучие масла взаимно усиливают ароматические свойства.',
            'Гарам масала': 'Терпеновые соединения кориандра и кумина создают основу, которую дополняют эфирные масла кардамона. Синергия создает сложный, многослойный вкус.',
            'Карри': 'Куркумин куркумы взаимодействует с пиперином, усиливая биодоступность. Терпены кориандра и кумина создают характерную основу карри.',
            'Китайские пять специй': 'Анетол фенхеля и звездчатого аниса создает сладкую основу, которую балансируют пряные соединения корицы и гвоздики.'
        };
        
        return explanations[mixtureName] || 'Химические соединения специй взаимодействуют, создавая уникальный вкусовой профиль.';
    }
    
    static getCustomMixtureSynergy(spices) {
        const categories = {};
        spices.forEach(spice => {
            const category = spice.category || 'другие';
            if (!categories[category]) categories[category] = [];
            categories[category].push(spice.name);
        });
        
        const categoryCount = Object.keys(categories).length;
        if (categoryCount === 1) {
            return `Все специи из категории "${Object.keys(categories)[0]}" - создают гармоничный, сбалансированный вкус с усилением характерных свойств категории.`;
        } else {
            return `Сочетание ${categoryCount} категорий специй создает сложный, многослойный вкусовой профиль с взаимным усилением ароматических соединений.`;
        }
    }
    
    static getMixtureChemicalInteractions(spices) {
        const allCompounds = [];
        spices.forEach(spice => {
            if (spice.chemical_compounds) {
                if (spice.chemical_compounds.volatile_oils) {
                    allCompounds.push(...spice.chemical_compounds.volatile_oils.map(c => ({compound: c, type: 'летучие масла', spice: spice.name})));
                }
                if (spice.chemical_compounds.phenolic_compounds) {
                    allCompounds.push(...spice.chemical_compounds.phenolic_compounds.map(c => ({compound: c, type: 'фенольные соединения', spice: spice.name})));
                }
            }
        });
        
        const interactions = [];
        const compoundGroups = {};
        
        allCompounds.forEach(item => {
            if (!compoundGroups[item.compound]) {
                compoundGroups[item.compound] = [];
            }
            compoundGroups[item.compound].push(item.spice);
        });
        
        Object.entries(compoundGroups).forEach(([compound, spiceList]) => {
            if (spiceList.length > 1) {
                interactions.push(`${compound} (${spiceList.join(', ')}): синергетическое усиление ароматических свойств`);
            }
        });
        
        return interactions.length > 0 ? interactions.join('; ') : 'Уникальные химические соединения каждой специи создают сложный ароматический букет';
    }
    
    static getMixtureFlavorProfile(spices) {
        const allProfiles = [];
        spices.forEach(spice => {
            if (spice.taste_profile) {
                allProfiles.push(...spice.taste_profile);
            }
        });
        
        const profileCounts = {};
        allProfiles.forEach(profile => {
            profileCounts[profile] = (profileCounts[profile] || 0) + 1;
        });
        
        const dominantProfiles = Object.entries(profileCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([profile, count]) => `${profile} (${count} специи)`);
        
        const avgIntensity = spices.reduce((sum, spice) => sum + (spice.intensity || 5), 0) / spices.length;
        
        return `Доминирующие вкусы: ${dominantProfiles.join(', ')}. Общая интенсивность: ${avgIntensity.toFixed(1)}/10`;
    }
    
    static getMixtureBestApplications(mixtureName) {
        const applications = {
            'Прованские травы': 'жареное мясо, запеченные овощи, рататуй, гриль, маринады для баранины',
            'Итальянские травы': 'паста, пицца, томатные соусы, запеченная рыба, овощи на гриле',
            'Гарам масала': 'карри, тушеное мясо, рис, бобовые, маринады для курицы',
            'Карри': 'овощные карри, курица, рис, чечевица, кокосовые соусы',
            'Китайские пять специй': 'утка, свинина, жареные овощи, маринады, азиатские супы'
        };
        
        return applications[mixtureName] || 'универсальное применение в различных блюдах';
    }
    
    static getCustomMixtureBestApplications(spices) {
        const productMatches = {};
        spices.forEach(spice => {
            if (spice.best_products) {
                spice.best_products.forEach(product => {
                    productMatches[product] = (productMatches[product] || 0) + 1;
                });
            }
        });
        
        const bestProducts = Object.entries(productMatches)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([product]) => product);
        
        return bestProducts.length > 0 ? bestProducts.join(', ') : 'универсальное применение';
    }
    
    static getMixturePreparationTips(mixtureName) {
        const tips = {
            'Прованские травы': 'Смешивайте в равных пропорциях. Добавляйте в начале приготовления для полного раскрытия аромата. Храните в герметичной таре.',
            'Итальянские травы': 'Базилик добавляйте в конце, остальные травы - в процессе готовки. Хорошо сочетается с оливковым маслом.',
            'Гарам масала': 'Обжаривайте целые специи перед измельчением. Добавляйте в конце приготовления для сохранения аромата.',
            'Карри': 'Обжаривайте специи в масле перед добавлением других ингредиентов. Куркуму добавляйте осторожно - может горчить.',
            'Китайские пять специй': 'Используйте умеренно - смесь очень ароматная. Хорошо подходит для маринадов и сухих натираний.'
        };
        
        return tips[mixtureName] || 'Смешивайте специи непосредственно перед использованием для максимального аромата';
    }
    
    static getCustomMixturePreparationTips(spices) {
        const roles = spices.map(s => s.role || 'базовая');
        const hasFinish = roles.includes('финишная');
        const hasBase = roles.includes('базовая');
        const hasAccent = roles.includes('акцентная');
        
        let tips = [];
        
        if (hasBase) {
            tips.push('Базовые специи добавляйте в начале приготовления');
        }
        if (hasAccent) {
            tips.push('Акцентные специи добавляйте в середине процесса');
        }
        if (hasFinish) {
            tips.push('Финишные специи добавляйте в конце или при подаче');
        }
        
        const avgIntensity = spices.reduce((sum, spice) => sum + (spice.intensity || 5), 0) / spices.length;
        if (avgIntensity > 6) {
            tips.push('Используйте умеренно - смесь имеет высокую интенсивность');
        }
        
        return tips.join('. ') || 'Используйте согласно рецепту';
    }
    
    static findIncompatibleSpicePairs(spices) {
        const incompatiblePairs = [];
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const spice1 = spices[i];
                const spice2 = spices[j];
                
                if (spice1.incompatible_spices && spice1.incompatible_spices.includes(spice2.id)) {
                    incompatiblePairs.push({
                        spice1: spice1.name,
                        spice2: spice2.name,
                        conflict_reason: this.getConflictReason(spice1, spice2),
                        chemical_clash: this.getChemicalClash(spice1, spice2),
                        taste_interference: this.getTasteInterference(spice1, spice2),
                        solution: this.getConflictSolution(spice1, spice2)
                    });
                }
            }
        }
        
        return incompatiblePairs;
    }
    
    static getConflictReason(spice1, spice2) {
        const intensity1 = spice1.intensity || 5;
        const intensity2 = spice2.intensity || 5;
        
        if (intensity1 > 7 && intensity2 > 7) {
            return `Обе специи имеют высокую интенсивность (${intensity1} и ${intensity2}), что может создать дисбаланс вкуса`;
        }
        
        return `${spice1.name} и ${spice2.name} имеют конфликтующие вкусовые профили`;
    }
    
    static getChemicalClash(spice1, spice2) {
        return `Активные соединения ${spice1.name} могут подавлять или искажать ароматические свойства ${spice2.name}`;
    }
    
    static getTasteInterference(spice1, spice2) {
        const profile1 = spice1.taste_profile || [];
        const profile2 = spice2.taste_profile || [];
        
        const conflictingProfiles = {
            'сладкий': ['горький', 'острый'],
            'горький': ['сладкий'],
            'острый': ['сладкий', 'деликатный']
        };
        
        for (const p1 of profile1) {
            for (const p2 of profile2) {
                if (conflictingProfiles[p1] && conflictingProfiles[p1].includes(p2)) {
                    return `${p1} вкус ${spice1.name} конфликтует с ${p2} вкусом ${spice2.name}`;
                }
            }
        }
        
        return 'Вкусовые профили создают дисгармонию';
    }
    
    static getConflictSolution(spice1, spice2) {
        return `Используйте ${spice1.name} и ${spice2.name} в разных блюдах или уменьшите количество одной из специй`;
    }
    
    static determineSpiceRoleInMixture(spice, mixture) {
        if (mixture.required.some(req => spice.name.toLowerCase().includes(req))) {
            return 'основная';
        }
        if (mixture.optional && mixture.optional.some(opt => spice.name.toLowerCase().includes(opt))) {
            return 'дополнительная';
        }
        return spice.role || 'базовая';
    }
    
    static getRecommendedProportion(spice, mixture) {
        const intensity = spice.intensity || 5;
        if (intensity > 7) return 'минимально';
        if (intensity < 4) return 'щедро';
        return 'умеренно';
    }

    static analyzeMixture(spiceIds, data) {
        if (!spiceIds || spiceIds.length < 2) return null;
        
        const spices = spiceIds.map(id => data.spices.find(s => s.id === id)).filter(Boolean);
        if (spices.length < 2) return null;
        
        const mixtureAnalysis = this.identifySpiceMixture(spices);
        if (!mixtureAnalysis) return null;
        
        const compatibilityScore = this.calculateMixtureCompatibility(spices);
        const interactions = this.generateMixtureInteractions(spices);
        
        return {
            compatibility: {
                description: mixtureAnalysis.synergy_explanation || 'Специи хорошо сочетаются друг с другом',
                score: compatibilityScore
            },
            interactions: interactions
        };
    }
    
    static calculateMixtureCompatibility(spices) {
        let score = 7;
        
        const incompatiblePairs = this.findIncompatibleSpicePairs(spices);
        score -= incompatiblePairs.length * 2;
        
        const avgIntensity = spices.reduce((sum, spice) => sum + (spice.intensity || 5), 0) / spices.length;
        if (avgIntensity > 8) score -= 1;
        if (avgIntensity < 3) score -= 1;
        
        const categories = new Set(spices.map(s => s.category || 'другие'));
        if (categories.size > 1) score += 1;
        
        return Math.max(1, Math.min(10, score));
    }
    
    static generateMixtureInteractions(spices) {
        const interactions = [];
        
        for (let i = 0; i < spices.length; i++) {
            for (let j = i + 1; j < spices.length; j++) {
                const spice1 = spices[i];
                const spice2 = spices[j];
                
                const interaction = this.analyzeSpiceInteraction(spice1, spice2);
                if (interaction) {
                    interactions.push(interaction);
                }
            }
        }
        
        return interactions.slice(0, 5);
    }
    
    static analyzeSpiceInteraction(spice1, spice2) {
        const profiles1 = spice1.taste_profile || [];
        const profiles2 = spice2.taste_profile || [];
        
        const commonProfiles = profiles1.filter(p => profiles2.includes(p));
        if (commonProfiles.length > 0) {
            return {
                spices: [spice1.name, spice2.name],
                description: `Общие вкусовые ноты (${commonProfiles.join(', ')}) создают гармоничное сочетание`
            };
        }
        
        const complementaryPairs = [
            ['сладкий', 'пряный'],
            ['острый', 'ароматный'],
            ['горький', 'сладкий'],
            ['цитрусовый', 'травяной']
        ];
        
        for (const [profile1, profile2] of complementaryPairs) {
            if (profiles1.includes(profile1) && profiles2.includes(profile2)) {
                return {
                    spices: [spice1.name, spice2.name],
                    description: `${profile1} вкус ${spice1.name} дополняет ${profile2} ноты ${spice2.name}`
                };
            }
            if (profiles1.includes(profile2) && profiles2.includes(profile1)) {
                return {
                    spices: [spice1.name, spice2.name],
                    description: `${profile2} вкус ${spice1.name} дополняет ${profile1} ноты ${spice2.name}`
                };
            }
        }
        
        return {
            spices: [spice1.name, spice2.name],
            description: 'Создают сложный многослойный вкусовой профиль'
        };
    }
}

window.SpiceMixtureAnalysis = SpiceMixtureAnalysis;