import React from 'react';
import { cn } from '../utils/cn';
import { Search, X } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  clearable,
  onClear,
  className,
  value,
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';
  const errorStyles = error ? 'border-red-300 focus:ring-red-500' : '';
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          className={cn(
            baseStyles,
            errorStyles,
            icon ? 'pl-10' : '',
            clearable && value ? 'pr-10' : '',
            className
          )}
          value={value}
          {...props}
        />
        
        {clearable && value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

interface SearchInputProps extends Omit<InputProps, 'icon'> {
  onSearch?: (query: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(e);
    onSearch?.(value);
  };
  
  return (
    <Input
      icon={<Search size={18} />}
      placeholder="Поиск..."
      onChange={handleChange}
      clearable
      {...props}
    />
  );
};