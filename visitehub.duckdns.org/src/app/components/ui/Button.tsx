import React from 'react';
// Update the import path to a relative path based on your project structure
import { cn } from '../../../data/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-green-600 to-lime-600 text-white hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 shadow-md',
    outline:
      'border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white',
    ghost: 'text-slate-700 hover:bg-slate-50',
  } as const;

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  } as const;

  const composedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn((children as any).props?.className, composedClassName),
      ...props,
    } as any);
  }

  return (
    <button className={composedClassName} {...props}>
      {children}
    </button>
  );
};