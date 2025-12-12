'use client';

import React, { useEffect, useState } from 'react';
import { apiService, Property } from '../../../api';
import { PropertyHero } from '../../components/properties/PropertyHero';
import { PropertyBasicInfo } from '../../components/properties/PropertyBasicInfo';
import { PropertyDetails } from '../../components/properties/PropertyDetails';
import { PropertyGallery } from '../../components/properties/PropertyGallery';
import { PropertyContactDetails } from '../../components/properties/PropertyContactDetails';
import { PropertyReturnButton } from '../../components/properties/PropertyReturnButton';
import { PropertyContact } from '../../components/properties/PropertyContact';
import { NearbyPlacesList } from '../../components/properties/NearbyPlacesList';

export default function PropertyBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchBySlug = async () => {
      try {
        const { slug } = await params;
        setLoading(true);
        setError(null);
        if (!slug) throw new Error('Invalid property slug');
        // Accept both slug and UUID or slug-with-UUID at end
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const tailUuidMatch = slug.match(/([0-9a-fA-F-]{36})$/);
        let data: Property;
        if (uuidRegex.test(slug)) {
          data = await apiService.getProperty(slug);
        } else if (tailUuidMatch) {
          data = await apiService.getProperty(tailUuidMatch[1]);
        } else {
          data = await apiService.getPropertyBySlug(slug);
        }
        setProperty(data);
        if (data && data.id) {
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/properties/${data.id}/view`, {
            method: 'PATCH',
          }).catch(() => {});
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load property';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchBySlug();
  }, [params]);

  useEffect(() => {
    if (!property) return;
    const sessionId = crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const start = Date.now();
    const sendVisit = (durationMs: number) => {
      const durationSeconds = Math.max(1, Math.round(durationMs / 1000));
      apiService
        .recordVisit({
          propertyId: property.id,
          sessionId,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          wilaya: property.wilaya as any,
          daira: (property as any).daira,
          durationSeconds,
        })
        .catch(() => {});
    };
    const handleBeforeUnload = () => sendVisit(Date.now() - start);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') sendVisit(Date.now() - start);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
      sendVisit(Date.now() - start);
    };
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
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
    has360Tour: true,
    contactInfo: {
      name: (property as any).propertyOwnerName || property.propertyOwnerType || 'Propriétaire',
      phone: property.phoneNumber || '+213 561 278 961',
      email: 'contact@visitehub.com',
      isAgency: property.propertyOwnerType === 'Agence immobilière' || property.propertyOwnerType === 'Promotion immobilière',
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <PropertyReturnButton />
        <div className="mb-8">
          <PropertyHero iframe360Link={property.iframe360Link} />
        </div>
        <PropertyBasicInfo
          title={property.title}
          price={property.price}
          transactionType={property.transactionType}
          type={property.type}
          surface={property.surface}
          bedrooms={property.bedrooms}
          etage={(property as any).etage}
          rentPeriod={(property as any).rentPeriod}
          propertyOwnerType={property.propertyOwnerType}
          propertyOwnerName={(property as any).propertyOwnerName}
          createdAt={property.createdAt}
        />
        <div className="mb-8">
          <PropertyDetails property={transformedProperty} />
        </div>
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
              propertyLocation={`${(property as any).daira || ''}${(property as any).daira && property.wilaya ? ', ' : ''}${property.wilaya || ''}`.trim()}
              transactionType={property.transactionType}
            />
          </div>
        </div>
        <div className="mb-8">
          <PropertyContactDetails
            phoneNumber={property.phoneNumber}
            address={property.address}
            city={(property as any).city}
            wilaya={property.wilaya}
            propertyOwnerType={property.propertyOwnerType}
            propertyOwnerName={(property as any).propertyOwnerName}
          />
        </div>
        <div className="flex justify-center">

        </div>
      </div>
      {showContactModal && (
        <PropertyContact property={transformedProperty} onClose={() => setShowContactModal(false)} />
      )}
    </main>
  );
}


