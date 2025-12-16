'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  status: 'planning' | 'construction' | 'completed' | 'suspended';
  slug: string;
  wilaya?: string;
  daira?: string;
  propertiesCount?: number;
}

interface Promoteur {
  id: string;
  name: string;
  slug: string;
  wilaya: string;
  daira?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  projects?: Project[];
  projectsCount: number;
  initials: string;
  bgColor: string;
}

interface PromoteurPageProps {
  params: Promise<{ slug: string }>;
}

// Mock data - This will be replaced with API call from admin panel
// TODO: Connect to backend API endpoint: GET /api/promoteurs/:slug
const getMockPromoteurBySlug = (slug: string): Promoteur | null => {
  const promoteurs: Record<string, Promoteur> = {
    'bessa-promotion': {
      id: '1',
      name: 'Bessa Promotion',
      slug: 'bessa-promotion',
      wilaya: '16 - Alger',
      daira: 'Alger',
      description: 'Leader de la promotion immobilière, nous construisons l\'avenir avec des résidences haut de gamme.',
      phone: '+213 550 11 22 33',
      email: 'contact@bessa-promotion.dz',
      website: 'https://www.bessa-promotion.dz',
      address: 'Hydra, Alger, Algérie',
      projectsCount: 12,
      initials: 'BE',
      bgColor: 'bg-gray-700',
      projects: [
        {
          id: '1',
          name: 'Résidence Les Jardins',
          description: 'Complexe résidentiel de standing avec espaces verts.',
          wilaya: '16 - Alger',
          daira: 'Hydra',
          status: 'completed',
          slug: 'residence-les-jardins',
          propertiesCount: 120
        },
        {
          id: '2',
          name: 'Bessa Park',
          description: 'Résidence moderne avec toutes les commodités.',
          wilaya: '16 - Alger',
          daira: 'Ben Aknoun',
          status: 'construction',
          slug: 'bessa-park',
          propertiesCount: 80
        }
      ]
    },
    'hasnaoui-immobilier': {
      id: '2',
      name: 'Hasnaoui Immobilier',
      slug: 'hasnaoui-immobilier',
      wilaya: '31 - Oran',
      daira: 'Oran',
      description: 'Une expertise reconnue dans la construction de cités intégrées et d\'espaces durables.',
      phone: '+213 550 99 88 77',
      email: 'info@groupe-hasnaoui.com',
      website: 'https://www.groupe-hasnaoui.com',
      address: 'Rue de la République, Oran, Algérie',
      projectsCount: 8,
      initials: 'HA',
      bgColor: 'bg-teal-500',
      projects: [
        {
          id: '1',
          name: 'Cité El Ryad',
          description: 'Un complexe résidentiel et commercial avec toutes les commodités.',
          wilaya: '31 - Oran',
          daira: 'Bir El Djir',
          status: 'construction',
          slug: 'cite-el-ryad',
          propertiesCount: 250
        }
      ]
    },
    'goumid-promotion': {
      id: '3',
      name: 'Goumid Promotion',
      slug: 'goumid-promotion',
      wilaya: '25 - Constantine',
      daira: 'Constantine',
      description: 'Votre partenaire de confiance pour des logements de qualité supérieure au cœur de la ville.',
      phone: '+213 550 77 66 55',
      email: 'contact@goumid-promotion.dz',
      website: 'https://www.goumid-promotion.dz',
      address: 'Centre-ville, Constantine, Algérie',
      projectsCount: 5,
      initials: 'GO',
      bgColor: 'bg-gray-700',
      projects: []
    }
  };
  
  return promoteurs[slug] || null;
};

