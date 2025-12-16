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
  price: string;
  surface: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  description?: string;
  images?: string[];
  slug: string;
  transactionType: 'vendre' | 'location';
  virtualTour?: string;
  amenities?: string[];
  nearbyPlaces?: Array<{ id: string; name: string; distance: string; icon: string; displayOrder: number; createdAt: string }>;
  papers?: string[];
  address?: string;
  createdAt?: string;
  phoneNumber?: string;
  propertyOwnerType?: string;
  propertyOwnerName?: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  wilaya: string;
  daira: string;
  address?: string;
}

interface Promoteur {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  email?: string;
}

interface PropertyPageProps {
  params: Promise<{ slug: string; projectSlug: string; propertySlug: string }>;
}

const getMockPropertyBySlug = (promoteurSlug: string, projectSlug: string, propertySlug: string) => {
  const data: Record<string, any> = {
    'bessa-promotion': {
      'residence-les-jardins': {
        'appartement-f3-balcon': {
          promoteur: { id: '1', name: 'Bessa Promotion', slug: 'bessa-promotion', phone: '+213 550 11 22 33', email: 'contact@bessa-promotion.dz' },
          project: { id: '1', name: 'Résidence Les Jardins', slug: 'residence-les-jardins', wilaya: '16 - Alger', daira: 'Hydra', address: 'Route de la Forêt, Hydra, Alger' },
          property: {
            id: '1',
            title: 'Appartement F3 avec balcon',
            type: 'apartment',
            price: '18,500,000 DZD',
            surface: 85,
            bedrooms: 3,
            bathrooms: 2,
            floor: 4,
            slug: 'appartement-f3-balcon',
            transactionType: 'vendre',
            description: 'Magnifique appartement F3 de 85m² au 4ème étage avec un grand balcon offrant une vue dégagée sur les espaces verts. Cuisine équipée, salle de bain moderne et finitions haut de gamme.',
            virtualTour: '',
            images: [
              'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            nearbyPlaces: [
              { id: '1', name: 'Parking souterrain', distance: 'Dans le bâtiment', icon: '🅿️', displayOrder: 1, createdAt: new Date().toISOString() },
              { id: '2', name: 'Ascenseur', distance: 'Dans le bâtiment', icon: '🛗', displayOrder: 2, createdAt: new Date().toISOString() },
              { id: '3', name: 'Balcon', distance: '12 m²', icon: '🪟', displayOrder: 3, createdAt: new Date().toISOString() },
              { id: '4', name: 'Interphone', distance: 'Inclus', icon: '📞', displayOrder: 4, createdAt: new Date().toISOString() },
              { id: '5', name: 'Sécurité 24/7', distance: 'Service permanent', icon: '👮', displayOrder: 5, createdAt: new Date().toISOString() },
              { id: '6', name: 'Espaces verts', distance: '100m', icon: '🌳', displayOrder: 6, createdAt: new Date().toISOString() }
            ],
            papers: ['Acte de propriété', 'Livret foncier', 'Certificat de conformité'],
            address: 'Route de la Forêt, Hydra, Alger',
            createdAt: new Date().toISOString(),
            phoneNumber: '+213 550 11 22 33',
            propertyOwnerType: 'Promotion immobilière',
            propertyOwnerName: 'Bessa Promotion'
          }
        },
        'appartement-f4-vue-jardin': {
          promoteur: { id: '1', name: 'Bessa Promotion', slug: 'bessa-promotion', phone: '+213 550 11 22 33', email: 'contact@bessa-promotion.dz' },
          project: { id: '1', name: 'Résidence Les Jardins', slug: 'residence-les-jardins', wilaya: '16 - Alger', daira: 'Hydra', address: 'Route de la Forêt, Hydra, Alger' },
          property: {
            id: '2',
            title: 'Appartement F4 vue jardin',
            type: 'apartment',
            price: '24,000,000 DZD',
            surface: 110,
            bedrooms: 4,
            bathrooms: 2,
            floor: 2,
            slug: 'appartement-f4-vue-jardin',
            transactionType: 'vendre',
            description: 'Spacieux appartement F4 de 110m² au 2ème étage avec vue imprenable sur le jardin. 4 chambres lumineuses, 2 salles de bains, grand salon et cuisine moderne entièrement équipée.',
            virtualTour: '',
            images: [
              'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            nearbyPlaces: [
              { id: '1', name: 'Parking souterrain', distance: 'Dans le bâtiment', icon: '🅿️', displayOrder: 1, createdAt: new Date().toISOString() },
              { id: '2', name: 'Ascenseur', distance: 'Dans le bâtiment', icon: '🛗', displayOrder: 2, createdAt: new Date().toISOString() },
              { id: '3', name: 'Balcon', distance: '15 m²', icon: '🪟', displayOrder: 3, createdAt: new Date().toISOString() },
              { id: '4', name: 'Climatisation', distance: 'Toutes les pièces', icon: '❄️', displayOrder: 4, createdAt: new Date().toISOString() },
              { id: '5', name: 'Interphone', distance: 'Inclus', icon: '📞', displayOrder: 5, createdAt: new Date().toISOString() },
              { id: '6', name: 'Sécurité 24/7', distance: 'Service permanent', icon: '👮', displayOrder: 6, createdAt: new Date().toISOString() },
              { id: '7', name: 'Commerces', distance: '50m', icon: '🏪', displayOrder: 7, createdAt: new Date().toISOString() }
            ],
            papers: ['Acte de propriété', 'Livret foncier', 'Certificat de conformité'],
            address: 'Route de la Forêt, Hydra, Alger',
            createdAt: new Date().toISOString(),
            phoneNumber: '+213 550 11 22 33',
            propertyOwnerType: 'Promotion immobilière',
            propertyOwnerName: 'Bessa Promotion'
          }
        }
      }
    }
  };
  
  return data[promoteurSlug]?.[projectSlug]?.[propertySlug] || null;
};

