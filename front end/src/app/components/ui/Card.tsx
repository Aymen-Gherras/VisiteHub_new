import React from 'react';
import { cn } from '../../../data/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hover = false,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-lg overflow-hidden',
        hover && 'transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl',
        className
      )}
    >
      {children}
    </div>
  );
};