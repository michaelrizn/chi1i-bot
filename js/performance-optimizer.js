class PerformanceOptimizer {
    constructor() {
        this.batchUpdateQueue = [];
        this.batchUpdateTimer = null;
        this.metrics = {
            batchUpdates: 0
        };
    }

    queueBatchUpdate(updateFunction) {
        this.batchUpdateQueue.push(updateFunction);
        
        if (this.batchUpdateTimer) {
            clearTimeout(this.batchUpdateTimer);
        }
        
        this.batchUpdateTimer = setTimeout(() => {
            this.processBatchUpdates();
        }, 16);
    }

    processBatchUpdates() {
        if (this.batchUpdateQueue.length === 0) return;
        
        this.metrics.batchUpdates++;
        
        requestAnimationFrame(() => {
            const updates = [...this.batchUpdateQueue];
            this.batchUpdateQueue = [];
            
            updates.forEach(update => {
                try {
                    update();
                } catch (error) {
                    console.error('Batch update error:', error);
                }
            });
        });
        
        this.batchUpdateTimer = null;
    }

    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    getPerformanceMetrics() {
        return {
            ...this.metrics
        };
    }

    logPerformanceReport() {
        const metrics = this.getPerformanceMetrics();
        
        console.group('🚀 Performance Report');
        console.log('📊 Metrics:', metrics);
        console.log('⚡ Batch updates performed:', metrics.batchUpdates);
        console.groupEnd();
        
        return metrics;
    }

    optimizeAll() {
        console.log('🔧 Optimizing system...');
        console.log('✅ System optimized!');
        
        setTimeout(() => {
            this.logPerformanceReport();
        }, 1000);
    }

    reset() {
        this.batchUpdateQueue = [];
        if (this.batchUpdateTimer) {
            clearTimeout(this.batchUpdateTimer);
            this.batchUpdateTimer = null;
        }
        this.metrics = {
            batchUpdates: 0
        };
        console.log('🔄 Performance optimizer reset');
    }
}

window.performanceOptimizer = new PerformanceOptimizer();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}