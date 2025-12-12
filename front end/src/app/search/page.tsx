'use client';

import React, { useState, useMemo } from 'react';
import { PropertyCard } from '../components/ui/PropertyCard';
import { apiService, Property } from '../../api';

type FilterOptions = {
  propertyType: string;
  priceRange: string;
  location: string;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    propertyType: '',
    priceRange: '',
    location: ''
  });

  // Fetch properties on component mount
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProperties();
        setProperties(data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property: any) => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !filters.propertyType || property.type === filters.propertyType;
      const matchesLocation = !filters.location || property.city.toLowerCase().includes(filters.location.toLowerCase()) || 
                             property.wilaya.toLowerCase().includes(filters.location.toLowerCase());

      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        matchesPrice = property.price >= min && (!max || property.price <= max);
      }

      return matchesSearch && matchesType && matchesLocation && matchesPrice;
    });
  }, [searchQuery, filters, properties]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Rechercher une propriété</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par titre ou description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchQuery('')}
          >
            {searchQuery && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredProperties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
          {filteredProperties.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Aucune propriété ne correspond à vos critères de recherche.
            </div>
          )}
        </div>
      )}
    </main>
  );
}