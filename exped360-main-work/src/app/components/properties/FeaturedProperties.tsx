'use client';

import React from 'react';
import { Property } from '../../../api';
import { PropertyCard } from '../ui/PropertyCard';

interface FeaturedPropertiesProps {
  properties: Property[];
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ properties }) => {
  if (!properties || properties.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
};