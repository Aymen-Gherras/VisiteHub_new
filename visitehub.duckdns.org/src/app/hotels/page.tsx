'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Hotel } from '@/api';
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

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
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
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await apiService.getHotels();
        if (!mounted) return;
        setHotels(data);
      } catch (err) {
        console.error('Error fetching hotels:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHotels();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredHotels = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();

    return hotels.filter((h) => {
      const matchesSearch =
        !q ||
        h.name?.toLowerCase().includes(q) ||
        h.wilaya?.toLowerCase().includes(q) ||
        h.daira?.toLowerCase().includes(q);

      const matchesWilaya = !filters.selectedWilaya || h.wilaya === filters.selectedWilaya;
      const matchesDaira = !filters.selectedDaira || h.daira === filters.selectedDaira;

      return matchesSearch && matchesWilaya && matchesDaira;
    });
  }, [hotels, filters.searchQuery, filters.selectedWilaya, filters.selectedDaira]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des hôtels...</p>
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
                Hôtels
              </span>
              {' '}Partenaires
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez nos hôtels partenaires.
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
        {filteredHotels.length === 0 ? (
          <div className="text-center text-gray-600">Aucun hôtel trouvé.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => {
              const coverUrl = resolveImageUrl(hotel.coverImage);
              return (
                <Link
                  key={hotel.id}
                  href={`/hotel/${hotel.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-emerald-600 to-lime-600">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={coverUrl.includes('/uploads/')}
                      />
                    ) : null}
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{hotel.name}</h2>
                    <p className="text-sm text-gray-600">
                      {(hotel.daira && hotel.wilaya)
                        ? `${hotel.daira}, ${hotel.wilaya}`
                        : hotel.wilaya || hotel.daira || ''}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {typeof hotel.starsNumber === 'number' ? (
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                          {hotel.starsNumber} ★
                        </span>
                      ) : null}
                      {typeof hotel.roomsNumber === 'number' ? (
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                          {hotel.roomsNumber} chambres
                        </span>
                      ) : null}
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
