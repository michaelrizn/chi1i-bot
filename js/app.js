class SpiceAnalyzerApp {
    constructor() {
        this.initialized = false;
        this.comprehensiveAnalyzer = null;
        this.init();
    }
    
    async init() {
        try {
            await this.loadData();
            this.initializeAnalyzers();
            this.setupEventListeners();
            this.setupStateSubscription();
            this.initializeUI();
            this.optimizePerformance();
            this.initialized = true;
            console.log('Spice Analyzer App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Ошибка загрузки приложения. Попробуйте обновить страницу.');
        }
    }
    


    async loadData() {
        const success = await window.appState.loadData();
        if (!success) {
            throw new Error('Failed to load application data');
        }
    }

    optimizePerformance() {
        if (window.performanceOptimizer) {
            window.performanceOptimizer.optimizeAll();
            console.log('Performance optimization applied');
        }
    }
    
    initializeAnalyzers() {
        if (window.ComprehensiveAnalyzer) {
            this.comprehensiveAnalyzer = new window.ComprehensiveAnalyzer();
            console.log('ComprehensiveAnalyzer initialized');
        } else {
            console.warn('ComprehensiveAnalyzer not available, using basic analysis');
            this.comprehensiveAnalyzer = null;
        }
    }
    
    setupEventListeners() {
        window.addEventListener('beforeunload', () => {
            window.appState.saveToStorage();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                window.appState.saveToStorage();
            }
        });
    }
    
    setupStateSubscription() {
        window.appState.subscribe((state) => {
            this.handleStateChange(state);
        });
    }
    
    initializeUI() {
        if (window.appState) {
            window.appState.reset();
        }
        
        if (window.uiManager && window.appState.data) {
            window.uiManager.renderTagClouds(window.appState.data);
        }
        
        const currentState = window.appState.getState();
        this.handleStateChange(currentState);
    }
    
    handleStateChange(state) {
        if (!this.initialized) return;
        
        if (window.uiManager) {
            window.uiManager.updateTagStates(state);
            window.uiManager.updateSelectedSection(state);
            window.uiManager.updateExplanations(state);
        }
        
        this.updatePageTitle(state);
        this.updateCompleteAnalysis(state);
    }
    
    updateCompleteAnalysis(state) {
        if (!this.comprehensiveAnalyzer || !window.appState.shouldShowExplanations()) {
            return;
        }
        
        try {
            const analysis = this.comprehensiveAnalyzer.generateCompleteAnalysis(
                state.selectedProducts,
                state.selectedMethods,
                state.selectedSpices,
                window.appState.data
            );
            
            if (window.uiManager && window.uiManager.updateCompleteAnalysis) {
                window.uiManager.updateCompleteAnalysis(analysis);
            }
        } catch (error) {
            console.error('Error generating complete analysis:', error);
        }
    }
    
    updatePageTitle(state) {
        const totalSelected = 
            state.selectedProducts.length + 
            state.selectedMethods.length + 
            state.selectedSpices.length;
        
        if (totalSelected > 0) {
            document.title = `Анализатор специй (${totalSelected} выбрано)`;
        } else {
            document.title = 'Анализатор совместимости специй';
        }
    }
    
    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #dc3545;
            color: white;
            padding: 2rem;
            border-radius: 0.75rem;
            text-align: center;
            z-index: 9999;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        errorDiv.innerHTML = `
            <h3 style="margin: 0 0 1rem 0;">Ошибка</h3>
            <p style="margin: 0 0 1rem 0;">${message}</p>
            <button onclick="this.parentElement.remove()" style="
                background: white;
                color: #dc3545;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                margin-right: 0.5rem;
                cursor: pointer;
            ">Закрыть</button>
            <button onclick="location.reload()" style="
                background: white;
                color: #dc3545;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
            ">Обновить страницу</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }
    
    getAnalysisData() {
        if (!this.initialized) return null;
        
        const state = window.appState.getState();
        return {
            selectedProducts: state.selectedProducts,
            selectedMethods: state.selectedMethods,
            selectedSpices: state.selectedSpices,
            data: window.appState.data
        };
    }
    
    reset() {
        if (window.appState) {
            window.appState.reset();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.spiceAnalyzerApp = new SpiceAnalyzerApp();
    } catch (error) {
        console.error('Failed to create SpiceAnalyzerApp:', error);
        
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #dc3545;
            color: white;
            padding: 2rem;
            border-radius: 0.75rem;
            text-align: center;
            z-index: 9999;
        `;
        errorDiv.innerHTML = `
            <h3>Критическая ошибка</h3>
            <p>Не удалось запустить приложение</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #dc3545;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                margin-top: 1rem;
                cursor: pointer;
            ">Обновить страницу</button>
        `;
        document.body.appendChild(errorDiv);
    }
});