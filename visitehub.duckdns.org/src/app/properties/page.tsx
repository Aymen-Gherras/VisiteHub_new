'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AdvancedFilterBar } from '../components/ui/AdvancedFilterBar';
import { PropertyGrid } from '../components/properties/PropertyGrid';
import { apiService, Property } from '../../api';

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

interface PropertiesResponse {
  properties: Property[];
  total: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    transactionType: 'tous',
    selectedWilaya: '',
    selectedDaira: '',
    selectedPropertyType: '',
    selectedPropertyOwnerType: 'Particulier',
    selectedPaymentConditions: [],
    selectedSpecifications: [],
    selectedPapers: []
  });

  const ITEMS_PER_PAGE = 9;

  // Debounced fetch function
  const debouncedFetchProperties = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (filters: FilterState, page: number) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            setLoading(true);
            setError(null);
            
            const params: any = {
              limit: ITEMS_PER_PAGE,
              offset: (page - 1) * ITEMS_PER_PAGE,
            };

            // Public /properties page must ONLY show Particulier properties
            params.propertyOwnerType = 'Particulier';
            
            if (filters.transactionType !== 'tous') params.transactionType = filters.transactionType;
            if (filters.selectedPropertyType) params.type = filters.selectedPropertyType;
            if (filters.selectedWilaya) params.wilaya = filters.selectedWilaya;
            if (filters.selectedDaira) params.daira = filters.selectedDaira;
            // Ignore selectedPropertyOwnerType here; enforced above
            // Don't send searchQuery as a parameter to the API
            // Instead, we'll filter the results client-side after receiving them
            
            const data: PropertiesResponse = await apiService.getProperties(params);
            
            // Apply client-side filtering for search query if provided
            let filteredProperties = data.properties;
            if (filters.searchQuery) {
              const searchTerm = filters.searchQuery.toLowerCase();
              filteredProperties = data.properties.filter(property => 
                property.title?.toLowerCase().includes(searchTerm) ||
                property.description?.toLowerCase().includes(searchTerm) ||
                property.wilaya?.toLowerCase().includes(searchTerm) ||
                property.daira?.toLowerCase().includes(searchTerm)
              );
              // Update total count for pagination
              setTotalProperties(filteredProperties.length);
            } else {
              setTotalProperties(data.total);
            }
            
            setProperties(filteredProperties);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch properties');
            console.error('Error fetching properties:', err);
          } finally {
            setLoading(false);
          }
        }, 300);
      };
    })(),
    []
  );

  // Initial load
  useEffect(() => {
    debouncedFetchProperties(filters, currentPage);
  }, []);

  // Handle filter changes
  useEffect(() => {
    setCurrentPage(1);
    debouncedFetchProperties(filters, 1);
  }, [filters.transactionType, filters.selectedPropertyType, filters.selectedWilaya, filters.selectedDaira, filters.selectedPropertyOwnerType, filters.searchQuery]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    debouncedFetchProperties(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, debouncedFetchProperties]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalProperties / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalProperties);

  // Pagination component
  const Pagination = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const mobileMaxVisiblePages = 3;
    
    // Determine max visible pages based on screen size (handled via CSS)
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page button (mobile)
    if (currentPage > 2) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="md:hidden px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-600 border-2 border-gray-300 font-medium transition-all duration-200 text-sm"
        >
          1
        </button>
      );
      if (currentPage > 3) {
        pages.push(
          <span key="dots-start" className="md:hidden px-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      const isMobileVisible = i >= currentPage - 1 && i <= currentPage + 1;
      
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
            i === currentPage
              ? 'bg-emerald-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-600 border-2 border-gray-300'
          } ${!isMobileVisible ? 'hidden md:inline-flex' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page button (mobile)
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="dots-end" className="md:hidden px-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="md:hidden px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-600 border-2 border-gray-300 font-medium transition-all duration-200 text-sm"
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-1.5 md:gap-2 py-8 md:py-12 border-t border-gray-200">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2.5 md:px-4 py-2 rounded-lg bg-white text-emerald-600 font-medium border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-emerald-600 flex items-center gap-1 md:gap-2 text-sm md:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Précédent</span>
            <span className="sm:hidden">Préc</span>
          </button>
          
          {/* Page Numbers */}
          {pages}
          
          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2.5 md:px-4 py-2 rounded-lg bg-white text-emerald-600 font-medium border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-emerald-600 flex items-center gap-1 md:gap-2 text-sm md:text-base whitespace-nowrap"
          >
            <span className="hidden sm:inline">Suivant</span>
            <span className="sm:hidden">Suiv</span>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4 leading-tight">
              Propriétés <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">disponibles</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Découvrez notre sélection de biens immobiliers avec visite virtuelle 360°
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        <AdvancedFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          className="mb-6 md:mb-8"
        />
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <p className="text-sm md:text-base text-gray-600">
            {loading ? (
              'Chargement...'
            ) : (
              <>
                <span className="hidden sm:inline">
                  {`${startItem}-${endItem} sur ${totalProperties} propriété${totalProperties !== 1 ? 's' : ''} trouvée${totalProperties !== 1 ? 's' : ''}`}
                </span>
                <span className="sm:hidden">
                  {`${totalProperties} bien${totalProperties !== 1 ? 's' : ''}`}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-12 md:py-20">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-emerald-600"></div>
        </div>
      )}
      
      {error && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-3 md:p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error loading properties</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <button
                  onClick={() => debouncedFetchProperties(filters, currentPage)}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <PropertyGrid properties={properties} />
          {Pagination}
        </>
      )}
    </div>
  );
}