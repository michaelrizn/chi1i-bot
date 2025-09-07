class UIManager {
    constructor() {
        this.elements = {
            productsCloud: document.getElementById('products-cloud'),
            methodsCloud: document.getElementById('methods-cloud'),
            spicesCloud: document.getElementById('spices-cloud'),
            selectedSection: document.getElementById('selected-section'),
            explanationsSection: document.getElementById('explanations-section'),
            selectedProducts: document.querySelector('#selected-products .selected-tags'),
            selectedMethods: document.querySelector('#selected-methods .selected-tags'),
            selectedSpices: document.querySelector('#selected-spices .selected-tags'),
            compatibilityContent: document.getElementById('compatibility-content'),
            cookingContent: document.getElementById('cooking-content'),
            chemicalContent: document.getElementById('chemical-content'),
            recommendationsContent: document.getElementById('recommendations-content')
        };
        
        this.categoryMapping = {
            'травы': 'herbs',
            'семена': 'seeds',
            'корнеплоды': 'roots',
            'перцы': 'peppers',
            'цветы': 'flowers',
            'кора': 'bark',
            'ягоды': 'berries',
            'орехи': 'nuts',
            'экзотические': 'exotic',
            'ароматические': 'aromatic'
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {

        
        document.getElementById('reset-all')?.addEventListener('click', () => {
            window.appState.reset();
        });
    }
    
    renderTagClouds(data) {
        this.renderProductsCloud(data.products);
        this.renderMethodsCloud(data.methods);
        this.renderSpicesCloud(data.spices);
    }
    
    renderProductsCloud(products) {
        this.elements.productsCloud.innerHTML = '';
        
        products.forEach(product => {
            const tag = this.createTag(product, 'products');
            this.elements.productsCloud.appendChild(tag);
        });
    }
    
    renderMethodsCloud(methods) {
        this.elements.methodsCloud.innerHTML = '';
        
        methods.forEach(method => {
            const tag = this.createTag(method, 'methods');
            this.elements.methodsCloud.appendChild(tag);
        });
    }
    
    renderSpicesCloud(spices) {
        this.elements.spicesCloud.innerHTML = '';
        
        spices.forEach(spice => {
            const tag = this.createTag(spice, 'spices');
            this.elements.spicesCloud.appendChild(tag);
        });
    }
    
    createTag(item, category) {
        const tag = document.createElement('button');
        tag.className = 'tag';
        tag.dataset.id = item.id;
        tag.dataset.category = category;
        
        tag.textContent = item.name;
        
        if (category === 'spices' && item.category) {
            const englishCategory = this.categoryMapping[item.category] || item.category;
            const cssClass = `spice-${englishCategory}`;
            tag.classList.add(cssClass);
        }
        
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleTagClick(category, item.id, tag);
        });
        
        return tag;
    }
    
    handleTagClick(category, id, tagElement) {
        const state = window.appState.getTagState(category, id);
        
        if (state === 'incompatible' || state === 'mutually-excluded') {
            return;
        }
        
        if (state === 'selected') {
            window.appState.removeTag(category, id);
        } else {
            window.appState.selectTag(category, id);
            tagElement.classList.add('tag-select');
            setTimeout(() => tagElement.classList.remove('tag-select'), 300);
        }
    }
    
    updateTagStates(state) {
        this.updateCategoryTags('products', state);
        this.updateCategoryTags('methods', state);
        this.updateCategoryTags('spices', state);
    }
    
    updateCategoryTags(category, state) {
        const container = this.elements[`${category}Cloud`];
        if (!container) return;
        
        const tags = container.querySelectorAll('.tag');
        
        tags.forEach(tag => {
            const id = parseInt(tag.dataset.id);
            const tagState = window.appState.getTagState(category, id);
            
            tag.className = 'tag';
            
            if (category === 'spices') {
                const spice = window.appState.data.spices.find(s => s.id === id);
                if (spice && spice.category) {
                    const englishCategory = this.categoryMapping[spice.category] || spice.category;
                    tag.classList.add(`spice-${englishCategory}`);
                }
            }
            
            tag.classList.add(tagState);
        });
    }
    
    updateSelectedSection(state) {
        const hasSelections = window.appState.hasSelections();
        
        if (hasSelections) {
            this.elements.selectedSection.classList.remove('hidden');
            this.updateSelectedGroup('products', state.selectedProducts);
            this.updateSelectedGroup('methods', state.selectedMethods);
            this.updateSelectedGroup('spices', state.selectedSpices);
        } else {
            this.elements.selectedSection.classList.add('hidden');
        }
    }
    
    updateSelectedGroup(category, selectedIds) {
        const groupElement = document.getElementById(`selected-${category}`);
        const tagsContainer = groupElement.querySelector('.selected-tags');
        
        if (selectedIds.length > 0) {
            groupElement.classList.add('has-items');
            tagsContainer.innerHTML = '';
            
            selectedIds.forEach(id => {
                const item = window.appState.data[category].find(item => item.id === id);
                if (item) {
                    const tag = this.createSelectedTag(item, category);
                    tagsContainer.appendChild(tag);
                }
            });
        } else {
            groupElement.classList.remove('has-items');
        }
    }
    
    createSelectedTag(item, category) {
        const tag = document.createElement('div');
        tag.className = 'tag selected';
        
        if (category === 'spices' && item.category) {
            const englishCategory = this.categoryMapping[item.category] || item.category;
            tag.classList.add(`spice-${englishCategory}`);
        }
        
        const translatedName = item.name;
        tag.innerHTML = `
            ${translatedName}
            <button class="tag-remove" data-id="${item.id}" data-category="${category}">
                ×
            </button>
        `;
        
        const removeBtn = tag.querySelector('.tag-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.appState.removeTag(category, item.id);
        });
        
        return tag;
    }
    
    updateExplanations(state) {
        const shouldShow = window.appState.shouldShowExplanations();
        console.log('updateExplanations called, shouldShow:', shouldShow, 'selectedSpices:', state.selectedSpices.length);
        
        if (shouldShow) {
            this.elements.explanationsSection.classList.remove('hidden');
            
            const analysis = window.compatibilityAnalyzer.analyzeSelection(
                state.selectedProducts,
                state.selectedMethods,
                state.selectedSpices,
                window.appState.data
            );
            
            this.renderCompatibilityExplanations(analysis.compatibility);
            this.renderCookingProcesses(analysis.cookingProcesses);
            this.renderChemicalReactions(analysis.chemicalReactions);
            this.renderRecommendations(analysis.recommendations);
            
            if (window.spiceAnalyzerApp && window.spiceAnalyzerApp.comprehensiveAnalyzer) {
                console.log('Using comprehensive analyzer');
                const completeAnalysis = window.spiceAnalyzerApp.comprehensiveAnalyzer.generateCompleteAnalysis(
                    state.selectedProducts,
                    state.selectedMethods,
                    state.selectedSpices,
                    window.appState.data
                );
                
                if (completeAnalysis.spiceMixtures) {
                    this.renderSpiceMixtures(completeAnalysis.spiceMixtures);
                    document.querySelector('.explanation-block.spice-mixtures').classList.remove('hidden');
                }
                
                if (completeAnalysis.scientificBasis || state.selectedSpices.length > 0) {
                    console.log('Rendering scientific basis from comprehensive analyzer');
                    this.renderScientificBasis(completeAnalysis.scientificBasis);
                    document.querySelector('.explanation-block.scientific-basis').classList.remove('hidden');
                }
            } else if (state.selectedSpices.length > 0) {
                console.log('Using basic scientific analysis');
                const selectedMethods = window.appState.getSelectedMethods();
                const basicAnalysis = this.generateBasicScientificBasis(state.selectedSpices, selectedMethods);
                console.log('Generated basic analysis:', basicAnalysis);
                this.renderScientificBasis(basicAnalysis);
                const scientificBlock = document.querySelector('.explanation-block.scientific-basis');
                if (scientificBlock) {
                    scientificBlock.classList.remove('hidden');
                    console.log('Scientific basis block shown');
                } else {
                    console.error('Scientific basis block not found!');
                }
            } else {
                console.log('No spices selected, hiding scientific basis');
                document.querySelector('.explanation-block.scientific-basis')?.classList.add('hidden');
            }
        } else {
            this.elements.explanationsSection.classList.add('hidden');
            document.querySelector('.explanation-block.spice-mixtures')?.classList.add('hidden');
            document.querySelector('.explanation-block.scientific-basis')?.classList.add('hidden');
        }
    }
    
    renderCompatibilityExplanations(explanations) {
        this.elements.compatibilityContent.innerHTML = '';
        
        explanations.forEach(explanation => {
            const item = document.createElement('div');
            item.className = 'detailed-explanation';
            
            if (typeof explanation === 'string') {
                item.innerHTML = `
                    <div class="explanation-icon">•</div>
                    <div>${explanation}</div>
                `;
            } else {
                item.innerHTML = `
                    <div class="explanation-header">
                        <div class="explanation-icon">🤝</div>
                        <h4>${explanation.title}</h4>
                    </div>
                    <div class="explanation-details">
                        <div class="detail-section">
                            <strong>Обоснование:</strong> ${explanation.reason}
                        </div>
                        <div class="detail-section">
                            <strong>Химическая основа:</strong> ${explanation.chemical_basis}
                        </div>
                        <div class="detail-section">
                            <strong>Вкусовое взаимодействие:</strong> ${explanation.taste_interaction}
                        </div>
                        <div class="detail-section">
                            <strong>Польза:</strong> ${explanation.nutritional_benefits}
                        </div>
                        ${explanation.recommendation ? `<div class="detail-section recommendation"><strong>Рекомендация:</strong> ${explanation.recommendation}</div>` : ''}
                    </div>
                `;
            }
            
            this.elements.compatibilityContent.appendChild(item);
        });
    }
    
    renderCookingProcesses(processes) {
        this.elements.cookingContent.innerHTML = '';
        
        processes.forEach(process => {
            const item = document.createElement('div');
            item.className = 'detailed-explanation';
            
            if (typeof process === 'string') {
                item.innerHTML = `
                    <div class="explanation-icon">🔥</div>
                    <div>${process}</div>
                `;
            } else {
                item.innerHTML = `
                    <div class="explanation-header">
                        <div class="explanation-icon">🔥</div>
                        <h4>${process.title}</h4>
                    </div>
                    <div class="explanation-details">
                        <div class="detail-section">
                            <strong>Температурный эффект:</strong> ${process.temperature_effect}
                        </div>
                        <div class="detail-section">
                            <strong>Химические изменения:</strong> ${process.chemical_changes}
                        </div>
                        <div class="detail-section">
                            <strong>Развитие аромата:</strong> ${process.aroma_development}
                        </div>
                        <div class="detail-section">
                            <strong>Оптимальное время:</strong> ${process.optimal_timing}
                        </div>
                        <div class="detail-section">
                            <strong>Советы по технике:</strong> ${process.technique_tips}
                        </div>
                    </div>
                `;
            }
            
            this.elements.cookingContent.appendChild(item);
        });
    }
    
    renderChemicalReactions(reactions) {
        this.elements.chemicalContent.innerHTML = '';
        
        reactions.forEach(reaction => {
            const item = document.createElement('div');
            item.className = 'detailed-explanation';
            
            if (reaction.process) {
                item.innerHTML = `
                    <div class="reaction-process">${reaction.process}</div>
                    <div class="reaction-details">
                        <div class="reaction-detail">
                            <span class="reaction-label">Соединения:</span>
                            <span>${reaction.compounds.join(', ')}</span>
                        </div>
                        <div class="reaction-detail">
                            <span class="reaction-label">Температура:</span>
                            <span>${reaction.temperature}</span>
                        </div>
                        <div class="reaction-detail">
                            <span class="reaction-label">Результат:</span>
                            <span>${reaction.result}</span>
                        </div>
                    </div>
                `;
            } else {
                item.innerHTML = `
                    <div class="explanation-header">
                        <div class="explanation-icon">⚗️</div>
                        <h4>${reaction.title}</h4>
                    </div>
                    <div class="explanation-details">
                        ${reaction.common_compounds && reaction.common_compounds.length > 0 ? `
                            <div class="detail-section">
                                <strong>Общие соединения:</strong> ${reaction.common_compounds.join(', ')}
                            </div>
                        ` : ''}
                        ${reaction.synergy_compounds && reaction.synergy_compounds.length > 0 ? `
                            <div class="detail-section">
                                <strong>Синергетические соединения:</strong> ${reaction.synergy_compounds.map(s => `${s.compound1}+${s.compound2}`).join(', ')}
                            </div>
                        ` : ''}
                        <div class="detail-section">
                            <strong>Тип реакции:</strong> ${reaction.reaction_type}
                        </div>
                        <div class="detail-section">
                            <strong>Температурный диапазон:</strong> ${reaction.temperature_range}
                        </div>
                        <div class="detail-section">
                            <strong>Вкусовой результат:</strong> ${reaction.flavor_result}
                        </div>
                        <div class="detail-section">
                            <strong>Молекулярное объяснение:</strong> ${reaction.molecular_explanation}
                        </div>
                    </div>
                `;
            }
            
            this.elements.chemicalContent.appendChild(item);
        });
    }
    
    renderRecommendations(recommendations) {
        this.elements.recommendationsContent.innerHTML = '';
        
        recommendations.forEach(recommendation => {
            const item = document.createElement('div');
            item.className = `recommendation-item ${recommendation.priority || 'medium'}`;
            
            const icon = this.getRecommendationIcon(recommendation.type);
            
            item.innerHTML = `
                <div class="recommendation-header">
                    <div class="recommendation-icon">${icon}</div>
                    <h4>${recommendation.title}</h4>
                </div>
                <div class="recommendation-content">
                    ${recommendation.content}
                </div>
            `;
            
            this.elements.recommendationsContent.appendChild(item);
        });
    }
    
    getRecommendationIcon(type) {
        const icons = {
            'mixture': '🌿',
            'warning': '⚠️',
            'timing': '⏰',
            'temperature': '🌡️',
            'proportion': '⚖️',
            'scientific': '🔬',
            'basic': '💡',
            'advanced': '🎯'
        };
        
        return icons[type] || '💡';
    }
    
    updateCompleteAnalysis(analysis) {
        if (analysis.overview) {
            this.renderOverview(analysis.overview);
        }
        
        if (analysis.spiceMixtures) {
            this.renderSpiceMixtures(analysis.spiceMixtures);
        }
        
        if (analysis.scientificBasis) {
            this.renderScientificBasis(analysis.scientificBasis);
        }
    }
    
    renderOverview(overview) {
        const overviewSection = document.getElementById('overview-section');
        if (!overviewSection) return;
        
        overviewSection.innerHTML = `
            <div class="overview-content">
                <h3>${overview.title}</h3>
                <p>${overview.description}</p>
                <div class="overview-details">
                    <div class="detail-item">
                        <strong>Сложность:</strong> ${this.getComplexityLabel(overview.complexity)}
                    </div>
                    ${overview.cuisineStyle ? `
                        <div class="detail-item">
                            <strong>Стиль кухни:</strong> ${overview.cuisineStyle}
                        </div>
                    ` : ''}
                    ${overview.estimatedTime ? `
                        <div class="detail-item">
                            <strong>Время приготовления:</strong> ${overview.estimatedTime}
                        </div>
                    ` : ''}
                    ${overview.difficulty ? `
                        <div class="detail-item">
                            <strong>Сложность:</strong> ${overview.difficulty}
                        </div>
                    ` : ''}
                </div>
                ${overview.flavorProfile ? `
                    <div class="flavor-profile">
                        <h4>Вкусовой профиль</h4>
                        <div class="flavor-details">
                            <div class="flavor-item">
                                <strong>Доминирующие:</strong> ${overview.flavorProfile.dominant.join(', ')}
                            </div>
                            ${overview.flavorProfile.secondary.length > 0 ? `
                                <div class="flavor-item">
                                    <strong>Вторичные:</strong> ${overview.flavorProfile.secondary.join(', ')}
                                </div>
                            ` : ''}
                            <div class="flavor-item">
                                <strong>Баланс:</strong> ${this.getBalanceLabel(overview.flavorProfile.balance)}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    getComplexityLabel(complexity) {
        const labels = {
            'simple': 'Простая',
            'medium': 'Средняя',
            'complex': 'Сложная',
            'expert': 'Экспертная',
            'none': 'Нет'
        };
        return labels[complexity] || complexity;
    }
    
    getBalanceLabel(balance) {
        const labels = {
            'neutral': 'Нейтральный',
            'balanced': 'Сбалансированный',
            'simple': 'Простой',
            'complex': 'Сложный',
            'unbalanced': 'Несбалансированный'
        };
        return labels[balance] || balance;
    }
    
    renderSpiceMixtures(spiceMixtures) {
        if (!spiceMixtures) return;
        
        const container = document.getElementById('spice-mixtures');
        if (!container) return;
        
        container.innerHTML = `
            <div class="spice-mixture-analysis">
                <h4>Анализ смесей специй</h4>
                ${spiceMixtures.compatibility ? `
                    <div class="mixture-compatibility">
                        <h5>Совместимость смеси</h5>
                        <p>${spiceMixtures.compatibility.description}</p>
                        <div class="compatibility-score">Оценка: ${spiceMixtures.compatibility.score}/10</div>
                    </div>
                ` : ''}
                
                ${spiceMixtures.interactions && spiceMixtures.interactions.length > 0 ? `
                    <div class="mixture-interactions">
                        <h5>Взаимодействия</h5>
                        ${spiceMixtures.interactions.map(interaction => `
                            <div class="interaction-item">
                                <strong>${interaction.spices.join(' + ')}</strong>
                                <p>${interaction.description}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    generateBasicScientificBasis(selectedSpices, selectedMethods = []) {
        const chemicalCompounds = [];
        const nutritionalAspects = [];
        const solventInteractions = [];
        const cookingMethodEffects = [];
        
        selectedSpices.forEach(spice => {
            if (spice.chemical_compounds) {
                const compounds = [
                    ...(spice.chemical_compounds.volatile_oils || []),
                    ...(spice.chemical_compounds.phenolic_compounds || []),
                    ...(spice.chemical_compounds.alkaloids || [])
                ];
                
                compounds.forEach(compound => {
                    const existing = chemicalCompounds.find(c => c.name === compound);
                    if (existing) {
                        existing.sources.push(spice.name);
                        existing.synergy = true;
                    } else {
                        chemicalCompounds.push({
                            name: compound,
                            sources: [spice.name],
                            synergy: false
                        });
                    }
                });
            }
            
            if (spice.solubility) {
                solventInteractions.push({
                    spice: spice.name,
                    water: this.getSolventInteractionDescription(spice, 'water'),
                    oil: this.getSolventInteractionDescription(spice, 'oil'),
                    alcohol: this.getSolventInteractionDescription(spice, 'alcohol')
                });
            }
            
            if (spice.chemical_compounds && spice.chemical_compounds.phenolic_compounds && spice.chemical_compounds.phenolic_compounds.length > 0) {
                nutritionalAspects.push({
                    type: 'antioxidant',
                    spices: [spice.name],
                    benefit: 'Антиоксидантная защита и улучшение сохранности продуктов'
                });
            }
        });
        
        if (selectedMethods.length > 0) {
            selectedMethods.forEach(method => {
                cookingMethodEffects.push(this.getCookingMethodEffect(method, selectedSpices));
            });
        }
        
        return {
            chemicalCompounds,
            nutritionalAspects,
            flavorChemistry: [],
            solventInteractions,
            cookingMethodEffects
        };
    }
    
    renderScientificBasis(scientificBasis) {
        console.log('renderScientificBasis called with:', scientificBasis);
        const container = document.getElementById('scientific-basis');
        if (!container) {
            console.error('Scientific basis container not found!');
            return;
        }
        
        const selectedSpices = window.appState.getSelectedSpices();
        console.log('Selected spices for scientific basis:', selectedSpices.length);
        
        if (!scientificBasis && selectedSpices.length === 0) {
            container.innerHTML = '<p>Выберите специи для получения научного анализа</p>';
            console.log('No data and no spices, showing placeholder');
            return;
        }
        
        const analysisData = scientificBasis || { chemicalCompounds: [], nutritionalAspects: [], flavorChemistry: [] };
        console.log('Analysis data to render:', analysisData);
        
        console.log('Rendering scientific basis content');
        container.innerHTML = `
            <div class="scientific-analysis">
                <h4>Научный анализ</h4>
                
                ${analysisData.solventInteractions && analysisData.solventInteractions.length > 0 ? `
                    <div class="solvent-interactions-section">
                        <h5>Взаимодействие с растворителями</h5>
                        ${analysisData.solventInteractions.map(interaction => `
                            <div class="interaction-item">
                                <h6>${interaction.spice}</h6>
                                <div class="interaction-details">
                                    <div class="interaction-row">
                                        <strong>💧 Вода:</strong>
                                        <p>${interaction.water}</p>
                                    </div>
                                    <div class="interaction-row">
                                        <strong>🫒 Масло:</strong>
                                        <p>${interaction.oil}</p>
                                    </div>
                                    <div class="interaction-row">
                                        <strong>🍷 Алкоголь:</strong>
                                        <p>${interaction.alcohol}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${analysisData.cookingMethodEffects && analysisData.cookingMethodEffects.length > 0 ? `
                    <div class="cooking-method-effects-section">
                        <h5>Влияние методов приготовления</h5>
                        ${analysisData.cookingMethodEffects.map(effect => `
                            <div class="method-effect-item">
                                <h6>${effect.title}</h6>
                                <p>${effect.description}</p>
                                ${effect.recommendations.length > 0 ? `
                                    <div class="method-recommendations">
                                        <strong>Рекомендуемые специи:</strong> ${effect.recommendations.join(', ')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${selectedSpices.length > 0 ? `
                    <div class="solubility-section">
                        <h5>Краткая таблица растворимости</h5>
                        ${selectedSpices.map(spice => `
                            <div class="solubility-item">
                                <strong>${spice.name}</strong>
                                <div class="solubility-details">
                                    <div class="solubility-row">
                                        <span class="solubility-medium">Вода</span>
                                        <span class="solubility-level ${spice.solubility ? spice.solubility.water : 'неизвестно'}">${spice.solubility ? this.getSolubilityLabel(spice.solubility.water) : 'Неизвестно'}</span>
                                    </div>
                                    <div class="solubility-row">
                                        <span class="solubility-medium">Масло</span>
                                        <span class="solubility-level ${spice.solubility ? spice.solubility.oil : 'неизвестно'}">${spice.solubility ? this.getSolubilityLabel(spice.solubility.oil) : 'Неизвестно'}</span>
                                    </div>
                                    <div class="solubility-row">
                                        <span class="solubility-medium">Алкоголь</span>
                                        <span class="solubility-level ${spice.solubility ? spice.solubility.alcohol : 'неизвестно'}">${spice.solubility ? this.getSolubilityLabel(spice.solubility.alcohol) : 'Неизвестно'}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${analysisData.chemicalCompounds && analysisData.chemicalCompounds.length > 0 ? `
                    <div class="compounds-section">
                        <h5>Химические соединения</h5>
                        ${analysisData.chemicalCompounds.map(compound => `
                            <div class="compound-item">
                                <strong>${compound.name}</strong>
                                <p>Источники: ${compound.sources.join(', ')}</p>
                                ${compound.synergy ? `<span class="synergy-badge">Синергия</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${analysisData.flavorChemistry && analysisData.flavorChemistry.length > 0 ? `
                    <div class="flavor-chemistry-section">
                        <h5>Химия вкуса</h5>
                        ${analysisData.flavorChemistry.map(interaction => `
                            <div class="chemistry-item">
                                <strong>${interaction.spices.join(' + ')}</strong>
                                <p>${interaction.effect}</p>
                                <small>Тип: ${interaction.type}</small>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${analysisData.nutritionalAspects && analysisData.nutritionalAspects.length > 0 ? `
                    <div class="nutrition-section">
                        <h5>Питательные аспекты</h5>
                        ${analysisData.nutritionalAspects.map(aspect => `
                            <div class="nutrition-item">
                                <strong>${aspect.type === 'antioxidant' ? 'Антиоксиданты' : aspect.type}</strong>
                                <p>${aspect.benefit}</p>
                                <small>Специи: ${aspect.spices.join(', ')}</small>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${selectedSpices.length > 0 ? `
                    <div class="practical-recommendations-section">
                        <h5>Практические рекомендации по извлечению ароматов</h5>
                        <div class="recommendations-grid">
                            <div class="recommendation-item">
                                <strong>🔥 Для жарки:</strong>
                                <p>Добавляйте специи в разогретое масло для максимального извлечения жирорастворимых ароматов</p>
                            </div>
                            <div class="recommendation-item">
                                <strong>💧 Для варки:</strong>
                                <p>Используйте марлевый мешочек для специй, чтобы легко извлечь их после приготовления</p>
                            </div>
                            <div class="recommendation-item">
                                <strong>🍷 Для маринадов:</strong>
                                <p>Добавляйте немного алкоголя для лучшего извлечения ароматических соединений</p>
                            </div>
                            <div class="recommendation-item">
                                <strong>⏰ Время добавления:</strong>
                                <p>Целые специи - в начале, молотые - в середине, свежие травы - в конце приготовления</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    getSolubilityLabel(level) {
        const labels = {
            'хорошо': 'Хорошо',
            'частично': 'Частично', 
            'плохо': 'Плохо'
        };
        return labels[level] || level;
    }
    
    getSolventInteractionDescription(spice, solvent) {
        const solubility = spice.solubility[solvent];
        const compounds = spice.chemical_compounds;
        
        const descriptions = {
            water: {
                'хорошо': `Водорастворимые соединения ${spice.name} легко извлекаются, создавая насыщенный отвар с активными веществами`,
                'частично': `Некоторые соединения ${spice.name} растворяются в воде, требуется длительное настаивание для полного извлечения`,
                'плохо': `${spice.name} плохо растворяется в воде, основные ароматы остаются в твердой фазе`
            },
            oil: {
                'хорошо': `Жирорастворимые эфирные масла ${spice.name} активно переходят в масло, создавая ароматную основу`,
                'частично': `Часть летучих соединений ${spice.name} растворяется в масле при нагревании`,
                'плохо': `${spice.name} слабо взаимодействует с маслом, требует предварительной обработки`
            },
            alcohol: {
                'хорошо': `Спиртовые экстракты ${spice.name} содержат максимальную концентрацию активных веществ`,
                'частично': `Алкоголь частично извлекает ароматические соединения ${spice.name}`,
                'плохо': `${spice.name} не подходит для спиртовых настоек, низкая экстракция`
            }
        };
        
        return descriptions[solvent][solubility] || `Взаимодействие ${spice.name} с ${solvent} не определено`;
    }
    
    getCookingMethodEffect(method, spices) {
        const methodEffects = {
            'Варка': {
                title: 'Варка - водная экстракция',
                description: 'При варке активно извлекаются водорастворимые соединения',
                recommendations: spices.filter(s => s.solubility && s.solubility.water === 'хорошо').map(s => s.name)
            },
            'Жарка': {
                title: 'Жарка - масляная экстракция',
                description: 'Высокая температура и масло извлекают жирорастворимые ароматы',
                recommendations: spices.filter(s => s.solubility && s.solubility.oil === 'хорошо').map(s => s.name)
            },
            'Тушение': {
                title: 'Тушение - комбинированная экстракция',
                description: 'Сочетание воды и жира позволяет извлечь широкий спектр соединений',
                recommendations: spices.map(s => s.name)
            },
            'Фламбирование': {
                title: 'Фламбирование - спиртовая экстракция',
                description: 'Алкоголь извлекает специфические ароматические соединения',
                recommendations: spices.filter(s => s.solubility && s.solubility.alcohol === 'хорошо').map(s => s.name)
            },
            'Запекание': {
                title: 'Запекание - сухая экстракция',
                description: 'Сухой жар концентрирует ароматы и создает новые соединения',
                recommendations: spices.filter(s => s.intensity && s.intensity > 5).map(s => s.name)
            }
        };
        
        return methodEffects[method.name] || {
            title: `${method.name} - специфическая обработка`,
            description: 'Метод влияет на извлечение и трансформацию ароматических соединений',
            recommendations: spices.map(s => s.name)
        };
    }
    
    updateAllTags() {
        document.querySelectorAll('.tag').forEach(tag => {
            const category = tag.dataset.category;
            const id = parseInt(tag.dataset.id);
            
            if (category && id) {
                const item = window.appState.data[category]?.find(item => item.id === id);
                if (item) {
                    const translatedName = item.name;
                    const removeBtn = tag.querySelector('.tag-remove');
                    if (removeBtn) {
                        tag.innerHTML = `${translatedName}<button class="tag-remove" data-id="${id}" data-category="${category}">×</button>`;
                        tag.querySelector('.tag-remove').addEventListener('click', (e) => {
                            e.stopPropagation();
                            window.appState.removeTag(category, id);
                        });
                    } else {
                        tag.textContent = translatedName;
                    }
                }
            }
        });
    }
    
    getTranslationKey(name) {
        const keyMap = {
            'Курица': 'chicken',
            'Говядина': 'beef',
            'Свинина': 'pork',
            'Рыба': 'fish',
            'Лосось': 'salmon',
            'Баранина': 'lamb',
            'Утка': 'duck',
            'Индейка': 'turkey',
            'Креветки': 'shrimp',
            'Овощи': 'vegetables',
            'Картофель': 'potato',
            'Рис': 'rice',
            'Паста': 'pasta',
            'Грибы': 'mushrooms',
            'Хлеб': 'bread',
            'Капуста': 'cabbage',
            'Дичь': 'game',
            'Сырое': 'raw',
            'Маринование': 'marinating',
            'Бланширование': 'blanching',
            'Пассерование': 'sauteing',
            'Варка': 'boiling',
            'Тушение': 'stewing',
            'Жарка': 'frying',
            'Запекание': 'baking',
            'Гриль': 'grilling',
            'Копчение': 'smoking',
            'Су-вид': 'sousvide',
            'Конфи': 'confit',
            'Фламбирование': 'flambeing',
            'Карамелизация': 'caramelizing',
            'Ферментация': 'fermenting',
            'Сушка': 'drying',
            'Базилик': 'basil',
            'Орегано': 'oregano',
            'Тимьян': 'thyme',
            'Розмарин': 'rosemary',
            'Шалфей': 'sage',
            'Петрушка': 'parsley',
            'Укроп': 'dill',
            'Кориандр': 'coriander',
            'Кумин': 'cumin',
            'Тмин': 'caraway',
            'Фенхель': 'fennel',
            'Горчица': 'mustard',
            'Кардамон': 'cardamom',
            'Анис': 'anise',
            'Имбирь': 'ginger',
            'Куркума': 'turmeric',
            'Хрен': 'horseradish',
            'Галанга': 'galangal',
            'Черный перец': 'blackPepper',
            'Белый перец': 'whitePepper',
            'Красный перец': 'redPepper',
            'Паприка': 'paprika',
            'Чили': 'chili',
            'Гвоздика': 'cloves',
            'Шафран': 'saffron',
            'Лаванда': 'lavender',
            'Корица': 'cinnamon',
            'Лавровый лист': 'bayLeaf',
            'Кассия': 'cassia',
            'Можжевельник': 'juniper',
            'Бадьян': 'starAnise',
            'Душистый перец': 'allspice',
            'Мускатный орех': 'nutmeg',
            'Мускатный цвет': 'mace',
            'Асафетида': 'asafoetida',
            'Сумах': 'sumac',
            'Заатар': 'zaatar',
            'Ваниль': 'vanilla',
            'Бергамот': 'bergamot',
            'Тонка бобы': 'tonkaBeans',
            'Мята': 'mint',
            'Эстрагон': 'tarragon'
        };
        
        return keyMap[name] || name.toLowerCase();
    }
}

window.uiManager = new UIManager();