import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, SearchInput, Badge, Button } from '../components';
import { dataLoader } from '../utils/data-loader';
import { Spice } from '../types';
import { ChefHat, Sparkles, TrendingUp } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [spices, setSpices] = useState<Spice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const spicesData = await dataLoader.loadSpices();
        setSpices(spicesData);
        setCategories(dataLoader.getSpiceCategories());
      } catch (error) {
        console.error('Error loading spices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredSpices = spices.filter(spice => {
    const matchesSearch = spice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || spice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularSpices = spices.slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка специй...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="text-primary" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Chi1i Bot
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Умный помощник для анализа совместимости специй и создания идеальных вкусовых сочетаний
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                Анализ совместимости
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Выберите специи, продукт и метод приготовления для получения детального анализа совместимости
              </p>
              <Button 
                onClick={() => navigate('/analysis')}
                className="w-full sm:w-auto"
              >
                Начать анализ
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-secondary" size={20} />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Специй в базе:</span>
                  <span className="font-semibold">{spices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Категорий:</span>
                  <span className="font-semibold">{categories.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Популярные специи</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularSpices.map(spice => (
              <Card key={spice.id} variant="default" className="hover:shadow-md transition-shadow">
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{spice.name}</h3>
                    <Badge variant="primary" size="sm">
                      {spice.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {spice.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {spice.taste_profile.slice(0, 3).map(taste => (
                      <Badge key={taste} variant="default" size="sm">
                        {taste}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card variant="default">
          <CardHeader>
            <CardTitle>Каталог специй</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SearchInput
                placeholder="Поиск специй..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
              
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedCategory === '' ? 'primary' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory('')}
                >
                  Все
                </Badge>
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'default'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {filteredSpices.map(spice => (
                  <div
                    key={spice.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/analysis?spice=${spice.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{spice.name}</span>
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: spice.color }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {spice.taste_profile.slice(0, 2).map(taste => (
                        <Badge key={taste} variant="default" size="sm">
                          {taste}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredSpices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Специи не найдены
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};