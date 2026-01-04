'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { apiService, Restaurant } from '@/api';

interface RestaurantIframePageProps {
  params: Promise<{ slug: string }>;
}

export default function RestaurantIframePage({ params }: RestaurantIframePageProps) {
  const { slug } = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const data = await apiService.getRestaurantBySlug(slug);
        if (cancelled) return;
        setRestaurant(data);
      } catch (e) {
        console.error('Error fetching restaurant:', e);
        if (!cancelled) setError('Restaurant non trouvé');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRestaurant();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || 'Restaurant non trouvé'}</p>
            <Link href="/restaurants" className="mt-4 inline-block text-teal-600 hover:text-teal-800">
              ← Retour aux restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant.iframeUrl) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-700">Aucun lien iframe configuré pour ce restaurant.</p>
            <Link href="/restaurants" className="mt-4 inline-block text-teal-600 hover:text-teal-800">
              ← Retour aux restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="w-full h-[calc(100vh-5rem)]">
        <iframe
          title={restaurant.name}
          src={restaurant.iframeUrl}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
