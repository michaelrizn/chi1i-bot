import { Spice, Product, CookingMethod } from '../types';

export class DataLoader {
  private static instance: DataLoader;
  private spicesCache: Spice[] | null = null;
  private productsCache: Product[] | null = null;
  private cookingMethodsCache: CookingMethod[] | null = null;

  private constructor() {}

  static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  async loadSpices(): Promise<Spice[]> {
    if (this.spicesCache) {
      return this.spicesCache;
    }

    try {
      const response = await fetch('/chi1i-bot/data/spices.json');
      if (!response.ok) {
        throw new Error(`Failed to load spices: ${response.statusText}`);
      }
      const data = await response.json();
      this.spicesCache = Array.isArray(data) ? data : [];
      return this.spicesCache;
    } catch (error) {
      console.error('Error loading spices:', error);
      this.spicesCache = [];
      return [];
    }
  }

  async loadProducts(): Promise<Product[]> {
    if (this.productsCache) {
      return this.productsCache;
    }

    try {
      const response = await fetch('/chi1i-bot/data/products.json');
      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.statusText}`);
      }
      const data = await response.json();
      this.productsCache = Array.isArray(data) ? data : [];
      return this.productsCache;
    } catch (error) {
      console.error('Error loading products:', error);
      this.productsCache = [];
      return [];
    }
  }

  async loadCookingMethods(): Promise<CookingMethod[]> {
    if (this.cookingMethodsCache) {
      return this.cookingMethodsCache;
    }

    try {
      const response = await fetch('/chi1i-bot/data/cooking-methods.json');
      if (!response.ok) {
        throw new Error(`Failed to load cooking methods: ${response.statusText}`);
      }
      const data = await response.json();
      this.cookingMethodsCache = Array.isArray(data) ? data : [];
      return this.cookingMethodsCache;
    } catch (error) {
      console.error('Error loading cooking methods:', error);
      this.cookingMethodsCache = [];
      return [];
    }
  }

  async loadAllData(): Promise<{
    spices: Spice[];
    products: Product[];
    cookingMethods: CookingMethod[];
  }> {
    const [spices, products, cookingMethods] = await Promise.all([
      this.loadSpices(),
      this.loadProducts(),
      this.loadCookingMethods()
    ]);

    return { spices, products, cookingMethods };
  }

  clearCache(): void {
    this.spicesCache = null;
    this.productsCache = null;
    this.cookingMethodsCache = null;
  }

  getSpiceById(id: number): Spice | undefined {
    return this.spicesCache?.find(spice => spice.id === id);
  }

  getProductById(id: number): Product | undefined {
    return this.productsCache?.find(product => product.id === id);
  }

  getCookingMethodById(id: number): CookingMethod | undefined {
    return this.cookingMethodsCache?.find(method => method.id === id);
  }

  searchSpices(query: string): Spice[] {
    if (!this.spicesCache || !query.trim()) {
      return this.spicesCache || [];
    }

    const searchTerm = query.toLowerCase().trim();
    return this.spicesCache.filter(spice => 
      spice.name.toLowerCase().includes(searchTerm) ||
      spice.category.toLowerCase().includes(searchTerm) ||
      spice.taste_profile.some(taste => taste.toLowerCase().includes(searchTerm)) ||
      spice.description.toLowerCase().includes(searchTerm)
    );
  }

  searchProducts(query: string): Product[] {
    if (!this.productsCache || !query.trim()) {
      return this.productsCache || [];
    }

    const searchTerm = query.toLowerCase().trim();
    return this.productsCache.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  getSpicesByCategory(category: string): Spice[] {
    if (!this.spicesCache) return [];
    return this.spicesCache.filter(spice => spice.category === category);
  }

  getProductsByCategory(category: string): Product[] {
    if (!this.productsCache) return [];
    return this.productsCache.filter(product => product.category === category);
  }

  getSpiceCategories(): string[] {
    if (!this.spicesCache) return [];
    return [...new Set(this.spicesCache.map(spice => spice.category))];
  }

  getProductCategories(): string[] {
    if (!this.productsCache) return [];
    return [...new Set(this.productsCache.map(product => product.category))];
  }
}

export const dataLoader = DataLoader.getInstance();