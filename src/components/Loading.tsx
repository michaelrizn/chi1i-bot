import React from 'react';
import { cn } from '../utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  className,
  text
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-200 border-t-primary',
            sizes[size]
          )}
        />
        {text && (
          <p className="text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Загрузка...'
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <Loading size="lg" text={text} />
      </div>
    </div>
  );
};