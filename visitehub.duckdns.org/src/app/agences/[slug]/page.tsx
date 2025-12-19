'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyCard } from '@/app/components/ui/PropertyCard';
import { apiService, Agence, Property } from '@/api';
import { resolveImageUrl } from '@/lib/resolveImageUrl';

type UiAgence = Agence & {
  properties?: Property[];
  propertiesCount: number;
  initials: string;
  bgColor: string;
  coverImage?: string;
  phone?: string;
};

interface AgencePageProps {
  params: Promise<{ slug: string }>;
}

const computeInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

const pickBgColor = (seed: string) => {
  const palette = ['bg-blue-600', 'bg-purple-600', 'bg-indigo-600', 'bg-teal-600', 'bg-emerald-600', 'bg-slate-700'];
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

export default function AgencePage({ params }: AgencePageProps) {
  const { slug } = use(params);
  const [agence, setAgence] = useState<UiAgence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgence = async () => {
      try {
        setLoading(true);
        const agency = await apiService.getAgenceBySlug(slug);
        const { properties, total } = await apiService.getProperties({
          propertyOwnerType: 'Agence immobilière',
          propertyOwnerName: agency.name,
          limit: 100,
          offset: 0,
        });

        setAgence({
          ...agency,
          properties,
          propertiesCount: total,
          initials: computeInitials(agency.name),
          bgColor: pickBgColor(agency.slug || agency.name),
          phone: agency.phoneNumber,
        });
      } catch (err) {
        console.error('Error fetching agence:', err);
        setError('Agence non trouvée');
      } finally {
        setLoading(false);
      }
    };
    fetchAgence();
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

  if (error || !agence) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || 'Agence non trouvée'}</p>
            <Link href="/agences" className="mt-4 inline-block text-teal-600 hover:text-teal-800">
              ← Retour aux agences
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = resolveImageUrl(agence.coverImage);
  const logoUrl = resolveImageUrl(agence.logo);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header with cover image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`Couverture ${agence.name}`}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized={coverUrl.includes('/uploads/')}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500"></div>
        )}
      </div>

      {/* Agence Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left: Logo + Info */}
            <div className="flex items-start gap-6">
              {/* Logo Circle */}
              <div className={`w-24 h-24 md:w-32 md:h-32 ${agence.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={`Logo ${agence.name}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain rounded-full"
                    unoptimized={logoUrl.includes('/uploads/')}
                  />
                ) : (
                  <span className="text-4xl md:text-5xl font-bold text-white">{agence.initials}</span>
                )}
              </div>

              {/* Name and Location */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{agence.name}</h1>
                <div className="space-y-1 text-gray-600">
                  {agence.wilaya && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{agence.daira ? `${agence.daira}, ${agence.wilaya}` : agence.wilaya}</span>
                    </div>
                  )}
                  {agence.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{agence.phone}</span>
                    </div>
                  )}
                  {agence.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{agence.email}</span>
                    </div>
                  )}
                </div>
                {agence.description && (
                  <p className="text-gray-600 mt-4 max-w-2xl">{agence.description}</p>
                )}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex md:flex-col gap-3">
              {agence.phone && (
                <a
                  href={`tel:${agence.phone}`}
                  className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium whitespace-nowrap text-center"
                >
                  Contacter
                </a>
              )}
              {agence.website && (
                <a
                  href={agence.website}
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

      {/* Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Nos <span className="text-teal-600">Propriétés</span>
          </h2>
          <p className="text-gray-600">
            Découvrez notre sélection de biens immobiliers à vendre et à louer.
          </p>
        </div>

        {agence.properties && agence.properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agence.properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property as any} 
                href={`/agences/${agence.slug}/${property.slug || property.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600">Aucune propriété disponible pour le moment.</p>
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
                  <Link href="/agences" className="hover:text-teal-500 transition-colors">
                    Agences
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
