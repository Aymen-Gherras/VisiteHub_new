import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { cn } from '../../../data/utils';
import { PropertyType } from '../../../data/property';
import { apiService } from '../../../api';

export interface FilterOptions {
  propertyType: PropertyType | 'all';
  transactionType: 'vendre' | 'location' | 'all';
  priceRange: [number, number];
  wilaya: string;
  daira?: string;
  bedrooms: [number, number] | 'all';
  bathrooms: [number, number] | 'all';
  surface: [number, number];
  has360Tour: boolean | 'all';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'surface_asc' | 'surface_desc' | 'most_viewed';
}

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

const propertyTypes: { value: PropertyType; label: string; icon: string }[] = [
  { value: 'apartment', label: 'Appartement', icon: '🏢' },
  { value: 'house', label: 'Maison', icon: '🏠' },
  { value: 'villa', label: 'Villa', icon: '🏡' },
  { value: 'commercial', label: 'Commercial', icon: '🏪' },
  { value: 'land', label: 'Terrain', icon: '🌱' },
];

const initialWilayas: string[] = [];

const transactionTypes = [
  { value: 'vendre', label: 'Vente', icon: '💰' },
  { value: 'location', label: 'Location', icon: '📋' },
];

const sortOptions = [
  { value: 'newest', label: 'Plus récentes', icon: '🕒' },
  { value: 'price_asc', label: 'Prix croissant', icon: '📈' },
  { value: 'price_desc', label: 'Prix décroissant', icon: '📉' },
  { value: 'surface_asc', label: 'Surface croissante', icon: '📏' },
  { value: 'surface_desc', label: 'Surface décroissante', icon: '📐' },
  { value: 'most_viewed', label: 'Plus vues', icon: '👁️' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [wilayas, setWilayas] = useState<string[]>(initialWilayas);
  const [availableDairas, setAvailableDairas] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    propertyType: 'all',
    transactionType: 'all',
    priceRange: [0, 5000000],
    wilaya: '',
    daira: '',
    bedrooms: 'all',
    bathrooms: 'all',
    surface: [0, 500],
    has360Tour: 'all',
    sortBy: 'newest',
  });

  useEffect(() => {
    let mounted = true;
    apiService.listWilayas()
      .then((w) => {
        if (!mounted) return;
        const sorted = [...w].sort((a, b) => a.localeCompare(b, 'fr'));
        setWilayas(sorted);
        if (filters.wilaya) {
          apiService.listDairas(filters.wilaya).then((d) => {
            if (!mounted) return;
            setAvailableDairas(d || []);
          }).catch(() => {});
        }
      })
      .catch(() => {
        // ignore
      });
    return () => { mounted = false; };
  }, []);

  // Keep dairas synced when wilaya changes
  useEffect(() => {
    if (!filters.wilaya) {
      setAvailableDairas([]);
      return;
    }
    let cancelled = false;
    apiService.listDairas(filters.wilaya)
      .then((d) => { if (!cancelled) setAvailableDairas(d || []); })
      .catch(() => { if (!cancelled) setAvailableDairas([]); });
    return () => { cancelled = true; };
  }, [filters.wilaya]);

  const handleFilterChange = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleWilayaChange = (wilaya: string) => {
    handleFilterChange('wilaya', wilaya);
    apiService.listDairas(wilaya)
      .then((d) => setAvailableDairas(d || []))
      .catch(() => setAvailableDairas([]));
    // reset daira when wilaya changes
    handleFilterChange('daira', '');
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      propertyType: 'all',
      transactionType: 'all',
      priceRange: [0, 5000000],
      wilaya: '',
      daira: '',
      bedrooms: 'all',
      bathrooms: 'all',
      surface: [0, 500],
      has360Tour: 'all',
      sortBy: 'newest',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('fr-FR')} DA`;
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy') return false; // Don't count sort as a filter
    if (value === 'all' || value === '') return false;
    if (Array.isArray(value)) {
      if (key === 'priceRange' && value[0] === 0 && value[1] === 5000000) return false;
      if (key === 'surface' && value[0] === 0 && value[1] === 500) return false;
      if (key === 'bedrooms' && value[0] === 0 && value[1] === 10) return false;
      if (key === 'bathrooms' && value[0] === 0 && value[1] === 10) return false;
    }
    return true;
  }).length;

  return (
    <div className={cn('bg-white border border-gray-200 rounded-2xl shadow-sm', className)}>
      {/* Main Filter Bar */}
      <div className="p-6">
        <div className="flex flex-wrap items-end gap-6">
          {/* Property Type Filter */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de bien
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value as PropertyType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Transaction
            </label>
            <select
              value={filters.transactionType}
              onChange={(e) => handleFilterChange('transactionType', e.target.value as 'vendre' | 'location' | 'all')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Toutes</option>
              {transactionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Wilaya Filter */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Wilaya
            </label>
            <select
              value={filters.wilaya}
              onChange={(e) => handleWilayaChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {filters.wilaya ? (
                <option value={filters.wilaya}>{`Wilaya: ${filters.wilaya}`}</option>
              ) : (
                <option value="">Toutes les wilayas</option>
              )}
              {wilayas.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>

          {/* Daira Filter */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Daira
            </label>
            <select
              value={filters.daira || ''}
              onChange={(e) => handleFilterChange('daira', e.target.value)}
              disabled={availableDairas.length === 0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            >
              {!filters.daira && (
                <option value="">{availableDairas.length > 0 ? 'Toutes les dairas' : 'Choisissez une wilaya'}</option>
              )}
              {availableDairas.map((d) => (
                <option key={d} value={d}>
                  {filters.daira === d ? `Daira: ${d}` : d}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Trier par
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expand/Collapse Button */}
          <div className="flex items-end"> 
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-6 py-3"
            >
              <i className="fas fa-filter"></i>
              {isExpanded ? 'Masquer' : 'Plus de filtres'}
              {activeFiltersCount > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">








              {/* 360° Tour Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Visite virtuelle
                </label>
                <select
                  value={filters.has360Tour === 'all' ? 'all' : filters.has360Tour.toString()}
                  onChange={(e) => handleFilterChange('has360Tour', e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">Toutes les propriétés</option>
                  <option value="true">Avec visite 360°</option>
                  <option value="false">Sans visite 360°</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  🗑️ Effacer tous les filtres
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};