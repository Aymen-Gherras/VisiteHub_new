import React from 'react';
// Update the import path below to the correct relative path where your 'utils' file is located.
// For example, if 'utils.ts' is in 'src/data/utils.ts', use the following:
import { cn } from '../../../data/utils';
// Adjust the path as needed based on your project structure.

interface BadgeProps {
  variant?: 'basic' | 'premium' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'basic',
  children,
  className,
}) => {
  const variants = {
    basic: 'bg-green-500 text-white',
    premium: 'bg-gradient-to-r from-green-600 to-lime-600 text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};