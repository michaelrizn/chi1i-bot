import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg min-h-touch-sm',
    md: 'px-4 py-3 text-base rounded-xl min-h-touch',
    lg: 'px-6 py-4 text-lg rounded-xl min-h-touch-lg'
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};