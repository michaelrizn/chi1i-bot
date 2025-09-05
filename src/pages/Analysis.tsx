import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Select, Badge, Loading } from '../components';
import { dataLoader } from '../utils/data-loader';
import { createCompatibilityAnalyzer } from '../utils/spice-compatibility';
import { Spice, Product, CookingMethod, CompatibilityAnalysis } from '../types';
import { FlaskConical, AlertTriangle, CheckCircle, TrendingUp, Zap } from 'lucide-react';

export const Analysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [spices, setSpices] = useState<Spice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cookingMethods, setCookingMethods] = useState<CookingMethod[]>([]);
  const [selectedSpices, setSelectedSpices] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>();
  const [selectedMethod, setSelectedMethod] = useState<number | undefined>();
  const [analysis, setAnalysis] = useState<CompatibilityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { spices: spicesData, products: productsData, cookingMethods: methodsData } = await dataLoader.loadAllData();
        setSpices(spicesData);
        setProducts(productsData);
        setCookingMethods(methodsData);
        
        const preselectedSpice = searchParams.get('spice');
        if (preselectedSpice) {
          setSelectedSpices([parseInt(preselectedSpice)]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const handleSpiceToggle = (spiceId: number) => {
    setSelectedSpices(prev => 
      prev.includes(spiceId) 
        ? prev.filter(id => id !== spiceId)
        : [...prev, spiceId]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSpices.length === 0 || !selectedProduct || !selectedMethod) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analyzer = createCompatibilityAnalyzer(spices, products, cookingMethods);
      const result = analyzer.analyzeCompatibility(selectedSpices, selectedProduct, selectedMethod);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCompatibilityColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCompatibilityText = (level: string) => {
    switch (level) {
      case 'excellent': return 'Отлично';
      case 'good': return 'Хорошо';
      case 'fair': return 'Удовлетворительно';
      case 'poor': return 'Плохо';
      default: return 'Неизвестно';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loading size="lg" text="Загрузка данных..." />
      </div>
    );
  }

  const spiceOptions = spices.map(spice => ({
    value: spice.id,
    label: spice.name
  }));

  const productOptions = products.map(product => ({
    value: product.id,
    label: product.name
  }));

  const methodOptions = cookingMethods.map(method => ({
    value: method.id,
    label: method.name
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FlaskConical className="text-primary" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Анализ совместимости
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Выберите специи, продукт и метод приготовления для получения детального анализа
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Выбор специй</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {spices.map(spice => (
                    <div
                      key={spice.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSpices.includes(spice.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSpiceToggle(spice.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{spice.name}</span>
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: spice.color }}
                        />
                      </div>
                      <Badge variant="default" size="sm">
                        {spice.category}
                      </Badge>
                    </div>
                  ))}
                </div>
                {selectedSpices.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Выбрано специй: {selectedSpices.length}</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSpices.map(spiceId => {
                        const spice = spices.find(s => s.id === spiceId);
                        return spice ? (
                          <Badge key={spiceId} variant="primary" size="sm">
                            {spice.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Параметры приготовления</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Продукт"
                  options={productOptions}
                  value={selectedProduct}
                  placeholder="Выберите продукт"
                  onChange={(value) => setSelectedProduct(Number(value))}
                />
                
                <Select
                  label="Метод приготовления"
                  options={methodOptions}
                  value={selectedMethod}
                  placeholder="Выберите метод"
                  onChange={(value) => setSelectedMethod(Number(value))}
                />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleAnalyze}
                  disabled={selectedSpices.length === 0 || !selectedProduct || !selectedMethod || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Анализирую...
                    </div>
                  ) : (
                    'Анализировать совместимость'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            {analysis ? (
              <div className="space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="text-primary" size={20} />
                      Результат анализа
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {Math.round(analysis.overall_score * 100)}%
                      </div>
                      <div className={`inline-flex px-4 py-2 rounded-full font-medium ${getCompatibilityColor(analysis.compatibility_level)}`}>
                        {getCompatibilityText(analysis.compatibility_level)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Zap className="text-yellow-500" size={16} />
                          Вкусовой профиль
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {analysis.flavor_profile.dominant_notes.map(note => (
                              <Badge key={note} variant="secondary" size="sm">
                                {note}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">
                            Баланс: {Math.round(analysis.flavor_profile.balance_score * 100)}% • 
                            Сложность: {Math.round(analysis.flavor_profile.complexity * 100)}%
                          </div>
                        </div>
                      </div>

                      {analysis.chemical_interactions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <FlaskConical className="text-blue-500" size={16} />
                            Химические взаимодействия
                          </h4>
                          <div className="space-y-1">
                            {analysis.chemical_interactions.map((interaction, index) => (
                              <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                                {interaction}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="text-green-500" size={16} />
                            Рекомендации
                          </h4>
                          <div className="space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                              <div key={index} className="text-sm bg-green-50 p-2 rounded">
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.warnings.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={16} />
                            Предупреждения
                          </h4>
                          <div className="space-y-1">
                            {analysis.warnings.map((warning, index) => (
                              <div key={index} className="text-sm bg-red-50 p-2 rounded">
                                {warning}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card variant="default" className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center text-gray-500">
                    <FlaskConical size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Выберите специи, продукт и метод приготовления для начала анализа</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};