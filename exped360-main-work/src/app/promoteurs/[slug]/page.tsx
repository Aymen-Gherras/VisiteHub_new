'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Promoteur, Project, Property } from '../../../api';

interface PromoteurPageProps {
  params: Promise<{ slug: string }>;
}

export default function PromoteurPage({ params }: PromoteurPageProps) {
  const { slug } = use(params);
  const [promoteur, setPromoteur] = useState<Promoteur | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'properties'>('projects');

  useEffect(() => {
    const fetchPromoteur = async () => {
      try {
        setLoading(true);
        const [promoteurData, statsData] = await Promise.all([
          apiService.getPromoteurBySlug(slug),
          apiService.getPromoteurStats(slug).catch(() => null)
        ]);
        setPromoteur(promoteurData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching promoteur:', err);
        setError('Promoteur non trouvé');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPromoteur();
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

  if (error || !promoteur) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Link href="/promoteurs" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              ← Retour aux promoteurs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header with cover image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-500 to-purple-600">
        {promoteur.coverImage && (
          <Image
            src={promoteur.coverImage}
            alt={`Couverture ${promoteur.name}`}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Promoteur info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end space-x-6">
              {/* Logo */}
              {promoteur.logo && (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg p-3 shadow-lg flex-shrink-0">
                  <Image
                    src={promoteur.logo}
                    alt={`Logo ${promoteur.name}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Info */}
              <div className="text-white">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{promoteur.name}</h1>
                {(promoteur.wilaya || promoteur.daira) && (
                  <div className="flex items-center text-sm md:text-base opacity-90">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {promoteur.daira && promoteur.wilaya ? `${promoteur.daira}, ${promoteur.wilaya}` : promoteur.wilaya}
                  </div>
                )}
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
            {promoteur.description && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
                <p className="text-gray-600 leading-relaxed">{promoteur.description}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'projects'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Projets ({promoteur.projects?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'properties'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Propriétés ({promoteur.properties?.length || 0})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'projects' && (
                  <div>
                    {promoteur.projects && promoteur.projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {promoteur.projects.map((project: Project) => (
                          <Link
                            key={project.id}
                            href={`/projets/${project.slug}`}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            {project.coverImage && (
                              <div className="relative h-32 mb-3 rounded-md overflow-hidden">
                                <Image
                                  src={project.coverImage}
                                  alt={project.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                            {project.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-full ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'construction' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status === 'completed' ? 'Terminé' :
                                 project.status === 'construction' ? 'En construction' :
                                 project.status === 'planning' ? 'En planification' : 'Suspendu'}
                              </span>
                              <span>{project.properties?.length || 0} unités</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Aucun projet disponible</p>
                    )}
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div>
                    {promoteur.properties && promoteur.properties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {promoteur.properties.map((property: Property) => (
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
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{property.surface}m²</span>
                              {property.bedrooms && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{property.bedrooms} ch.</span>
                                </>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Aucune propriété disponible</p>
                    )}
                  </div>
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
                {promoteur.phone && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{promoteur.phone}</span>
                  </div>
                )}
                {promoteur.email && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{promoteur.email}</span>
                  </div>
                )}
                {promoteur.website && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                    <a href={promoteur.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Site web
                    </a>
                  </div>
                )}
                {promoteur.address && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">{promoteur.address}</span>
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
                    <span className="text-gray-600">Projets totaux</span>
                    <span className="font-semibold">{stats.projectsCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projets terminés</span>
                    <span className="font-semibold">{stats.completedProjectsCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projets actifs</span>
                    <span className="font-semibold">{stats.activeProjectsCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Propriétés totales</span>
                    <span className="font-semibold">{stats.propertiesCount || 0}</span>
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
