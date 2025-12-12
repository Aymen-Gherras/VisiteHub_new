'use client';

import React from 'react';
import { Property } from '../../../api';
import { PropertyCard } from '../ui/PropertyCard';

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {properties.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Aucune proprié
          té ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
};