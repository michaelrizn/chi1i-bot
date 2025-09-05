export interface Spice {
  id: number;
  name: string;
  category: string;
  color: string;
  chemical_compounds: string[];
  compatible_methods: string[];
  incompatible_spices: string[];
  taste_profile: string[];
  best_products: string[];
  description: string;
}

export interface Product {
  id: number
  name: string
  category: string
  compatible_spices: number[]
}

export interface CookingMethod {
  id: number;
  name: string;
  description: string;
  temperature_range: string;
  chemical_effects: string[];
  spice_transformations: {
    volatile_oils?: string;
    phenolic_compounds?: string;
    alkaloids?: string;
    water_soluble_compounds?: string;
    heat_sensitive_vitamins?: string;
    heat_sensitive_compounds?: string;
    enzymes?: string;
    fat_soluble_compounds?: string;
    aromatic_precursors?: string;
    fat_soluble_vitamins?: string;
    aromatic_compounds?: string;
    aromatic_esters?: string;
    minerals?: string;
    complex_compounds?: string;
    complex_aromatics?: string;
    terpenes?: string;
    aromatic_aldehydes?: string;
  };
  texture_changes: string;
  flavor_development: string;
}

export interface SpiceGroup {
  id: string
  name: string
  description: string
  spices: number[]
  compatibility_notes?: string
}

export interface CompatibilityAnalysis {
  conflicts: {
    spice1: number
    spice2: number
    reason: string
    severity: 'low' | 'medium' | 'high'
  }[]
  synergies: {
    spices: number[]
    effect: string
    strength: number
  }[]
  recommendations: {
    type: 'add' | 'remove' | 'reduce'
    spice: number
    reason: string
  }[]
  overall_score: number
}

export interface AppState {
  selectedProducts: number[]
  selectedMethods: number[]
  blendSpices: number[]
  language: 'ru' | 'en'
  theme: 'light' | 'dark'
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color: string
    text_color: string
    hint_color: string
    link_color: string
    button_color: string
    button_text_color: string
  }
  ready(): void
  expand(): void
  close(): void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show(): void
    hide(): void
    enable(): void
    disable(): void
    onClick(callback: () => void): void
  }
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
    notificationOccurred(type: 'error' | 'success' | 'warning'): void
    selectionChanged(): void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}