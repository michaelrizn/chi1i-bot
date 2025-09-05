class TelegramWebApp {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.isAvailable = !!this.tg;
        this.user = null;
        this.theme = 'light';
        
        if (this.isAvailable) {
            this.init();
        } else {
            this.initFallback();
        }
    }

    init() {
        this.tg.ready();
        this.tg.expand();
        
        this.user = this.tg.initDataUnsafe?.user || null;
        this.theme = this.tg.colorScheme || 'light';
        
        this.setupMainButton();
        this.setupBackButton();
        this.setupTheme();
        this.setupHapticFeedback();
        
        this.tg.onEvent('themeChanged', () => {
            this.theme = this.tg.colorScheme;
            this.updateTheme();
        });
        
        this.tg.onEvent('mainButtonClicked', () => {
            this.handleMainButtonClick();
        });
        
        this.tg.onEvent('backButtonClicked', () => {
            this.handleBackButtonClick();
        });
        
        console.log('Telegram WebApp initialized:', {
            user: this.user,
            theme: this.theme,
            version: this.tg.version
        });
    }

    initFallback() {
        console.log('Telegram WebApp not available, using fallback mode');
        
        this.user = {
            id: 'demo',
            first_name: 'Demo',
            username: 'demo_user'
        };
        
        this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.theme = e.matches ? 'dark' : 'light';
            this.updateTheme();
        });
        
        this.setupTheme();
    }

    setupMainButton() {
        if (!this.isAvailable) return;
        
        this.tg.MainButton.setText('Анализировать');
        this.tg.MainButton.color = '#2ea043';
        this.tg.MainButton.textColor = '#ffffff';
        this.tg.MainButton.hide();
    }

    setupBackButton() {
        if (!this.isAvailable) return;
        
        this.tg.BackButton.hide();
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        if (this.isAvailable) {
            const themeParams = this.tg.themeParams;
            
            document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-hint-color', themeParams.hint_color || '#999999');
            document.documentElement.style.setProperty('--tg-link-color', themeParams.link_color || '#2481cc');
            document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color || '#2481cc');
            document.documentElement.style.setProperty('--tg-button-text-color', themeParams.button_text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-secondary-bg-color', themeParams.secondary_bg_color || '#f1f1f1');
        }
    }

    updateTheme() {
        this.setupTheme();
        
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.theme }
        }));
    }

    setupHapticFeedback() {
        if (!this.isAvailable) return;
        
        this.haptic = {
            impact: (style = 'light') => {
                if (this.tg.HapticFeedback) {
                    this.tg.HapticFeedback.impactOccurred(style);
                }
            },
            notification: (type = 'success') => {
                if (this.tg.HapticFeedback) {
                    this.tg.HapticFeedback.notificationOccurred(type);
                }
            },
            selection: () => {
                if (this.tg.HapticFeedback) {
                    this.tg.HapticFeedback.selectionChanged();
                }
            }
        };
    }

    showMainButton(text = 'Анализировать', callback = null) {
        if (!this.isAvailable) {
            this.showFallbackButton(text, callback);
            return;
        }
        
        this.tg.MainButton.setText(text);
        this.tg.MainButton.show();
        
        if (callback) {
            this.mainButtonCallback = callback;
        }
    }

    hideMainButton() {
        if (!this.isAvailable) {
            this.hideFallbackButton();
            return;
        }
        
        this.tg.MainButton.hide();
    }

    showFallbackButton(text, callback) {
        let button = document.getElementById('fallback-main-button');
        
        if (!button) {
            button = document.createElement('button');
            button.id = 'fallback-main-button';
            button.className = 'fallback-main-button';
            document.body.appendChild(button);
        }
        
        button.textContent = text;
        button.style.display = 'block';
        
        button.onclick = callback;
    }

    hideFallbackButton() {
        const button = document.getElementById('fallback-main-button');
        if (button) {
            button.style.display = 'none';
        }
    }

    handleMainButtonClick() {
        if (this.mainButtonCallback) {
            this.mainButtonCallback();
        }
        
        document.dispatchEvent(new CustomEvent('mainButtonClicked'));
    }

    showBackButton(callback = null) {
        if (!this.isAvailable) return;
        
        this.tg.BackButton.show();
        
        if (callback) {
            this.backButtonCallback = callback;
        }
    }

    hideBackButton() {
        if (!this.isAvailable) return;
        
        this.tg.BackButton.hide();
    }

    handleBackButtonClick() {
        if (this.backButtonCallback) {
            this.backButtonCallback();
        }
        
        document.dispatchEvent(new CustomEvent('backButtonClicked'));
    }

    showAlert(message) {
        if (this.isAvailable) {
            try {
                if (this.tg.showAlert) {
                    this.tg.showAlert(message);
                } else if (this.tg.showPopup) {
                    this.tg.showPopup({
                        title: 'Уведомление',
                        message: message,
                        buttons: [{ type: 'ok' }]
                    });
                } else {
                    alert(message);
                }
            } catch (error) {
                console.warn('Telegram WebApp method not supported:', error.message);
                alert(message);
            }
        } else {
            alert(message);
        }
    }

    showConfirm(message, callback) {
        if (this.isAvailable && this.tg.showConfirm) {
            this.tg.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback(result);
        }
    }

    showPopup(params) {
        if (this.isAvailable && this.tg.showPopup) {
            this.tg.showPopup(params);
        } else {
            this.showAlert(params.message || 'Popup message');
        }
    }

    sendData(data) {
        if (this.isAvailable) {
            this.tg.sendData(JSON.stringify(data));
        } else {
            console.log('Would send data to Telegram:', data);
        }
    }

    close() {
        if (this.isAvailable) {
            this.tg.close();
        } else {
            window.close();
        }
    }

    openLink(url, options = {}) {
        if (this.isAvailable && this.tg.openLink) {
            this.tg.openLink(url, options);
        } else {
            window.open(url, options.try_instant_view ? '_self' : '_blank');
        }
    }

    openTelegramLink(url) {
        if (this.isAvailable && this.tg.openTelegramLink) {
            this.tg.openTelegramLink(url);
        } else {
            window.open(url, '_blank');
        }
    }

    requestWriteAccess(callback) {
        if (this.isAvailable && this.tg.requestWriteAccess) {
            this.tg.requestWriteAccess(callback);
        } else {
            callback(true);
        }
    }

    requestContact(callback) {
        if (this.isAvailable && this.tg.requestContact) {
            this.tg.requestContact(callback);
        } else {
            callback(false);
        }
    }

    setHeaderColor(color) {
        if (this.isAvailable && this.tg.setHeaderColor) {
            this.tg.setHeaderColor(color);
        }
    }

    setBackgroundColor(color) {
        if (this.isAvailable && this.tg.setBackgroundColor) {
            this.tg.setBackgroundColor(color);
        }
    }

    enableClosingConfirmation() {
        if (this.isAvailable) {
            this.tg.enableClosingConfirmation();
        }
    }

    disableClosingConfirmation() {
        if (this.isAvailable) {
            this.tg.disableClosingConfirmation();
        }
    }

    hapticFeedback(type = 'light') {
        if (this.haptic) {
            switch (type) {
                case 'impact':
                case 'light':
                case 'medium':
                case 'heavy':
                    this.haptic.impact(type === 'impact' ? 'light' : type);
                    break;
                case 'success':
                case 'warning':
                case 'error':
                    this.haptic.notification(type);
                    break;
                case 'selection':
                    this.haptic.selection();
                    break;
            }
        }
    }

    getUser() {
        return this.user;
    }

    getTheme() {
        return this.theme;
    }

    isReady() {
        return this.isAvailable;
    }

    getVersion() {
        return this.isAvailable ? this.tg.version : 'fallback';
    }

    getPlatform() {
        return this.isAvailable ? this.tg.platform : 'web';
    }

    getViewportHeight() {
        return this.isAvailable ? this.tg.viewportHeight : window.innerHeight;
    }

    getViewportStableHeight() {
        return this.isAvailable ? this.tg.viewportStableHeight : window.innerHeight;
    }

    isExpanded() {
        return this.isAvailable ? this.tg.isExpanded : true;
    }

    onViewportChanged(callback) {
        if (this.isAvailable) {
            this.tg.onEvent('viewportChanged', callback);
        } else {
            window.addEventListener('resize', callback);
        }
    }

    offViewportChanged(callback) {
        if (this.isAvailable) {
            this.tg.offEvent('viewportChanged', callback);
        } else {
            window.removeEventListener('resize', callback);
        }
    }
}

window.TelegramWebApp = TelegramWebApp;