export default function PromoteurPage({ params }: PromoteurPageProps) {
  const { slug } = use(params);
  const [promoteur, setPromoteur] = useState<Promoteur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual API call once admin panel backend is ready
  // Expected API endpoint: GET /api/promoteurs/:slug
  // This should return promoteur data managed from the admin panel
  useEffect(() => {
    const fetchPromoteur = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get mock data by slug
        const data = getMockPromoteurBySlug(slug);
        
        if (!data) {
          setError('Promoteur non trouvé');
        } else {
          setPromoteur(data);
        }
        
        // TODO: Replace with actual API call:
        // const data = await apiService.getPromoteurBySlug(slug);
        // setPromoteur(data);
      } catch (err) {
        console.error('Error fetching promoteur:', err);
        setError('Promoteur non trouvé');
      } finally {
        setLoading(false);
      }
    };
    fetchPromoteur();
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

  if (error || !promoteur) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || 'Promoteur non trouvé'}</p>
            <Link href="/promoteurs" className="mt-4 inline-block text-teal-600 hover:text-teal-800">
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
      <div className="relative h-64 md:h-80 overflow-hidden">
        {promoteur.coverImage ? (
          <Image
            src={promoteur.coverImage}
            alt={`Couverture ${promoteur.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-500"></div>
        )}
      </div>

      {/* Promoteur Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left: Logo + Info */}
            <div className="flex items-start gap-6">
              {/* Logo Circle */}
              <div className={`w-24 h-24 md:w-32 md:h-32 ${promoteur.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                {promoteur.logo ? (
                  <Image
                    src={promoteur.logo}
                    alt={`Logo ${promoteur.name}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <span className="text-4xl md:text-5xl font-bold text-white">{promoteur.initials}</span>
                )}
              </div>

              {/* Name and Location */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{promoteur.name}</h1>
                <div className="space-y-1 text-gray-600">
                  {promoteur.wilaya && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{promoteur.daira ? `${promoteur.daira}, ${promoteur.wilaya}` : promoteur.wilaya}</span>
                    </div>
                  )}
                  {promoteur.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{promoteur.phone}</span>
                    </div>
                  )}
                  {promoteur.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{promoteur.email}</span>
                    </div>
                  )}
                </div>
                {promoteur.description && (
                  <p className="text-gray-600 mt-4 max-w-2xl">{promoteur.description}</p>
                )}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex md:flex-col gap-3">
              {promoteur.phone && (
                <a
                  href={`tel:${promoteur.phone}`}
                  className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium whitespace-nowrap text-center"
                >
                  Contacter
                </a>
              )}
              {promoteur.website && (
                <a
                  href={promoteur.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 border-2 border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium whitespace-nowrap text-center"
                >
                  Site Web
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Nos <span className="text-teal-600">Projets</span>
          </h2>
          <p className="text-gray-600">
            Explorez nos projets résidentiels et commerciaux en cours et livrés.
          </p>
        </div>

        {promoteur.projects && promoteur.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoteur.projects.map((project) => (
              <Link
                key={project.id}
                href={`/promoteurs/${promoteur.slug}/${project.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-5xl mb-2">🏗️</div>
                      </div>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'completed' ? 'bg-green-500 text-white' :
                      project.status === 'construction' ? 'bg-orange-500 text-white' :
                      project.status === 'planning' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {project.status === 'completed' ? 'Livré' :
                       project.status === 'construction' ? 'En cours' :
                       project.status === 'planning' ? 'Planifié' : 'Suspendu'}
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {project.name}
                  </h3>
                  
                  {/* Location */}
                  {(project.wilaya || project.daira) && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.daira && project.wilaya ? `${project.daira}, ${project.wilaya}` : project.wilaya}
                    </div>
                  )}

                  {/* Description */}
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {project.propertiesCount || 0} unités
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 font-medium text-sm group-hover:gap-3 transition-all">
                      Voir plus
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600">Aucun projet disponible pour le moment.</p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold">Visite</span>
                <span className="text-2xl font-bold text-teal-500">Hub</span>
              </div>
              <p className="text-gray-400 text-sm">
                La première plateforme de visites virtuelles en Algérie. Découvrez votre futur logement
                sans vous déplacer.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">LIENS RAPIDES</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/properties" className="hover:text-teal-500 transition-colors">
                    Acheter
                  </Link>
                </li>
                <li>
                  <Link href="/properties?type=location" className="hover:text-teal-500 transition-colors">
                    Louer
                  </Link>
                </li>
                <li>
                  <Link href="/promoteurs" className="hover:text-teal-500 transition-colors">
                    Promoteurs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">CONTACT</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>contact@visitehub.dz</li>
                <li>+213 550 00 00 00</li>
                <li>Alger, Algérie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
