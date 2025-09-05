import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: string | number;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string | number) => void;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = 'Выберите опцию',
  label,
  error,
  disabled,
  className,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };
  
  const baseStyles = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';
  const errorStyles = error ? 'border-red-300 focus:ring-red-500' : '';
  
  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div ref={selectRef}>
        <div
          className={cn(
            baseStyles,
            errorStyles,
            isOpen ? 'ring-2 ring-primary border-transparent' : '',
            'flex items-center justify-between'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={cn(
              'text-gray-400 transition-transform duration-200',
              isOpen ? 'rotate-180' : ''
            )}
          />
        </div>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'px-4 py-3 cursor-pointer transition-colors flex items-center justify-between',
                  option.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-900 hover:bg-gray-50',
                  option.value === value ? 'bg-primary/5 text-primary' : ''
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check size={16} className="text-primary" />
                )}
              </div>
            ))}
          </div>
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