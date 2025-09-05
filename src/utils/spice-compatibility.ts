import { Spice, Product, CookingMethod, CompatibilityAnalysis } from '../types';

export class SpiceCompatibilityAnalyzer {
  private spices: Spice[];
  private products: Product[];
  private cookingMethods: CookingMethod[];

  constructor(spices: Spice[], products: Product[], cookingMethods: CookingMethod[]) {
    this.spices = spices;
    this.products = products;
    this.cookingMethods = cookingMethods;
  }

  analyzeCompatibility(
    selectedSpices: number[],
    productId: number,
    cookingMethodId: number
  ): CompatibilityAnalysis {
    const product = this.products.find(p => p.id === productId);
    const cookingMethod = this.cookingMethods.find(m => m.id === cookingMethodId);
    const spiceObjects = selectedSpices.map(id => this.spices.find(s => s.id === id)).filter(Boolean) as Spice[];

    if (!product || !cookingMethod || spiceObjects.length === 0) {
      return {
        overall_score: 0,
        compatibility_level: 'poor',
        recommendations: ['Выберите специи, продукт и метод приготовления'],
        warnings: ['Недостаточно данных для анализа'],
        chemical_interactions: [],
        flavor_profile: {
          dominant_notes: [],
          balance_score: 0,
          complexity: 0
        }
      };
    }

    const productScore = this.calculateProductCompatibility(spiceObjects, product);
    const methodScore = this.calculateMethodCompatibility(spiceObjects, cookingMethod);
    const spiceHarmonyScore = this.calculateSpiceHarmony(spiceObjects);
    const chemicalScore = this.calculateChemicalCompatibility(spiceObjects, product, cookingMethod);

    const overallScore = (productScore + methodScore + spiceHarmonyScore + chemicalScore) / 4;
    
    return {
      overall_score: Math.round(overallScore * 100) / 100,
      compatibility_level: this.getCompatibilityLevel(overallScore),
      recommendations: this.generateRecommendations(spiceObjects, product, cookingMethod, overallScore),
      warnings: this.generateWarnings(spiceObjects, product, cookingMethod),
      chemical_interactions: this.analyzeChemicalInteractions(spiceObjects, product, cookingMethod),
      flavor_profile: this.analyzeFlavorProfile(spiceObjects)
    };
  }

  private calculateProductCompatibility(spices: Spice[], product: Product): number {
    let totalScore = 0;
    let validSpices = 0;

    spices.forEach(spice => {
      if (spice.best_products.includes(product.category) || 
          spice.best_products.includes(product.name)) {
        totalScore += 1.0;
      } else if (this.hasFlavorSynergy(spice, product)) {
        totalScore += 0.7;
      } else {
        totalScore += 0.3;
      }
      validSpices++;
    });

    return validSpices > 0 ? totalScore / validSpices : 0;
  }

  private calculateMethodCompatibility(spices: Spice[], method: CookingMethod): number {
    let totalScore = 0;
    let validSpices = 0;

    spices.forEach(spice => {
      if (spice.compatible_methods.includes(method.name)) {
        totalScore += 1.0;
      } else if (this.isMethodSuitable(spice, method)) {
        totalScore += 0.6;
      } else {
        totalScore += 0.2;
      }
      validSpices++;
    });

    return validSpices > 0 ? totalScore / validSpices : 0;
  }

  private calculateSpiceHarmony(spices: Spice[]): number {
    if (spices.length < 2) return 1.0;

    let harmonyScore = 0;
    let comparisons = 0;

    for (let i = 0; i < spices.length; i++) {
      for (let j = i + 1; j < spices.length; j++) {
        const spice1 = spices[i];
        const spice2 = spices[j];

        if (spice1.incompatible_spices.includes(spice2.name) ||
            spice2.incompatible_spices.includes(spice1.name)) {
          harmonyScore += 0.1;
        } else if (this.haveTasteHarmony(spice1, spice2)) {
          harmonyScore += 1.0;
        } else if (this.haveChemicalSynergy(spice1, spice2)) {
          harmonyScore += 0.8;
        } else {
          harmonyScore += 0.5;
        }
        comparisons++;
      }
    }

    return comparisons > 0 ? harmonyScore / comparisons : 1.0;
  }

  private calculateChemicalCompatibility(spices: Spice[], product: Product, method: CookingMethod): number {
    let compatibilityScore = 0;
    let factors = 0;

    spices.forEach(spice => {
      spice.chemical_compounds.forEach(compound => {
        if (product.cooking_reactions.some(reaction => 
            this.isChemicallyCompatible(compound, reaction))) {
          compatibilityScore += 0.3;
        }
        
        if (method.chemical_effects.some(effect => 
            this.enhancesChemicalReaction(compound, effect))) {
          compatibilityScore += 0.4;
        }
        
        factors++;
      });
    });

    return factors > 0 ? Math.min(compatibilityScore / factors, 1.0) : 0.5;
  }

  private hasFlavorSynergy(spice: Spice, product: Product): boolean {
    return spice.taste_profile.some(taste => 
      product.flavor_compounds.some(compound => 
        this.flavorCompoundsMatch(taste, compound)
      )
    );
  }

  private isMethodSuitable(spice: Spice, method: CookingMethod): boolean {
    const temperatureRange = this.parseTemperatureRange(method.temperature_range);
    
    if (temperatureRange.max > 200 && spice.chemical_compounds.includes('эфирные масла')) {
      return false;
    }
    
    if (temperatureRange.max < 80 && spice.chemical_compounds.includes('алкалоиды')) {
      return false;
    }
    
    return true;
  }

