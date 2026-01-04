'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Restaurant } from '@/api';
import { resolveImageUrl } from '@/lib/resolveImageUrl';
import { AdvancedFilterBar } from '@/app/components/ui/AdvancedFilterBar';

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

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    transactionType: 'tous',
    selectedWilaya: '',
    selectedDaira: '',
    selectedPropertyType: '',
    selectedPropertyOwnerType: '',
    selectedPaymentConditions: [],
    selectedSpecifications: [],
    selectedPapers: [],
  });

  useEffect(() => {
    let mounted = true;
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await apiService.getRestaurants();
        if (!mounted) return;
        setRestaurants(data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchRestaurants();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredRestaurants = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();

    return restaurants.filter((r) => {
      const matchesSearch =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        r.wilaya?.toLowerCase().includes(q) ||
        r.daira?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q);

      const matchesWilaya = !filters.selectedWilaya || r.wilaya === filters.selectedWilaya;
      const matchesDaira = !filters.selectedDaira || r.daira === filters.selectedDaira;

      return matchesSearch && matchesWilaya && matchesDaira;
    });
  }, [restaurants, filters.searchQuery, filters.selectedWilaya, filters.selectedDaira]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des restaurants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
                Restaurants
              </span>
              {' '}Partenaires
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez nos restaurants partenaires.
            </p>
          </div>

          <AdvancedFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            showOwnerTypeSelect={false}
            showTransactionToggle={false}
            showPropertyTypeSelect={false}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center text-gray-600">Aucun restaurant trouvé.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const coverUrl = resolveImageUrl(restaurant.coverImage);
              return (
                <Link
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.slug}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-emerald-600 to-lime-600">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={coverUrl.includes('/uploads/')}
                      />
                    ) : null}
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{restaurant.name}</h2>
                    <p className="text-sm text-gray-600">
                      {(restaurant.daira && restaurant.wilaya)
                        ? `${restaurant.daira}, ${restaurant.wilaya}`
                        : restaurant.wilaya || restaurant.daira || ''}
                    </p>
                    {restaurant.type ? (
                      <p className="mt-2 text-sm text-gray-700">{restaurant.type}</p>
                    ) : null}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end">
                      <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm group-hover:gap-3 transition-all">
                        Voir profil
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
