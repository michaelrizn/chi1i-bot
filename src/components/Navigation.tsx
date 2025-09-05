import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Home, FlaskConical, Settings } from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  {
    path: '/',
    icon: <Home size={20} />,
    label: 'Главная'
  },
  {
    path: '/analysis',
    icon: <FlaskConical size={20} />,
    label: 'Анализ'
  },
  {
    path: '/settings',
    icon: <Settings size={20} />,
    label: 'Настройки'
  }
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-h-touch-sm',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <div className={cn(
                'transition-transform duration-200',
                isActive ? 'scale-110' : ''
              )}>
                {item.icon}
              </div>
              <span className={cn(
                'text-xs mt-1 font-medium transition-colors',
                isActive ? 'text-primary' : 'text-gray-500'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};