  private haveTasteHarmony(spice1: Spice, spice2: Spice): boolean {
    const complementaryPairs = [
      ['сладкий', 'острый'],
      ['кислый', 'сладкий'],
      ['горький', 'сладкий'],
      ['умами', 'кислый']
    ];

    return complementaryPairs.some(pair => 
      (spice1.taste_profile.includes(pair[0]) && spice2.taste_profile.includes(pair[1])) ||
      (spice1.taste_profile.includes(pair[1]) && spice2.taste_profile.includes(pair[0]))
    );
  }

  private haveChemicalSynergy(spice1: Spice, spice2: Spice): boolean {
    const synergyPairs = [
      ['куркумин', 'пиперин'],
      ['капсаицин', 'ванилин'],
      ['ментол', 'лимонен']
    ];

    return synergyPairs.some(pair => 
      (spice1.chemical_compounds.includes(pair[0]) && spice2.chemical_compounds.includes(pair[1])) ||
      (spice1.chemical_compounds.includes(pair[1]) && spice2.chemical_compounds.includes(pair[0]))
    );
  }

  private isChemicallyCompatible(compound: string, reaction: string): boolean {
    const compatibilityMap: Record<string, string[]> = {
      'куркумин': ['реакция Майяра', 'окисление'],
      'капсаицин': ['липидное окисление', 'денатурация белков'],
      'ванилин': ['карамелизация', 'реакция Майяра'],
      'ментол': ['экстракция', 'эмульгирование']
    };

    return compatibilityMap[compound]?.includes(reaction) || false;
  }

  private enhancesChemicalReaction(compound: string, effect: string): boolean {
    const enhancementMap: Record<string, string[]> = {
      'эфирные масла': ['экстракция', 'концентрация ароматов'],
      'алкалоиды': ['денатурация белков', 'экстракция'],
      'фенольные соединения': ['антиоксидантная активность', 'стабилизация']
    };

    return enhancementMap[compound]?.includes(effect) || false;
  }

  private flavorCompoundsMatch(taste: string, compound: string): boolean {
    const matchMap: Record<string, string[]> = {
      'сладкий': ['глутамат', 'сахара', 'фруктоза'],
      'умами': ['глутамат', 'инозинат', 'гуанилат'],
      'кислый': ['органические кислоты', 'лимонная кислота']
    };

    return matchMap[taste]?.includes(compound) || false;
  }

  private parseTemperatureRange(range: string): { min: number; max: number } {
    const matches = range.match(/(\d+)(?:-(\d+))?°C/);
    if (!matches) return { min: 20, max: 100 };
    
    const min = parseInt(matches[1]);
    const max = matches[2] ? parseInt(matches[2]) : min;
    
    return { min, max };
  }

  private getCompatibilityLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'fair';
    return 'poor';
  }

  private generateRecommendations(spices: Spice[], product: Product, method: CookingMethod, score: number): string[] {
    const recommendations: string[] = [];

    if (score < 0.6) {
      recommendations.push('Рассмотрите альтернативные специи для данного продукта');
    }

    const temperatureRange = this.parseTemperatureRange(method.temperature_range);
    if (temperatureRange.max > 180) {
      const volatileSpices = spices.filter(s => s.chemical_compounds.includes('эфирные масла'));
      if (volatileSpices.length > 0) {
        recommendations.push('Добавьте специи с эфирными маслами в конце приготовления');
      }
    }

    if (spices.length > 5) {
      recommendations.push('Уменьшите количество специй для лучшего баланса вкуса');
    }

    return recommendations;
  }

  private generateWarnings(spices: Spice[], product: Product, method: CookingMethod): string[] {
    const warnings: string[] = [];

    spices.forEach(spice => {
      spice.incompatible_spices.forEach(incompatible => {
        if (spices.some(s => s.name === incompatible)) {
          warnings.push(`${spice.name} несовместим с ${incompatible}`);
        }
      });
    });

    const temperatureRange = this.parseTemperatureRange(method.temperature_range);
    if (temperatureRange.max > 200) {
      const sensitiveSpices = spices.filter(s => 
        s.chemical_compounds.includes('витамины') || 
        s.chemical_compounds.includes('эфирные масла')
      );
      if (sensitiveSpices.length > 0) {
        warnings.push('Высокая температура может разрушить полезные соединения');
      }
    }

    return warnings;
  }

  private analyzeChemicalInteractions(spices: Spice[], product: Product, method: CookingMethod): string[] {
    const interactions: string[] = [];

    spices.forEach(spice => {
      spice.chemical_compounds.forEach(compound => {
        method.chemical_effects.forEach(effect => {
          if (this.enhancesChemicalReaction(compound, effect)) {
            interactions.push(`${compound} усиливает ${effect}`);
          }
        });
      });
    });

    return interactions;
  }

  private analyzeFlavorProfile(spices: Spice[]): {
    dominant_notes: string[];
    balance_score: number;
    complexity: number;
  } {
    const allTastes = spices.flatMap(s => s.taste_profile);
    const tasteCounts = allTastes.reduce((acc, taste) => {
      acc[taste] = (acc[taste] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominant_notes = Object.entries(tasteCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([taste]) => taste);

    const uniqueTastes = Object.keys(tasteCounts).length;
    const totalTastes = allTastes.length;
    
    const balance_score = uniqueTastes / Math.max(totalTastes, 1);
    const complexity = Math.min(uniqueTastes / 5, 1);

    return {
      dominant_notes,
      balance_score: Math.round(balance_score * 100) / 100,
      complexity: Math.round(complexity * 100) / 100
    };
  }
}

export const createCompatibilityAnalyzer = (spices: Spice[], products: Product[], cookingMethods: CookingMethod[]) => {
  return new SpiceCompatibilityAnalyzer(spices, products, cookingMethods);
};