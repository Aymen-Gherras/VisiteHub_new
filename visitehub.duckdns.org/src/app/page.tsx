'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { HeroSection } from './components/home/HeroSection';
import { Testimonials } from './components/home/Testimonials';
import { Contact } from './components/home/Contact';
import { apiService, Property } from '../api';
import { FeaturedProperties } from './components/properties/FeaturedProperties';
import { AdvancedFilterBar } from './components/ui/AdvancedFilterBar';

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

export default function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
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

  // Load featured properties on mount
  useEffect(() => {
    setLoading(true);
    apiService
      .getFeaturedProperties()
      .then((properties) => {
        setFeatured(properties);
        
        // Track ViewContent event for Meta Pixel when properties are loaded
        if (typeof window !== 'undefined' && (window as any).fbq && properties.length > 0) {
          (window as any).fbq('track', 'ViewContent', {
            content_type: 'product_group',
            content_category: 'Real Estate',
            content_name: 'Featured Properties',
            num_items: properties.length,
            custom_data: {
              page_type: 'homepage',
              properties_count: properties.length
            }
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => 
    filters.searchQuery !== '' ||
    filters.transactionType !== 'tous' ||
    filters.selectedWilaya !== '' ||
    filters.selectedDaira !== '' ||
    filters.selectedPropertyType !== '',
    [filters.searchQuery, filters.transactionType, filters.selectedWilaya, filters.selectedDaira, filters.selectedPropertyType]
  );

  // Debounced fetch function for filtered properties
  const debouncedFetchProperties = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (filters: FilterState) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            setFilterLoading(true);
            
            const params: any = {
              limit: 100, // Show more results on home page
            };
            
            if (filters.transactionType !== 'tous') params.transactionType = filters.transactionType;
            if (filters.selectedPropertyType) params.type = filters.selectedPropertyType;
            if (filters.selectedWilaya) params.wilaya = filters.selectedWilaya;
            if (filters.selectedDaira) params.daira = filters.selectedDaira;
            if (filters.selectedPropertyOwnerType) params.propertyOwnerType = filters.selectedPropertyOwnerType;
            
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
            }
            
            setFiltered(filteredProperties);
          } catch (err) {
            console.error('Error fetching filtered properties:', err);
            setFiltered([]);
          } finally {
            setFilterLoading(false);
          }
        }, 300);
      };
    })(),
    []
  );

  // Fetch filtered properties when filters change
  useEffect(() => {
    if (!hasActiveFilters) {
      setFiltered([]);
      return;
    }
    
    debouncedFetchProperties(filters);
  }, [filters.transactionType, filters.selectedPropertyType, filters.selectedWilaya, filters.selectedDaira, filters.searchQuery, hasActiveFilters, debouncedFetchProperties]);

  // Determine loading state based on whether filters are active
  const isLoading = hasActiveFilters ? filterLoading : loading;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: featured.map((p, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: p.title,
      description: p.description,
      image: p.images?.[0],
      url: p.slug ? `https://visitehub.com/properties/${p.slug}` : undefined,
      offers: {
        '@type': 'Offer',
        price: p.price,
        priceCurrency: 'DZD',
        availability: 'https://schema.org/InStock',
      },
    })),
  } as any;

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* 1. Hero Section with Carousel */}
      <HeroSection />
      
      {/* 2. Title and Subtitle Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Trouvez maintenant la propriété de vos rêves en Algérie
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Trouvez des propriétés dans 58 Wilaya différents représentés par 200 courtiers membres de premier plan.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Filter Bar Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdvancedFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            className="shadow-xl"
          />
        </div>
      </section>

      {/* 4. Properties Section (Featured or Filtered) */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des propriétés...</p>
            </div>
          ) : hasActiveFilters ? (
            // Show filtered results
            <>
              {filtered && filtered.length > 0 ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                      Résultats de recherche
                    </h2>
                    <p className="text-gray-600">
                      {filtered.length} {filtered.length === 1 ? 'propriété trouvée' : 'propriétés trouvées'}
                    </p>
                  </div>
                  <FeaturedProperties properties={filtered} />
                  
                  {/* "Voir tous les résultats" button */}
                  <div className="text-center mt-12">
                    <Link
                      href="/properties"
                      className="bg-slate-800 text-white px-8 py-3 rounded-xl hover:bg-slate-700 transition-colors inline-block"
                    >
                      Voir tous les résultats
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">Aucune propriété trouvée avec ces critères.</p>
                  <button
                    onClick={() => setFilters({
                      searchQuery: '',
                      transactionType: 'tous',
                      selectedWilaya: '',
                      selectedDaira: '',
                      selectedPropertyType: '',
                      selectedPropertyOwnerType: '',
                      selectedPaymentConditions: [],
                      selectedSpecifications: [],
                      selectedPapers: []
                    })}
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </>
          ) : (
            // Show featured properties when no filters
            <>
              {featured && featured.length > 0 ? (
                <>
                  <FeaturedProperties properties={featured} />
                  
                  {/* "Voir plus de biens" button */}
                  <div className="text-center mt-12">
                    <Link
                      href="/properties"
                      className="bg-slate-800 text-white px-8 py-3 rounded-xl hover:bg-slate-700 transition-colors inline-block"
                    >
                      Voir plus de biens
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Aucune propriété en vedette pour le moment.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 5. Everything else */}
      <Testimonials />
      <Contact />
    </main>
  );
}
