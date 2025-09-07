class AppState {
    constructor() {
        this.state = {
            selectedProducts: [],
            selectedMethods: [],
            selectedSpices: [],
            incompatibleTags: {
                products: [],
                methods: [],
                spices: []
            },
            mutuallyExcludedTags: {
                products: [],
                methods: [],
                spices: []
            },
            language: 'ru'
        };
        
        this.listeners = [];
        this.data = {
            products: [],
            methods: [],
            spices: []
        };
        
        this.loadFromStorage();
    }
    
    async loadData() {
        try {
            const [productsRes, methodsRes, spicesRes] = await Promise.all([
                fetch('data/products.json'),
                fetch('data/methods.json'),
                fetch('data/spices.json')
            ]);
            
            this.data.products = await productsRes.json();
            this.data.methods = await methodsRes.json();
            this.data.spices = await spicesRes.json();
            
            
            return true;
        } catch (error) {
            console.error('Failed to load data:', error);
            return false;
        }
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveToStorage();
        this.notifyListeners();
    }
    
    getState() {
        return { ...this.state };
    }
    
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('spice-analyzer-state');
            if (saved) {
                const parsedState = JSON.parse(saved);
                this.state = { ...this.state, ...parsedState };
            }
        } catch (error) {
            console.error('Failed to load state from storage:', error);
        }
    }
    
    saveToStorage() {
        try {
            const stateToSave = {
                selectedProducts: this.state.selectedProducts,
                selectedMethods: this.state.selectedMethods,
                selectedSpices: this.state.selectedSpices,
                language: this.state.language
            };
            localStorage.setItem('spice-analyzer-state', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Failed to save state to storage:', error);
        }
    }
    
    selectTag(category, id) {
        const selectedKey = `selected${category.charAt(0).toUpperCase() + category.slice(1)}`;
        const currentSelected = [...this.state[selectedKey]];
        
        if (!currentSelected.includes(id)) {
            currentSelected.push(id);
            this.setState({ [selectedKey]: currentSelected });
            this.updateCompatibility();
        }
    }
    
    removeTag(category, id) {
        const selectedKey = `selected${category.charAt(0).toUpperCase() + category.slice(1)}`;
        const currentSelected = this.state[selectedKey].filter(tagId => tagId !== id);
        this.setState({ [selectedKey]: currentSelected });
        this.updateCompatibility();
    }
    
    updateCompatibility() {
        const incompatible = this.calculateIncompatibilities();
        const mutuallyExcluded = this.calculateMutualExclusions();
        
        this.setState({
            incompatibleTags: incompatible,
            mutuallyExcludedTags: mutuallyExcluded
        });
    }
    
    calculateIncompatibilities() {
        const incompatible = {
            products: [],
            methods: [],
            spices: []
        };
        
        this.state.selectedProducts.forEach(productId => {
            const product = this.data.products.find(p => p.id === productId);
            if (product) {
                if (product.incompatible_spices) {
                    incompatible.spices.push(...product.incompatible_spices);
                }
                if (product.incompatible_methods) {
                    incompatible.methods.push(...product.incompatible_methods);
                }
            }
            
            this.data.spices.forEach(spice => {
                if (spice.incompatible_products && spice.incompatible_products.includes(productId)) {
                    incompatible.spices.push(spice.id);
                }
            });
            
            this.data.methods.forEach(method => {
                if (method.incompatible_products && method.incompatible_products.includes(productId)) {
                    incompatible.methods.push(method.id);
                }
            });
        });
        
        this.state.selectedMethods.forEach(methodId => {
            const method = this.data.methods.find(m => m.id === methodId);
            if (method) {
                if (method.incompatible_spices) {
                    incompatible.spices.push(...method.incompatible_spices);
                }
                if (method.incompatible_products) {
                    incompatible.products.push(...method.incompatible_products);
                }
            }
            
            this.data.spices.forEach(spice => {
                if (spice.incompatible_methods && spice.incompatible_methods.includes(methodId)) {
                    incompatible.spices.push(spice.id);
                }
            });
            
            this.data.products.forEach(product => {
                if (product.incompatible_methods && product.incompatible_methods.includes(methodId)) {
                    incompatible.products.push(product.id);
                }
            });
        });
        
        this.state.selectedSpices.forEach(spiceId => {
            const spice = this.data.spices.find(s => s.id === spiceId);
            if (spice) {
                if (spice.incompatible_spices) {
                    incompatible.spices.push(...spice.incompatible_spices);
                }
                if (spice.incompatible_products) {
                    incompatible.products.push(...spice.incompatible_products);
                }
                if (spice.incompatible_methods) {
                    incompatible.methods.push(...spice.incompatible_methods);
                }
            }
            
            this.data.spices.forEach(otherSpice => {
                if (otherSpice.incompatible_spices && otherSpice.incompatible_spices.includes(spiceId)) {
                    incompatible.spices.push(otherSpice.id);
                }
            });
            
            this.data.products.forEach(product => {
                if (product.incompatible_spices && product.incompatible_spices.includes(spiceId)) {
                    incompatible.products.push(product.id);
                }
            });
            
            this.data.methods.forEach(method => {
                if (method.incompatible_spices && method.incompatible_spices.includes(spiceId)) {
                    incompatible.methods.push(method.id);
                }
            });
        });
        
        incompatible.products = [...new Set(incompatible.products)];
        incompatible.methods = [...new Set(incompatible.methods)];
        incompatible.spices = [...new Set(incompatible.spices)];
        
        return incompatible;
    }
    
    calculateMutualExclusions() {
        const mutuallyExcluded = {
            products: [],
            methods: [],
            spices: []
        };
        
        this.state.selectedProducts.forEach(productId => {
            const product = this.data.products.find(p => p.id === productId);
            if (product && product.incompatible_products) {
                mutuallyExcluded.products.push(...product.incompatible_products);
            }
            
            this.data.products.forEach(otherProduct => {
                if (otherProduct.incompatible_products && otherProduct.incompatible_products.includes(productId)) {
                    mutuallyExcluded.products.push(otherProduct.id);
                }
            });
        });
        
        this.state.selectedMethods.forEach(methodId => {
            const method = this.data.methods.find(m => m.id === methodId);
            if (method && method.incompatible_methods) {
                mutuallyExcluded.methods.push(...method.incompatible_methods);
            }
            
            this.data.methods.forEach(otherMethod => {
                if (otherMethod.incompatible_methods && otherMethod.incompatible_methods.includes(methodId)) {
                    mutuallyExcluded.methods.push(otherMethod.id);
                }
            });
        });
        
        this.state.selectedSpices.forEach(spiceId => {
            const spice = this.data.spices.find(s => s.id === spiceId);
            if (spice && spice.incompatible_spices) {
                mutuallyExcluded.spices.push(...spice.incompatible_spices);
            }
            
            this.data.spices.forEach(otherSpice => {
                if (otherSpice.incompatible_spices && otherSpice.incompatible_spices.includes(spiceId)) {
                    mutuallyExcluded.spices.push(otherSpice.id);
                }
            });
        });
        
        mutuallyExcluded.products = [...new Set(mutuallyExcluded.products)];
        mutuallyExcluded.methods = [...new Set(mutuallyExcluded.methods)];
        mutuallyExcluded.spices = [...new Set(mutuallyExcluded.spices)];
        
        return mutuallyExcluded;
    }
    
    getTagState(category, id) {
        const selectedKey = `selected${category.charAt(0).toUpperCase() + category.slice(1)}`;
        
        if (this.state[selectedKey].includes(id)) {
            return 'selected';
        }
        
        if (this.state.mutuallyExcludedTags[category] && 
            this.state.mutuallyExcludedTags[category].includes(id)) {
            return 'mutually-excluded';
        }
        
        if (this.state.incompatibleTags[category] && 
            this.state.incompatibleTags[category].includes(id)) {
            return 'incompatible';
        }
        
        return 'default';
    }
    
    shouldShowExplanations() {
        const totalSelected = 
            this.state.selectedProducts.length + 
            this.state.selectedMethods.length + 
            this.state.selectedSpices.length;
        
        const hasMinimumSelection = totalSelected >= 2;
        const hasProductAndSpice = this.state.selectedProducts.length > 0 && this.state.selectedSpices.length > 0;
        const hasMethodAndSpice = this.state.selectedMethods.length > 0 && this.state.selectedSpices.length > 0;
        const hasMultipleSpices = this.state.selectedSpices.length >= 2;
        const hasSingleSpice = this.state.selectedSpices.length >= 1;
        
        const result = hasMinimumSelection && (hasProductAndSpice || hasMethodAndSpice || hasMultipleSpices) || hasSingleSpice;
        console.log('shouldShowExplanations:', result, 'spices:', this.state.selectedSpices.length, 'total:', totalSelected);
        return result;
    }
    
    hasSelections() {
        return this.state.selectedProducts.length > 0 || 
               this.state.selectedMethods.length > 0 || 
               this.state.selectedSpices.length > 0;
    }
    
    getSelectedItems(category) {
        const selectedKey = `selected${category.charAt(0).toUpperCase() + category.slice(1)}`;
        return this.state[selectedKey].map(id => 
            this.data[category].find(item => item.id === id)
        ).filter(Boolean);
    }
    
    getSelectedSpices() {
        return this.state.selectedSpices.map(id => 
            this.data.spices.find(spice => spice.id === id)
        ).filter(Boolean);
    }

    getSelectedMethods() {
        return this.state.selectedMethods.map(id => 
            this.data.methods.find(method => method.id === id)
        ).filter(Boolean);
    }

    reset() {
        this.setState({
            selectedProducts: [],
            selectedMethods: [],
            selectedSpices: [],
            incompatibleTags: { products: [], methods: [], spices: [] },
            mutuallyExcludedTags: { products: [], methods: [], spices: [] }
        });
    }
}

window.appState = new AppState();