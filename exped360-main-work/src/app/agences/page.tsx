'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Agence } from '../../api';

export default function AgencesPage() {
  const [agences, setAgences] = useState<Agence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgences = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAgences();
        setAgences(data);
      } catch (err) {
        console.error('Error fetching agences:', err);
        setError('Erreur lors du chargement des agences');
      } finally {
        setLoading(false);
      }
    };

    fetchAgences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des agences...</p>
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
              Agences Immobilières
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les agences immobilières de confiance en Algérie et leurs propriétés exclusives
            </p>
          </div>
        </div>
      </div>

      {/* Agences Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {agences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune agence disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agences.map((agence) => (
              <Link
                key={agence.id}
                href={`/agences/${agence.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-r from-green-500 to-blue-600">
                  {agence.coverImage ? (
                    <Image
                      src={agence.coverImage}
                      alt={`Couverture ${agence.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">🏢</div>
                        <p className="text-sm opacity-80">Agence Immobilière</p>
                      </div>
                    </div>
                  )}
                  {/* Logo overlay */}
                  {agence.logo && (
                    <div className="absolute bottom-4 left-4">
                      <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-md">
                        <Image
                          src={agence.logo}
                          alt={`Logo ${agence.name}`}
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
                    {agence.name}
                  </h3>
                  
                  {agence.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {agence.description}
                    </p>
                  )}

                  {/* Location */}
                  {(agence.wilaya || agence.daira) && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {agence.daira && agence.wilaya ? `${agence.daira}, ${agence.wilaya}` : agence.wilaya}
                    </div>
                  )}

                  {/* Experience */}
                  {agence.experienceYears && agence.experienceYears > 0 && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {agence.experienceYears} ans d'expérience
                    </div>
                  )}

                  {/* Specializations */}
                  {agence.specializations && agence.specializations.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {agence.specializations.slice(0, 3).map((spec, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                        {agence.specializations.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{agence.specializations.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
                      </svg>
                      {agence.properties?.length || 0} propriété(s)
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
