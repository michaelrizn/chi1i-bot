class SpiceAnalyzerApp {
    constructor() {
        this.telegramWebApp = null;
        this.selectionInterface = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            await this.waitForDOMContent();
            await this.waitForDataLoad();
            
            this.initializeTelegramWebApp();
            this.initializeInterface();
            this.bindEvents();
            
            this.hideLoadingScreen();
            this.isInitialized = true;
            
            console.log('SpiceAnalyzerApp initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Ошибка загрузки приложения');
        }
    }

    waitForDOMContent() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    waitForDataLoad() {
        return new Promise((resolve) => {
            const checkData = () => {
                if (window.SPICES_DATA && window.PRODUCTS_DATA && window.COOKING_METHODS_DATA) {
                    resolve();
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    }

    initializeTelegramWebApp() {
        this.telegramWebApp = new TelegramWebApp();
        
        if (this.telegramWebApp.isAvailable) {
            console.log('Telegram WebApp initialized:', {
                user: this.telegramWebApp.getUser(),
                theme: this.telegramWebApp.getTheme(),
                version: this.telegramWebApp.getVersion()
            });
        }
    }

    initializeInterface() {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            throw new Error('App container not found');
        }
        
        appContainer.innerHTML = '';
        
        this.selectionInterface = new SelectionInterface('app');
    }

    bindEvents() {
        document.addEventListener('mainButtonClicked', () => {
            this.handleMainButtonClick();
        });

        document.addEventListener('backButtonClicked', () => {
            this.handleBackButtonClick();
        });

        document.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        document.addEventListener('itemSelected', (e) => {
            this.handleItemSelection(e.detail);
        });

        document.addEventListener('itemDeselected', (e) => {
            this.handleItemDeselection(e.detail);
        });

        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showError('Произошла ошибка в приложении');
        });
    }
    
    handleMainButtonClick() {
        if (this.selectionInterface) {
            this.selectionInterface.performAnalysis();
        }
    }

    handleBackButtonClick() {
        if (this.selectionInterface) {
            this.selectionInterface.clearSelection();
        }
        
        if (this.telegramWebApp) {
            this.telegramWebApp.hideBackButton();
        }
    }

    handleThemeChange(theme) {
        console.log('Theme changed to:', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    handleItemSelection(detail) {
        if (this.telegramWebApp) {
            this.telegramWebApp.hapticFeedback('selection');
        }
        
        this.updateMainButton();
    }

    handleItemDeselection(detail) {
        this.updateMainButton();
    }
    
    updateMainButton() {
        if (!this.telegramWebApp || !this.selectionInterface) return;
        
        const hasSelection = this.selectionInterface.selectedProducts.size > 0 || 
                           this.selectionInterface.selectedMethods.size > 0 || 
                           this.selectionInterface.selectedSpices.size > 0;
        
        if (hasSelection && this.selectionInterface.selectedSpices.size > 0) {
            this.telegramWebApp.showMainButton('Анализировать', () => {
                this.selectionInterface.performAnalysis();
            });
        } else if (hasSelection) {
            this.telegramWebApp.showMainButton('Выберите специи');
        } else {
            this.telegramWebApp.hideMainButton();
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 300);
        }
    }
    
    showError(message) {
        if (this.telegramWebApp) {
            this.telegramWebApp.showAlert(message);
        } else {
            alert(message);
        }
    }

    cleanup() {
        if (this.selectionInterface) {
            this.selectionInterface.clearSelection();
        }
        
        if (this.telegramWebApp) {
            this.telegramWebApp.hideMainButton();
            this.telegramWebApp.hideBackButton();
        }
    }

    getAppState() {
        if (!this.selectionInterface) return null;
        
        return {
            selectedProducts: Array.from(this.selectionInterface.selectedProducts),
            selectedMethods: Array.from(this.selectionInterface.selectedMethods),
            selectedSpices: Array.from(this.selectionInterface.selectedSpices),
            isInitialized: this.isInitialized
        };
    }

    restoreAppState(state) {
        if (!this.selectionInterface || !state) return;
        
        state.selectedProducts?.forEach(id => {
            this.selectionInterface.selectedProducts.add(id);
        });
        
        state.selectedMethods?.forEach(id => {
            this.selectionInterface.selectedMethods.add(id);
        });
        
        state.selectedSpices?.forEach(id => {
            this.selectionInterface.selectedSpices.add(id);
        });
        
        this.selectionInterface.updateSelectionCounts();
        this.selectionInterface.updateAnalyzeButton();
        this.updateMainButton();
    }
}

let app;

function initializeApp() {
    app = new SpiceAnalyzerApp();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

window.SpiceAnalyzerApp = SpiceAnalyzerApp;