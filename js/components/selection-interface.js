class SelectionInterface {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.selectedProducts = new Set();
        this.selectedSpices = new Set();
        this.selectedMethods = new Set();
        this.compatibilitySystem = new CompatibilitySystem();
        this.cloudRenderer = new CloudRenderer();
        
        this.init();
    }

    init() {
        this.createInterface();
        this.bindEvents();
        
        // Небольшая задержка для обеспечения создания DOM элементов
        setTimeout(() => {
            this.renderClouds();
        }, 100);
    }

    createInterface() {
        this.container.innerHTML = `
            <div class="selection-interface">
                <div class="selection-header">
                    <h2>Анализатор совместимости специй</h2>
                    <p>Выберите продукты, способы приготовления и специи для анализа</p>
                </div>
                
                <div class="selection-tabs">
                    <button class="tab-button active" data-tab="products">Продукты</button>
                    <button class="tab-button" data-tab="methods">Способы приготовления</button>
                    <button class="tab-button" data-tab="spices">Специи</button>
                </div>
                
                <div class="selection-content">
                    <div class="tab-panel active" id="products-panel">
                        <div class="selection-summary">
                            <span class="summary-label">Выбрано продуктов:</span>
                            <span class="summary-count" id="products-count">0</span>
                        </div>
                        <div class="cloud-container" id="products-cloud"></div>
                    </div>
                    
                    <div class="tab-panel" id="methods-panel">
                        <div class="selection-summary">
                            <span class="summary-label">Выбрано способов:</span>
                            <span class="summary-count" id="methods-count">0</span>
                        </div>
                        <div class="cloud-container" id="methods-cloud"></div>
                    </div>
                    
                    <div class="tab-panel" id="spices-panel">
                        <div class="selection-summary">
                            <span class="summary-label">Выбрано специй:</span>
                            <span class="summary-count" id="spices-count">0</span>
                        </div>
                        <div class="spice-recommendations" id="spice-recommendations"></div>
                        <div class="cloud-container" id="spices-cloud"></div>
                    </div>
                </div>
                
                <div class="selection-actions">
                    <button class="action-button analyze-button" id="analyze-button" disabled>
                        Анализировать совместимость
                    </button>
                    <button class="action-button clear-button" id="clear-button">
                        Очистить выбор
                    </button>
                </div>
                
                <div class="analysis-results" id="analysis-results" style="display: none;"></div>
            </div>
        `;
    }

    bindEvents() {
        const tabButtons = this.container.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        const analyzeButton = this.container.querySelector('#analyze-button');
        analyzeButton.addEventListener('click', () => {
            this.performAnalysis();
        });

        const clearButton = this.container.querySelector('#clear-button');
        clearButton.addEventListener('click', () => {
            this.clearSelection();
        });

        document.addEventListener('itemSelected', (e) => {
            this.handleItemSelection(e.detail);
        });

        document.addEventListener('itemDeselected', (e) => {
            this.handleItemDeselection(e.detail);
        });
    }

    switchTab(tabName) {
        const tabButtons = this.container.querySelectorAll('.tab-button');
        const tabPanels = this.container.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabName);
        });

        tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-panel`);
        });

        if (tabName === 'spices') {
            this.updateSpiceRecommendations();
        }
    }

    renderClouds() {
        // Проверяем, что контейнеры существуют перед рендерингом
        const productsContainer = document.getElementById('products-cloud');
        const methodsContainer = document.getElementById('methods-cloud');
        const spicesContainer = document.getElementById('spices-cloud');
        
        if (productsContainer && window.PRODUCTS_DATA) {
            this.cloudRenderer.renderProducts('products-cloud', window.PRODUCTS_DATA);
        }
        
        if (methodsContainer && window.COOKING_METHODS_DATA) {
            this.cloudRenderer.renderCookingMethods('methods-cloud', window.COOKING_METHODS_DATA);
        }
        
        if (spicesContainer && window.SPICES_DATA) {
            this.cloudRenderer.renderSpices('spices-cloud', window.SPICES_DATA);
        }
    }

    handleItemSelection(detail) {
        const { type, id, name } = detail;
        
        switch (type) {
            case 'product':
                this.selectedProducts.add(id);
                break;
            case 'method':
                this.selectedMethods.add(id);
                break;
            case 'spice':
                this.selectedSpices.add(id);
                break;
        }
        
        this.updateSelectionCounts();
        this.updateAnalyzeButton();
        this.updateSpiceRecommendations();
        
        this.triggerHapticFeedback();
    }

    handleItemDeselection(detail) {
        const { type, id } = detail;
        
        switch (type) {
            case 'product':
                this.selectedProducts.delete(id);
                break;
            case 'method':
                this.selectedMethods.delete(id);
                break;
            case 'spice':
                this.selectedSpices.delete(id);
                break;
        }
        
        this.updateSelectionCounts();
        this.updateAnalyzeButton();
        this.updateSpiceRecommendations();
    }

    updateSelectionCounts() {
        const productsCount = this.container.querySelector('#products-count');
        const methodsCount = this.container.querySelector('#methods-count');
        const spicesCount = this.container.querySelector('#spices-count');
        
        productsCount.textContent = this.selectedProducts.size;
        methodsCount.textContent = this.selectedMethods.size;
        spicesCount.textContent = this.selectedSpices.size;
    }

    updateAnalyzeButton() {
        const analyzeButton = this.container.querySelector('#analyze-button');
        const hasSelection = this.selectedProducts.size > 0 || 
                           this.selectedMethods.size > 0 || 
                           this.selectedSpices.size > 0;
        
        analyzeButton.disabled = !hasSelection;
    }

    updateSpiceRecommendations() {
        if (this.selectedProducts.size === 0 && this.selectedMethods.size === 0) {
            this.hideSpiceRecommendations();
            return;
        }

        const recommendedSpices = this.compatibilitySystem.getSpiceRecommendations(
            Array.from(this.selectedProducts),
            Array.from(this.selectedMethods)
        );

        this.showSpiceRecommendations(recommendedSpices);
    }

    showSpiceRecommendations(spices) {
        const recommendationsContainer = this.container.querySelector('#spice-recommendations');
        
        if (spices.length === 0) {
            this.hideSpiceRecommendations();
            return;
        }

        recommendationsContainer.innerHTML = `
            <div class="recommendations-header">
                <h4>Рекомендуемые специи</h4>
                <p>На основе выбранных продуктов и способов приготовления</p>
            </div>
            <div class="recommendations-list">
                ${spices.map(spice => `
                    <div class="recommendation-item" data-spice-id="${spice.id}">
                        <div class="recommendation-color" style="background-color: ${spice.color}"></div>
                        <span class="recommendation-name">${spice.name}</span>
                        <button class="recommendation-add" data-spice-id="${spice.id}">
                            ${this.selectedSpices.has(spice.id) ? '✓' : '+'}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        recommendationsContainer.style.display = 'block';

        const addButtons = recommendationsContainer.querySelectorAll('.recommendation-add');
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const spiceId = parseInt(e.target.dataset.spiceId);
                this.toggleSpiceFromRecommendation(spiceId);
            });
        });
    }

    hideSpiceRecommendations() {
        const recommendationsContainer = this.container.querySelector('#spice-recommendations');
        recommendationsContainer.style.display = 'none';
    }

    toggleSpiceFromRecommendation(spiceId) {
        const spiceElement = this.container.querySelector(`[data-item-id="${spiceId}"][data-item-type="spice"]`);
        
        if (this.selectedSpices.has(spiceId)) {
            this.selectedSpices.delete(spiceId);
            if (spiceElement) {
                spiceElement.classList.remove('selected');
            }
        } else {
            this.selectedSpices.add(spiceId);
            if (spiceElement) {
                spiceElement.classList.add('selected');
            }
        }
        
        this.updateSelectionCounts();
        this.updateAnalyzeButton();
        this.updateSpiceRecommendations();
    }

    performAnalysis() {
        if (this.selectedSpices.size === 0) {
            this.showError('Выберите хотя бы одну специю для анализа');
            return;
        }

        const analysis = this.compatibilitySystem.analyzeSpiceMix(
            Array.from(this.selectedSpices),
            Array.from(this.selectedProducts),
            Array.from(this.selectedMethods)
        );

        this.displayAnalysisResults(analysis);
        this.triggerHapticFeedback();
    }

    displayAnalysisResults(analysis) {
        const resultsContainer = this.container.querySelector('#analysis-results');
        
        resultsContainer.innerHTML = `
            <div class="analysis-header">
                <h3>Результаты анализа совместимости</h3>
                <div class="compatibility-score">
                    <div class="score-circle" style="--score: ${analysis.compatibility_score}">
                        <span class="score-value">${analysis.compatibility_score}</span>
                        <span class="score-label">из 100</span>
                    </div>
                    <div class="score-description">
                        ${this.getScoreDescription(analysis.compatibility_score)}
                    </div>
                </div>
            </div>
            
            <div class="analysis-sections">
                ${this.renderChemicalSynergies(analysis.chemical_synergies)}
                ${this.renderConflicts(analysis.conflicts)}
                ${this.renderRecommendations(analysis.recommendations)}
                ${this.renderScientificExplanation(analysis.scientific_explanation)}
                ${this.renderFlavorBalance(analysis.flavor_balance)}
                ${this.renderHealthBenefits(analysis.health_benefits)}
            </div>
        `;
        
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    getScoreDescription(score) {
        if (score >= 80) return 'Отличная совместимость';
        if (score >= 60) return 'Хорошая совместимость';
        if (score >= 40) return 'Удовлетворительная совместимость';
        return 'Требует корректировки';
    }

    renderChemicalSynergies(synergies) {
        if (synergies.length === 0) return '';
        
        return `
            <div class="analysis-section">
                <h4>Химические синергии</h4>
                <div class="synergies-list">
                    ${synergies.map(synergy => `
                        <div class="synergy-item">
                            <div class="synergy-compound">${synergy.compound}</div>
                            <div class="synergy-spices">${synergy.spices.join(', ')}</div>
                            <div class="synergy-effect">${synergy.effect}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderConflicts(conflicts) {
        if (conflicts.length === 0) return '';
        
        return `
            <div class="analysis-section conflicts">
                <h4>Потенциальные конфликты</h4>
                <div class="conflicts-list">
                    ${conflicts.map(conflict => `
                        <div class="conflict-item severity-${conflict.severity}">
                            <div class="conflict-type">${conflict.type}</div>
                            <div class="conflict-reason">${conflict.reason}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderRecommendations(recommendations) {
        if (recommendations.length === 0) return '';
        
        return `
            <div class="analysis-section">
                <h4>Рекомендации</h4>
                <div class="recommendations-list">
                    ${recommendations.map(rec => `
                        <div class="recommendation-item">
                            <div class="recommendation-suggestion">${rec.suggestion}</div>
                            <div class="recommendation-reason">${rec.reason}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderScientificExplanation(explanation) {
        return `
            <div class="analysis-section">
                <h4>Научное обоснование</h4>
                <div class="scientific-explanation">
                    <p>${explanation}</p>
                </div>
            </div>
        `;
    }

    renderFlavorBalance(balance) {
        const entries = Object.entries(balance);
        if (entries.length === 0) return '';
        
        return `
            <div class="analysis-section">
                <h4>Баланс вкусов</h4>
                <div class="flavor-balance">
                    ${entries.map(([flavor, percentage]) => `
                        <div class="flavor-item">
                            <span class="flavor-name">${flavor}</span>
                            <div class="flavor-bar">
                                <div class="flavor-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="flavor-percentage">${percentage}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderHealthBenefits(benefits) {
        if (benefits.length === 0) return '';
        
        return `
            <div class="analysis-section">
                <h4>Полезные свойства</h4>
                <div class="health-benefits">
                    ${benefits.map(benefit => `
                        <div class="benefit-item">${benefit}</div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    clearSelection() {
        this.selectedProducts.clear();
        this.selectedSpices.clear();
        this.selectedMethods.clear();
        
        const selectedElements = this.container.querySelectorAll('.selected');
        selectedElements.forEach(element => {
            element.classList.remove('selected');
        });
        
        this.updateSelectionCounts();
        this.updateAnalyzeButton();
        this.hideSpiceRecommendations();
        
        const resultsContainer = this.container.querySelector('#analysis-results');
        resultsContainer.style.display = 'none';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        this.container.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    triggerHapticFeedback() {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }
}

window.SelectionInterface = SelectionInterface;