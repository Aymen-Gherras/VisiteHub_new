'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { PropertyHero } from '@/app/components/properties/PropertyHero';
import { PropertyBasicInfo } from '@/app/components/properties/PropertyBasicInfo';
import { PropertyDetails } from '@/app/components/properties/PropertyDetails';
import { PropertyGallery } from '@/app/components/properties/PropertyGallery';
import { PropertyContactDetails } from '@/app/components/properties/PropertyContactDetails';
import { PropertyReturnButton } from '@/app/components/properties/PropertyReturnButton';

interface Property {
  id: string;
  title: string;
  type: string;
  price: string | number;
  surface: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  description?: string;
  images?: string[];
  slug: string;
  transactionType: 'vendre' | 'location';
  iframe360Link?: string;
  amenities?: string[];
  nearbyPlaces?: Array<{ id: string; name: string; distance: string; icon: string; displayOrder: number; createdAt: string }>;
  papers?: string[];
  address?: string;
  wilaya?: string;
  daira?: string;
  createdAt?: string;
  phoneNumber?: string;
  propertyOwnerType?: string;
  propertyOwnerName?: string;
}

interface Agence {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  email?: string;
  wilaya: string;
  daira?: string;
}

interface PropertyPageProps {
  params: Promise<{ slug: string; propertySlug: string }>;
}

const getMockPropertyBySlug = (agenceSlug: string, propertySlug: string) => {
  const data: Record<string, Record<string, { agence: Agence; property: Property }>> = {
    'immobilier-excellence': {
      'appartement-f3-vue-mer': {
        agence: { 
          id: '1', 
          name: 'Immobilier Excellence', 
          slug: 'immobilier-excellence', 
          phone: '+213 550 11 22 33', 
          email: 'contact@immobilier-excellence.dz',
          wilaya: '16 - Alger',
          daira: 'Alger Centre'
        },
        property: {
          id: '1',
          title: 'Appartement F3 Vue Mer',
          type: 'apartment',
          price: 15000000,
          surface: 95,
          bedrooms: 3,
          bathrooms: 2,
          floor: 5,
          slug: 'appartement-f3-vue-mer',
          transactionType: 'vendre',
          description: 'Superbe appartement F3 de 95m² au 5ème étage avec une vue imprenable sur la mer. Cuisine équipée moderne, salle de bain rénovée, parquet au sol et double vitrage. Proche de toutes commodités.',
          iframe360Link: '',
          images: [
            'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          nearbyPlaces: [
            { id: '1', name: 'Parking', distance: 'Dans le bâtiment', icon: '🅿️', displayOrder: 1, createdAt: new Date().toISOString() },
            { id: '2', name: 'Ascenseur', distance: 'Inclus', icon: '🛗', displayOrder: 2, createdAt: new Date().toISOString() },
            { id: '3', name: 'Balcon', distance: '8 m²', icon: '🪟', displayOrder: 3, createdAt: new Date().toISOString() },
            { id: '4', name: 'Patisserie la rosa', distance: '100m', icon: '🍰', displayOrder: 4, createdAt: new Date().toISOString() },
            { id: '5', name: 'Arret de bus', distance: '50m', icon: '🚌', displayOrder: 5, createdAt: new Date().toISOString() },
            { id: '6', name: 'Pharmacie', distance: '200m', icon: '💊', displayOrder: 6, createdAt: new Date().toISOString() }
          ],
          amenities: ['Parking', 'Ascenseur', 'Balcon'],
          papers: ['Acte de propriété', 'Livret foncier'],
          address: '15 Rue Didouche Mourad, Alger Centre',
          wilaya: '16 - Alger',
          daira: 'Alger Centre',
          createdAt: new Date().toISOString(),
          phoneNumber: '+213 550 11 22 33',
          propertyOwnerType: 'Agence immobilière',
          propertyOwnerName: 'Immobilier Excellence'
        }
      },
      'villa-moderne-hydra': {
        agence: { 
          id: '1', 
          name: 'Immobilier Excellence', 
          slug: 'immobilier-excellence', 
          phone: '+213 550 11 22 33', 
          email: 'contact@immobilier-excellence.dz',
          wilaya: '16 - Alger',
          daira: 'Alger Centre'
        },
        property: {
          id: '2',
          title: 'Villa Moderne Hydra',
          type: 'villa',
          price: 85000000,
          surface: 350,
          bedrooms: 5,
          bathrooms: 3,
          slug: 'villa-moderne-hydra',
          transactionType: 'vendre',
          description: 'Magnifique villa moderne de 350m² située dans le quartier huppé d\'Hydra. Architecture contemporaine avec piscine privée, jardin paysager de 200m², garage pour 2 véhicules et système de sécurité complet. Finitions luxueuses avec matériaux nobles.',
          iframe360Link: '',
          images: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          nearbyPlaces: [
            { id: '1', name: 'Piscine', distance: 'Privée', icon: '🏊', displayOrder: 1, createdAt: new Date().toISOString() },
            { id: '2', name: 'Jardin', distance: '200 m²', icon: '🌳', displayOrder: 2, createdAt: new Date().toISOString() },
            { id: '3', name: 'Garage', distance: '2 places', icon: '🚗', displayOrder: 3, createdAt: new Date().toISOString() },
            { id: '4', name: 'Sécurité 24/7', distance: 'Inclus', icon: '👮', displayOrder: 4, createdAt: new Date().toISOString() },
            { id: '5', name: 'C.E.M Tripoli', distance: '300m', icon: '🏫', displayOrder: 5, createdAt: new Date().toISOString() },
            { id: '6', name: 'Climatisation', distance: 'Toutes les pièces', icon: '❄️', displayOrder: 6, createdAt: new Date().toISOString() }
          ],
          amenities: ['Piscine', 'Jardin', 'Garage'],
          papers: ['Acte de propriété', 'Livret foncier'],
          address: 'Hydra, Alger',
          wilaya: '16 - Alger',
          daira: 'Hydra',
          createdAt: new Date().toISOString(),
          phoneNumber: '+213 550 11 22 33',
          propertyOwnerType: 'Agence immobilière',
          propertyOwnerName: 'Immobilier Excellence'
        }
      }
    }
  };
  
  return data[agenceSlug]?.[propertySlug] || null;
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
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getMockPropertyBySlug(agenceSlug, propertySlug);
        if (!data) {
          setError('Propriété non trouvée');
        } else {
          setProperty(data.property);
          setAgence(data.agence);
        }
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
    city: property.daira,
    features: property.nearbyPlaces?.map(p => p.name) || [],
    nearbyPlaces: property.nearbyPlaces || [],
    papers: property.papers || [],
    serviceTier: 'premium_360' as const,
    has360Tour: !!property.iframe360Link,
    contactInfo: {
      name: property.propertyOwnerName || agence.name,
      phone: property.phoneNumber || agence.phone || '+213 561 278 961',
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
          etage={property.floor}
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
