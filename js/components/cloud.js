class CloudRenderer {
    constructor() {
        this.eventHandlers = new Map();
    }
    
    createElement(item, type) {
        const element = document.createElement('div');
        element.className = 'cloud-item';
        element.textContent = item.name;
        
        if (item.color) {
            element.style.backgroundColor = item.color;
            element.style.color = this.getContrastColor(item.color);
        }
        
        element.dataset.itemId = item.id;
        element.dataset.itemType = type;
        
        element.addEventListener('click', () => {
            const isSelected = element.classList.contains('selected');
            
            if (isSelected) {
                element.classList.remove('selected');
                this.dispatchEvent('itemDeselected', {
                    type: type,
                    id: item.id,
                    name: item.name
                });
            } else {
                element.classList.add('selected');
                this.dispatchEvent('itemSelected', {
                    type: type,
                    id: item.id,
                    name: item.name
                });
            }
            
            this.triggerHaptic();
        });
        
        return element;
    }
    
    renderProducts(containerId, products) {
        const container = typeof containerId === 'string' 
            ? document.getElementById(containerId) 
            : containerId;
            
        if (!container) {
            console.error('Products container not found:', containerId);
            return;
        }
        
        container.innerHTML = '';
        container.className = 'cloud-container products-cloud';
        
        products.forEach(product => {
            const element = this.createElement(product, 'product');
            container.appendChild(element);
        });
    }
    
    renderCookingMethods(containerId, methods) {
        const container = typeof containerId === 'string' 
            ? document.getElementById(containerId) 
            : containerId;
            
        if (!container) {
            console.error('Methods container not found:', containerId);
            return;
        }
        
        container.innerHTML = '';
        container.className = 'cloud-container methods-cloud';
        
        methods.forEach(method => {
            const element = this.createElement(method, 'method');
            container.appendChild(element);
        });
    }
    
    renderSpices(containerId, spices) {
        const container = typeof containerId === 'string' 
            ? document.getElementById(containerId) 
            : containerId;
            
        if (!container) {
            console.error('Spices container not found:', containerId);
            return;
        }
        
        container.innerHTML = '';
        container.className = 'cloud-container spices-cloud';
        
        const spicesByCategory = this.groupSpicesByCategory(spices);
        
        Object.entries(spicesByCategory).forEach(([category, categorySpices]) => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'spice-category';
            categoryElement.innerHTML = `<h4 class="category-title">${category}</h4>`;
            
            const spicesContainer = document.createElement('div');
            spicesContainer.className = 'category-spices';
            
            categorySpices.forEach(spice => {
                const element = this.createElement(spice, 'spice');
                spicesContainer.appendChild(element);
            });
            
            categoryElement.appendChild(spicesContainer);
            container.appendChild(categoryElement);
        });
    }
    
    renderBlend(container, selectedSpices) {
        container.innerHTML = '';
        
        selectedSpices.forEach(spiceId => {
            const spice = window.SPICES_DATA.find(s => s.id === spiceId);
            if (!spice) return;
            
            const element = this.createBlendItem(spice);
            
            const removeBtn = element.querySelector('.remove-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dispatchEvent('spiceSelected', spice.id);
                this.triggerHaptic('light');
            });
            
            container.appendChild(element);
        });
    }
    
    renderCompounds(container, compounds) {
        container.innerHTML = '';
        
        compounds.forEach(compound => {
            const element = this.createCompoundItem(compound);
            container.appendChild(element);
        });
    }
    
    createCloudItem(config) {
        const element = document.createElement('div');
        element.className = 'cloud-item';
        element.textContent = config.text;
        element.dataset.id = config.id;
        element.dataset.type = config.type;
        
        if (config.selected) {
            element.classList.add('selected');
        }
        
        if (config.incompatible && !config.selected) {
            element.classList.add('incompatible');
        }
        
        if (config.color) {
            element.style.backgroundColor = config.color;
            element.style.color = this.getContrastColor(config.color);
        }
        
        if (config.category) {
            element.classList.add(`category-${config.category}`);
        }
        
        return element;
    }
    
    createBlendItem(spice) {
        const element = document.createElement('div');
        element.className = 'blend-item';
        element.style.backgroundColor = spice.color;
        element.style.color = this.getContrastColor(spice.color);
        
        element.innerHTML = `
            <span class="blend-item-name">${spice.name}</span>
            <button class="remove-btn" aria-label="Удалить ${spice.name}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        return element;
    }
    
    createCompoundItem(compound) {
        const element = document.createElement('div');
        element.className = 'compound-item';
        element.textContent = compound.name;
        
        if (compound.type) {
            element.classList.add(`compound-${compound.type}`);
        }
        
        if (compound.spices && compound.spices.length > 1) {
            element.classList.add('synergistic');
            element.title = `Содержится в: ${compound.spices.join(', ')}`;
        }
        
        return element;
    }
    
    groupSpicesByCategory(spices) {
        const categories = {};
        
        spices.forEach(spice => {
            if (!categories[spice.category]) {
                categories[spice.category] = [];
            }
            categories[spice.category].push(spice);
        });
        
        return categories;
    }
    
    getContrastColor(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }
    
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    triggerHaptic(type) {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
        }
    }
}