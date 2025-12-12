'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Project, Property } from '../../../api';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const [projectData, statsData] = await Promise.all([
          apiService.getProjectBySlug(slug),
          apiService.getProjectStats(slug).catch(() => null)
        ]);
        setProject(projectData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Projet non trouvé');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
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

  if (error || !project) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'construction':
        return 'bg-yellow-100 text-yellow-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'construction':
        return 'En construction';
      case 'planning':
        return 'En planification';
      case 'suspended':
        return 'Suspendu';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header with cover image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={`Couverture ${project.name}`}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Project info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                {project.completionPercentage !== undefined && project.completionPercentage > 0 && (
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {project.completionPercentage}% terminé
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">{project.name}</h1>
              <div className="flex items-center space-x-4 text-sm md:text-base opacity-90">
                {project.promoteur && (
                  <Link 
                    href={`/promoteurs/${project.promoteur.slug}`}
                    className="hover:text-blue-200 transition-colors"
                  >
                    Par {project.promoteur.name}
                  </Link>
                )}
                {(project.wilaya || project.daira) && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.daira && project.wilaya ? `${project.daira}, ${project.wilaya}` : project.wilaya}
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
            {project.description && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du projet</h2>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Galerie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${project.name} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Properties */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Unités disponibles ({project.properties?.length || 0})
                </h2>
              </div>

              <div className="p-6">
                {project.properties && project.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.properties.map((property: Property) => (
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
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune unité disponible pour le moment</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du projet</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                
                {project.completionPercentage !== undefined && project.completionPercentage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avancement</span>
                    <span className="font-semibold">{project.completionPercentage}%</span>
                  </div>
                )}

                {project.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de début</span>
                    <span className="font-semibold">
                      {new Date(project.startDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}

                {project.expectedCompletionDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison prévue</span>
                    <span className="font-semibold">
                      {new Date(project.expectedCompletionDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}

                {project.address && (
                  <div>
                    <span className="text-gray-600 block mb-1">Adresse</span>
                    <span className="font-semibold text-sm">{project.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Promoteur info */}
            {project.promoteur && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Promoteur</h3>
                <Link 
                  href={`/promoteurs/${project.promoteur.slug}`}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  {project.promoteur.logo && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg p-2 flex-shrink-0">
                      <Image
                        src={project.promoteur.logo}
                        alt={`Logo ${project.promoteur.name}`}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{project.promoteur.name}</p>
                    <p className="text-sm text-gray-500">Voir le profil →</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unités totales</span>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
