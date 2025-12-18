'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService, Project, Promoteur, Property } from '@/api';
import { PropertyCard } from '@/app/components/ui/PropertyCard';

type UiProject = Project & {
  slug: string;
  status: 'completed' | 'construction' | 'planning' | 'suspended';
  propertiesCount: number;
  properties?: Property[];
  amenities?: string[];
  gallery?: string[];
  deliveryDate?: string;
  totalUnits?: number;
  availableUnits?: number;
};

type UiPromoteur = Promoteur & { phone?: string };

interface ProjectPageProps {
  params: Promise<{ slug: string; projectSlug: string }>;
}

const normalize = (value: string) => value.trim().toLowerCase();

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug: promoteurSlug, projectSlug } = use(params);
  const [project, setProject] = useState<UiProject | null>(null);
  const [promoteur, setPromoteur] = useState<UiPromoteur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const p = await apiService.getPromoteurBySlug(promoteurSlug);
        const projects = await apiService.listPromoteurProjects(p.id);
        const found = projects.find((proj) => {
          const slugOrId = proj.slug || proj.id;
          return normalize(slugOrId) === normalize(projectSlug) || normalize(proj.id) === normalize(projectSlug);
        });
        if (!found) {
          setError('Projet non trouvé');
          return;
        }

        const { properties, total } = await apiService.getProperties({
          propertyOwnerType: 'Promotion immobilière',
          projectId: found.id,
          limit: 100,
          offset: 0,
        });

        setPromoteur({ ...p, phone: p.phoneNumber });
        setProject({
          ...found,
          slug: found.slug || found.id,
          status: (found.status || 'planning') as UiProject['status'],
          propertiesCount: total,
          properties,
        });
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
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0"></div>
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
              <PropertyCard
                key={property.id}
                property={property}
                href={`/promoteurs/${promoteur.slug}/${project.slug}/${property.slug || property.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">Aucun appartement disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}