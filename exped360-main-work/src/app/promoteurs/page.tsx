'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Promoteur } from '../../api';

export default function PromoteursPage() {
  const [promoteurs, setPromoteurs] = useState<Promoteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoteurs = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPromoteurs();
        setPromoteurs(data);
      } catch (err) {
        console.error('Error fetching promoteurs:', err);
        setError('Erreur lors du chargement des promoteurs');
      } finally {
        setLoading(false);
      }
    };

    fetchPromoteurs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des promoteurs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Promoteurs Immobiliers
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les promoteurs immobiliers de référence en Algérie et leurs projets innovants
            </p>
          </div>
        </div>
      </div>

      {/* Promoteurs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {promoteurs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun promoteur disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoteurs.map((promoteur) => (
              <Link
                key={promoteur.id}
                href={`/promoteurs/${promoteur.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                  {promoteur.coverImage ? (
                    <Image
                      src={promoteur.coverImage}
                      alt={`Couverture ${promoteur.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">🏗️</div>
                        <p className="text-sm opacity-80">Promoteur Immobilier</p>
                      </div>
                    </div>
                  )}
                  {/* Logo overlay */}
                  {promoteur.logo && (
                    <div className="absolute bottom-4 left-4">
                      <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-md">
                        <Image
                          src={promoteur.logo}
                          alt={`Logo ${promoteur.name}`}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {promoteur.name}
                  </h3>
                  
                  {promoteur.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {promoteur.description}
                    </p>
                  )}

                  {/* Location */}
                  {(promoteur.wilaya || promoteur.daira) && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {promoteur.daira && promoteur.wilaya ? `${promoteur.daira}, ${promoteur.wilaya}` : promoteur.wilaya}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {promoteur.projects?.length || 0} projet(s)
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
                      </svg>
                      {promoteur.properties?.length || 0} propriété(s)
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
