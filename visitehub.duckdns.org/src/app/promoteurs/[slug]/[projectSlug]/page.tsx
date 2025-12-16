'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  type: string;
  price: string;
  surface: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  slug: string;
  transactionType: 'vendre' | 'location';
}

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  wilaya: string;
  daira: string;
  address?: string;
  status: 'completed' | 'construction' | 'planning' | 'suspended';
  coverImage?: string;
  gallery?: string[];
  propertiesCount: number;
  deliveryDate?: string;
  totalUnits?: number;
  availableUnits?: number;
  amenities?: string[];
  properties?: Property[];
}

interface Promoteur {
  id: string;
  name: string;
  slug: string;
  phone?: string;
}

interface ProjectPageProps {
  params: Promise<{ slug: string; projectSlug: string }>;
}

const getMockProjectBySlug = (promoteurSlug: string, projectSlug: string): { project: Project; promoteur: Promoteur } | null => {
  const data: Record<string, Record<string, { project: Project; promoteur: Promoteur }>> = {
    'bessa-promotion': {
      'residence-les-jardins': {
        promoteur: { id: '1', name: 'Bessa Promotion', slug: 'bessa-promotion', phone: '+213 550 11 22 33' },
        project: {
          id: '1',
          name: 'Résidence Les Jardins',
          slug: 'residence-les-jardins',
          description: 'Complexe résidentiel de standing avec espaces verts aménagés, aires de jeux pour enfants, et commerces de proximité.',
          wilaya: '16 - Alger',
          daira: 'Hydra',
          address: 'Route de la Forêt, Hydra, Alger',
          status: 'completed',
          propertiesCount: 120,
          deliveryDate: 'Juin 2024',
          totalUnits: 120,
          availableUnits: 5,
          amenities: ['Parking souterrain', 'Espaces verts', 'Aire de jeux', 'Commerces', 'Sécurité 24/7', 'Ascenseur', 'Interphone'],
          properties: [
            { id: '1', title: 'Appartement F3 avec balcon', type: 'F3', price: '18,500,000 DZD', surface: 85, bedrooms: 3, bathrooms: 2, slug: 'appartement-f3-balcon', transactionType: 'vendre' },
            { id: '2', title: 'Appartement F4 vue jardin', type: 'F4', price: '24,000,000 DZD', surface: 110, bedrooms: 4, bathrooms: 2, slug: 'appartement-f4-vue-jardin', transactionType: 'vendre' }
          ]
        }
      }
    }
  };
  
  return data[promoteurSlug]?.[projectSlug] || null;
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug: promoteurSlug, projectSlug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [promoteur, setPromoteur] = useState<Promoteur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getMockProjectBySlug(promoteurSlug, projectSlug);
        if (!data) {
          setError('Projet non trouvé');
        } else {
          setProject(data.project);
          setPromoteur(data.promoteur);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Projet non trouvé');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [promoteurSlug, projectSlug]);

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

  if (error || !project || !promoteur) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || 'Projet non trouvé'}</p>
            <Link href="/promoteurs" className="mt-4 inline-block text-teal-600 hover:text-teal-800">
               Retour aux promoteurs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/promoteurs" className="hover:text-teal-600">Promoteurs</Link>
            <span>/</span>
            <Link href={`/promoteurs/${promoteur.slug}`} className="hover:text-teal-600">{promoteur.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{project.name}</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 md:h-80 overflow-hidden">
        {project.coverImage ? (
          <Image src={project.coverImage} alt={`Couverture ${project.name}`} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"></div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                  project.status === 'completed' ? 'bg-green-500' :
                  project.status === 'construction' ? 'bg-orange-500' :
                  project.status === 'planning' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {project.status === 'completed' ? ' Livré' :
                   project.status === 'construction' ? ' En cours' :
                   project.status === 'planning' ? ' Planifié' : ' Suspendu'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{project.daira}, {project.wilaya}</span>
              </div>

              {project.address && <p className="text-gray-600 mb-4">{project.address}</p>}
              <p className="text-gray-700 leading-relaxed">{project.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {project.totalUnits && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Unités</p>
                    <p className="text-2xl font-bold text-gray-900">{project.totalUnits}</p>
                  </div>
                )}
                {project.availableUnits !== undefined && (
                  <div className="bg-teal-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Disponibles</p>
                    <p className="text-2xl font-bold text-teal-600">{project.availableUnits}</p>
                  </div>
                )}
                {project.deliveryDate && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Livraison</p>
                    <p className="text-lg font-bold text-gray-900">{project.deliveryDate}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Appartements</p>
                  <p className="text-2xl font-bold text-gray-900">{project.propertiesCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 md:w-80">
              <h3 className="font-bold text-lg mb-4">Développé par</h3>
              <Link href={`/promoteurs/${promoteur.slug}`} className="block hover:bg-white rounded-lg p-4 -mx-2 transition-colors">
                <p className="font-semibold text-gray-900 mb-1">{promoteur.name}</p>
                <p className="text-sm text-teal-600 hover:underline">Voir le promoteur </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {project.amenities && project.amenities.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Commodités & <span className="text-teal-600">Services</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600"></span>
                  </div>
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Nos <span className="text-teal-600">Appartements</span>
          </h2>
          <p className="text-gray-600">Découvrez les appartements disponibles dans ce projet.</p>
        </div>

        {project.properties && project.properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Property Image */}
                <div className="relative overflow-hidden h-64">
                  {property.images && property.images.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Image
                      src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.transactionType === 'vendre'
                        ? 'bg-slate-700 text-white'
                        : 'bg-orange-500 text-white'
                    }`}>
                      {property.transactionType === 'vendre' ? 'Vente' : 'Location'}
                    </span>
                  </div>

                  <Link
                    href={`/promoteurs/${promoteur.slug}/${project.slug}/${property.slug}`}
                    className="absolute bottom-4 right-4 bg-emerald-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Visite 360°
                  </Link>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/promoteurs/${promoteur.slug}/${project.slug}/${property.slug}`}
                      className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1"
                    >
                      {property.title}
                    </Link>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <i className="fas fa-map-marker-alt mr-1 text-emerald-500"></i>
                    <span className="text-sm">{project.daira}, {project.wilaya}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="fas fa-ruler-combined mr-1 text-emerald-500"></i>
                      {property.surface}m²
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{property.type}</span>
                    </div>
                  </div>

                  {project.amenities && project.amenities.length > 0 && (
                    <div className="mb-4">
                      <div className="relative flex flex-wrap gap-2 max-h-14 overflow-hidden">
                        {project.amenities.slice(0, 3).map((amenity, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs max-w-[160px] truncate"
                            title={amenity}
                          >
                            <div className="flex h-5 w-5 items-center justify-center shrink-0">
                              <span className="text-sm">📍</span>
                            </div>
                            <span className="text-gray-700 truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-emerald-600">{property.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/promoteurs/${promoteur.slug}/${project.slug}/${property.slug}`}
                      className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-center text-sm font-medium"
                    >
                      Voir détails
                    </Link>
                    <a
                      href={`tel:${promoteur.phone || '+213556267621'}`}
                      className="flex items-center justify-center bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <i className="fas fa-phone"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600">Aucun appartement disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}