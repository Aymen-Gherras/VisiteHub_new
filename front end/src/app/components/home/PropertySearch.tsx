'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertyCard } from '../ui/PropertyCard';
import { apiService, Property } from '../../../api';
import { AdvancedFilterBar } from '../ui/AdvancedFilterBar';

interface FilterState {
  searchQuery: string;
  transactionType: 'tous' | 'vendre' | 'location';
  selectedWilaya: string;
  selectedDaira?: string;
  selectedPropertyType: string;
  selectedPropertyOwnerType: string;
  selectedPaymentConditions: string[];
  selectedSpecifications: string[];
  selectedPapers: string[];
}

const PropertySearch = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    transactionType: 'tous',
    selectedWilaya: '',
    selectedDaira: '',
    selectedPropertyType: '',
    selectedPropertyOwnerType: '',
    selectedPaymentConditions: [],
    selectedSpecifications: [],
    selectedPapers: []
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      !filters.searchQuery ||
      property.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (property as any).daira?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      property.wilaya.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesTransaction =
      filters.transactionType === 'tous' || property.transactionType === filters.transactionType;
    const matchesWilaya =
      !filters.selectedWilaya ||
      property.wilaya.toLowerCase().includes(filters.selectedWilaya.toLowerCase());
    const matchesDaira =
      !filters.selectedDaira ||
      (property as any).daira?.toLowerCase().includes(filters.selectedDaira.toLowerCase());
    const matchesType =
      !filters.selectedPropertyType || property.type === filters.selectedPropertyType;
    const matchesOwnerType =
      !filters.selectedPropertyOwnerType || property.propertyOwnerType === filters.selectedPropertyOwnerType;

    return matchesSearch && matchesTransaction && matchesWilaya && matchesDaira && matchesType && matchesOwnerType;
  });

  if (loading) {
    return (
      <section id="biens" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des biens...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="biens" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Trouvez maintenant la propriété de vos rêves en Algérie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez des propriétés dans 58 Wilaya différents représentés par 200 courtiers membres de premier plan.
          </p>
        </div>

        {/* Unified AdvancedFilterBar on home */}
        <AdvancedFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          className="mb-12"
        />

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { PropertySearch };
