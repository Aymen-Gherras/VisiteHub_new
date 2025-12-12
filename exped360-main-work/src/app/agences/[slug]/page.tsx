'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Agence, Property } from '../../../api';

interface AgencePageProps {
  params: Promise<{ slug: string }>;
}

export default function AgencePage({ params }: AgencePageProps) {
  const { slug } = use(params);
  const [agence, setAgence] = useState<Agence | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgence = async () => {
      try {
        setLoading(true);
        const [agenceData, statsData] = await Promise.all([
          apiService.getAgenceBySlug(slug),
          apiService.getAgenceStats(slug).catch(() => null)
        ]);
        setAgence(agenceData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching agence:', err);
        setError('Agence non trouvée');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAgence();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agence) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Link href="/agences" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              ← Retour aux agences
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header with cover image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-green-500 to-blue-600">
        {agence.coverImage && (
          <Image
            src={agence.coverImage}
            alt={`Couverture ${agence.name}`}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Agence info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end space-x-6">
              {/* Logo */}
              {agence.logo && (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg p-3 shadow-lg flex-shrink-0">
                  <Image
                    src={agence.logo}
                    alt={`Logo ${agence.name}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Info */}
              <div className="text-white">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{agence.name}</h1>
                <div className="flex items-center space-x-4 text-sm md:text-base opacity-90">
                  {(agence.wilaya || agence.daira) && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {agence.daira && agence.wilaya ? `${agence.daira}, ${agence.wilaya}` : agence.wilaya}
                    </div>
                  )}
                  {agence.experienceYears && agence.experienceYears > 0 && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {agence.experienceYears} ans d'expérience
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {agence.description && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
                <p className="text-gray-600 leading-relaxed">{agence.description}</p>
              </div>
            )}

            {/* Specializations */}
            {agence.specializations && agence.specializations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Spécialisations</h2>
                <div className="flex flex-wrap gap-2">
                  {agence.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Properties */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Propriétés ({agence.properties?.length || 0})
                </h2>
              </div>

              <div className="p-6">
                {agence.properties && agence.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {agence.properties.map((property: Property) => (
                      <Link
                        key={property.id}
                        href={`/properties/${property.slug}`}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {property.images && property.images.length > 0 && (
                          <div className="relative h-32 mb-3 rounded-md overflow-hidden">
                            <Image
                              src={property.images[0]}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                        <p className="text-lg font-bold text-blue-600 mb-2">{property.price}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>{property.surface}m²</span>
                            {property.bedrooms && (
                              <>
                                <span>•</span>
                                <span>{property.bedrooms} ch.</span>
                              </>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            property.transactionType === 'vendre' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {property.transactionType === 'vendre' ? 'Vente' : 'Location'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {property.wilaya}{property.daira && `, ${property.daira}`}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune propriété disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                {agence.phone && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{agence.phone}</span>
                  </div>
                )}
                {agence.email && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{agence.email}</span>
                  </div>
                )}
                {agence.website && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                    <a href={agence.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Site web
                    </a>
                  </div>
                )}
                {agence.address && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">{agence.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Propriétés totales</span>
                    <span className="font-semibold">{stats.propertiesCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">À vendre</span>
                    <span className="font-semibold">{stats.salePropertiesCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">À louer</span>
                    <span className="font-semibold">{stats.rentPropertiesCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Propriétés vedettes</span>
                    <span className="font-semibold">{stats.featuredPropertiesCount || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
