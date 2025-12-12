import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} DA`;
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export const getServiceTierInfo = (tier: 'basic' | 'premium_360') => {
  const tiers = {
    basic: {
      name: 'Formule Basique',
      color: 'green',
      icon: 'home',
      badge: 'Basique',
    },
    premium_360: {
      name: 'Premium 360°',
      color: 'orange',
      icon: 'vr-cardboard',
      badge: '360°',
    },
  };
  return tiers[tier];
};