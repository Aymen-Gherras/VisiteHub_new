'use client';

import React from 'react';
import { FilterBar, FilterOptions } from '../ui/FilterBar';

interface PropertyFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalProperties: number;
  filteredCount: number;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  onFilterChange,
  totalProperties,
  filteredCount,
}) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar onFilterChange={onFilterChange} />
        
        <div className="mt-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredCount} propriété{filteredCount > 1 ? 's' : ''} trouvée{filteredCount > 1 ? 's' : ''}
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredCount === totalProperties 
                ? 'Toutes les propriétés' 
                : 'Résultats filtrés'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="newest">Plus récentes</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="surface_asc">Surface croissante</option>
              <option value="surface_desc">Surface décroissante</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};