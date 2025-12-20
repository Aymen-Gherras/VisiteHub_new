'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { apiService, Agence, Property } from '@/api';
import { PropertyHero } from '@/app/components/properties/PropertyHero';
import { PropertyBasicInfo } from '@/app/components/properties/PropertyBasicInfo';
import { PropertyDetails } from '@/app/components/properties/PropertyDetails';
import { PropertyGallery } from '@/app/components/properties/PropertyGallery';
import { PropertyContactDetails } from '@/app/components/properties/PropertyContactDetails';
import { PropertyReturnButton } from '@/app/components/properties/PropertyReturnButton';

interface PropertyPageProps {
  params: Promise<{ slug: string; propertySlug: string }>;
}

const normalize = (value: string) => value.trim().toLowerCase();

const fetchPropertyBySlugOrId = async (slugOrId: string): Promise<Property> => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const tailUuidMatch = slugOrId.match(/([0-9a-fA-F-]{36})$/);
  if (uuidRegex.test(slugOrId)) return apiService.getProperty(slugOrId);
  if (tailUuidMatch) return apiService.getProperty(tailUuidMatch[1]);
  return apiService.getPropertyBySlug(slugOrId);
};

export default function PropertyPage({ params }: PropertyPageProps) {
  const { slug: agenceSlug, propertySlug } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [agence, setAgence] = useState<Agence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const agency = await apiService.getAgenceBySlug(agenceSlug);
        const prop = await fetchPropertyBySlugOrId(propertySlug);

        const isAgencyOwned =
          prop.propertyOwnerType === 'Agence immobilière' &&
          normalize(prop.propertyOwnerName || '') === normalize(agency.name || '');

        if (!isAgencyOwned) {
          setError('Propriété non trouvée');
          return;
        }

        setAgence(agency);
        setProperty(prop);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Propriété non trouvée');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [agenceSlug, propertySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !property || !agence) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <div className="mt-2 text-sm text-red-700">{error || 'Propriété non trouvée'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const transformedProperty = {
    ...property,
    city: (property as any).city,
    features: property.amenities || [],
    nearbyPlaces: property.nearbyPlaces || [],
    papers: property.papers || [],
    serviceTier: 'premium_360' as const,
    has360Tour: !!property.iframe360Link,
    contactInfo: {
      name: property.propertyOwnerName || agence.name,
      phone: property.phoneNumber || agence.phoneNumber || '+213 561 278 961',
      email: agence.email || 'contact@visitehub.com',
      isAgency: property.propertyOwnerType === 'Agence immobilière',
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/agences" className="hover:text-teal-600">Agences</Link>
            <span>/</span>
            <Link href={`/agences/${agence.slug}`} className="hover:text-teal-600">{agence.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <PropertyReturnButton />
        
        {/* Hero Section with 360 Tour */}
        <div className="mb-8">
          <PropertyHero iframe360Link={property.iframe360Link} />
        </div>

        {/* Basic Info */}
        <PropertyBasicInfo
          title={property.title}
          price={property.price}
          transactionType={property.transactionType}
          type={property.type as 'apartment' | 'house' | 'villa' | 'land' | 'commercial'}
          surface={property.surface}
          bedrooms={property.bedrooms}
          etage={(property as any).etage}
          rentPeriod={undefined}
          propertyOwnerType={property.propertyOwnerType}
          propertyOwnerName={property.propertyOwnerName}
          createdAt={property.createdAt}
        />

        {/* Property Details */}
        <div className="mb-8">
          <PropertyDetails property={transformedProperty as any} />
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Galerie Photos</h2>
            <PropertyGallery
              images={property.images || []}
              selectedIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
              propertyTitle={property.title}
              propertyType={(() => {
                const types: Record<string, string> = {
                  apartment: 'Appartement',
                  villa: 'Villa',
                  studio: 'Studio',
                  house: 'Maison',
                  land: 'Terrain',
                  commercial: 'Commercial'
                };
                return types[property.type] || property.type;
              })()}
              propertyLocation={`${property.daira || ''}${property.daira && property.wilaya ? ', ' : ''}${property.wilaya || ''}`.trim()}
              transactionType={property.transactionType}
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="mb-8">
          <PropertyContactDetails
            propertyId={property.id}
            phoneNumber={property.phoneNumber}
            address={property.address || ''}
            city={property.daira}
            wilaya={property.wilaya || ''}
            propertyOwnerType={property.propertyOwnerType}
            propertyOwnerName={property.propertyOwnerName}
          />
        </div>

        {/* Agency Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">Proposé par</h3>
          <Link href={`/agences/${agence.slug}`} className="block hover:bg-gray-50 rounded-lg p-4 -mx-2 transition-colors">
            <p className="font-semibold text-gray-900 mb-1">{agence.name}</p>
            <p className="text-sm text-gray-600 mb-2">{agence.daira}, {agence.wilaya}</p>
            <p className="text-sm text-teal-600 hover:underline">Voir toutes les propriétés →</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
