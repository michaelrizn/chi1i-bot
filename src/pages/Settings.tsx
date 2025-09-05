import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components';
import { dataLoader } from '../utils/data-loader';
import { Settings as SettingsIcon, Database, Smartphone, Info, RefreshCw } from 'lucide-react';

interface AppSettings {
  hapticFeedback: boolean;
  darkMode: boolean;
  notifications: boolean;
  language: string;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    hapticFeedback: true,
    darkMode: false,
    notifications: true,
    language: 'ru'
  });
  const [dataStats, setDataStats] = useState({
    spices: 0,
    products: 0,
    cookingMethods: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('chi1i-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };

    const loadDataStats = async () => {
      try {
        const { spices, products, cookingMethods } = await dataLoader.loadAllData();
        setDataStats({
          spices: spices.length,
          products: products.length,
          cookingMethods: cookingMethods.length
        });
      } catch (error) {
        console.error('Error loading data stats:', error);
      }
    };

    loadSettings();
    loadDataStats();
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('chi1i-settings', JSON.stringify(newSettings));
    
    if (key === 'hapticFeedback' && value && (window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      dataLoader.clearCache();
      const { spices, products, cookingMethods } = await dataLoader.loadAllData();
      setDataStats({
        spices: spices.length,
        products: products.length,
        cookingMethods: cookingMethods.length
      });
      
      if (settings.hapticFeedback && (window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (settings.hapticFeedback && (window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        enabled ? 'bg-primary' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SettingsIcon className="text-primary" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Настройки
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Персонализируйте работу приложения
          </p>
        </header>

        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="text-primary" size={20} />
                Интерфейс и взаимодействие
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Тактильная обратная связь</h4>
                  <p className="text-sm text-gray-600">Вибрация при взаимодействии с элементами</p>
                </div>
                <ToggleSwitch
                  enabled={settings.hapticFeedback}
                  onChange={(value) => updateSetting('hapticFeedback', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Темная тема</h4>
                  <p className="text-sm text-gray-600">Переключение на темное оформление</p>
                </div>
                <ToggleSwitch
                  enabled={settings.darkMode}
                  onChange={(value) => updateSetting('darkMode', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Уведомления</h4>
                  <p className="text-sm text-gray-600">Получать уведомления о новых функциях</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications}
                  onChange={(value) => updateSetting('notifications', value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="text-secondary" size={20} />
                База данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">{dataStats.spices}</div>
                  <div className="text-sm text-gray-600">Специй</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary mb-1">{dataStats.products}</div>
                  <div className="text-sm text-gray-600">Продуктов</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-1">{dataStats.cookingMethods}</div>
                  <div className="text-sm text-gray-600">Методов</div>
                </div>
              </div>
              
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isRefreshing ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="animate-spin" size={16} />
                    Обновление...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    Обновить данные
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="text-accent" size={20} />
                О приложении
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Chi1i Bot</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Умный помощник для анализа совместимости специй и создания идеальных вкусовых сочетаний. 
                    Приложение использует научные данные о химических соединениях специй для предоставления 
                    точных рекомендаций.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">v1.0.0</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="default">TypeScript</Badge>
                    <Badge variant="success">PWA</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h5 className="font-medium text-gray-900 mb-2">Возможности:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Анализ совместимости специй с продуктами</li>
                    <li>• Рекомендации по методам приготовления</li>
                    <li>• Химический анализ взаимодействий</li>
                    <li>• Оценка вкусового профиля</li>
                    <li>• Предупреждения о несовместимости</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Данные основаны на научных исследованиях в области пищевой химии и кулинарии. 
                    Рекомендации носят информационный характер.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};