export default function PropertyPage({ params }: PropertyPageProps) {
  const { slug: promoteurSlug, projectSlug, propertySlug } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [promoteur, setPromoteur] = useState<Promoteur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getMockPropertyBySlug(promoteurSlug, projectSlug, propertySlug);
        if (!data) {
          setError('Appartement non trouvé');
        } else {
          setProperty(data.property);
          setProject(data.project);
          setPromoteur(data.promoteur);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Appartement non trouvé');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [promoteurSlug, projectSlug, propertySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !property || !project || !promoteur) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <div className="mt-2 text-sm text-red-700">{error || 'Appartement non trouvé'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const transformedProperty = {
    ...property,
    city: project.daira,
    features: property.nearbyPlaces?.map(p => p.name) || [],
    nearbyPlaces: property.nearbyPlaces || [],
    papers: property.papers || [],
    serviceTier: 'premium_360' as const,
    has360Tour: !!property.virtualTour,
    contactInfo: {
      name: property.propertyOwnerName || promoteur.name,
      phone: property.phoneNumber || promoteur.phone || '+213 561 278 961',
      email: promoteur.email || 'contact@visitehub.com',
      isAgency: property.propertyOwnerType === 'Agence immobilière' || property.propertyOwnerType === 'Promotion immobilière',
    },
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: 'Appartement',
      villa: 'Villa',
      studio: 'Studio',
      house: 'Maison',
      land: 'Terrain',
      commercial: 'Commercial'
    };
    return types[type] || type;
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/promoteurs" className="hover:text-emerald-600">Promoteurs</Link>
            <span>/</span>
            <Link href={`/promoteurs/${promoteur.slug}`} className="hover:text-emerald-600">{promoteur.name}</Link>
            <span>/</span>
            <Link href={`/promoteurs/${promoteur.slug}/${project.slug}`} className="hover:text-emerald-600">{project.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <PropertyReturnButton />
        <div className="mb-8">
          <PropertyHero iframe360Link={property.virtualTour} />
        </div>
        <PropertyBasicInfo
          title={property.title}
          price={property.price}
          transactionType={property.transactionType}
          type={property.type as any}
          surface={property.surface}
          bedrooms={property.bedrooms}
          etage={property.floor}
          propertyOwnerType={property.propertyOwnerType}
          propertyOwnerName={property.propertyOwnerName}
          createdAt={property.createdAt}
        />
        <div className="mb-8">
          <PropertyDetails property={transformedProperty as any} />
        </div>
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Galerie Photos</h2>
            <PropertyGallery
              images={property.images || []}
              selectedIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
              propertyTitle={property.title}
              propertyType={getPropertyTypeLabel(property.type)}
              propertyLocation={`${project.daira}, ${project.wilaya}`}
              transactionType={property.transactionType}
            />
          </div>
        </div>
        <div className="mb-8">
          <PropertyContactDetails
            phoneNumber={property.phoneNumber || promoteur.phone}
            address={property.address || project.address || ''}
            city={project.daira}
            wilaya={project.wilaya}
            propertyOwnerType={property.propertyOwnerType}
            propertyOwnerName={property.propertyOwnerName || promoteur.name}
          />
        </div>
      </div>
    </main>
  );
}
