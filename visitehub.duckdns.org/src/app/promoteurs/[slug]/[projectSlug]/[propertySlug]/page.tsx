'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { apiService, Project, Promoteur, Property } from '@/api';
import { PropertyHero } from '@/app/components/properties/PropertyHero';
import { PropertyBasicInfo } from '@/app/components/properties/PropertyBasicInfo';
import { PropertyDetails } from '@/app/components/properties/PropertyDetails';
import { PropertyGallery } from '@/app/components/properties/PropertyGallery';
import { PropertyContactDetails } from '@/app/components/properties/PropertyContactDetails';
import { PropertyReturnButton } from '@/app/components/properties/PropertyReturnButton';

interface PropertyPageProps {
  params: Promise<{ slug: string; projectSlug: string; propertySlug: string }>;
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
        setError(null);

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

        const prop = await fetchPropertyBySlugOrId(propertySlug);
        const isInProject =
          prop.propertyOwnerType === 'Promotion immobilière' &&
          !!prop.projectId &&
          prop.projectId === found.id;

        if (!isInProject) {
          setError('Appartement non trouvé');
          return;
        }

        setPromoteur(p);
        setProject(found);
        setProperty(prop);
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
    city: (property as any).city,
    features: property.amenities || [],
    nearbyPlaces: property.nearbyPlaces || [],
    papers: property.papers || [],
    serviceTier: 'premium_360' as const,
    has360Tour: !!property.iframe360Link,
    contactInfo: {
      name: property.propertyOwnerName || promoteur.name,
      phone: property.phoneNumber || promoteur.phoneNumber || '+213 561 278 961',
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
            <Link href={`/promoteurs/${promoteur.slug}/${project.slug || project.id}`} className="hover:text-emerald-600">{project.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <PropertyReturnButton />
        <div className="mb-8">
          <PropertyHero iframe360Link={property.iframe360Link} />
        </div>
        <PropertyBasicInfo
          title={property.title}
          price={property.price}
          transactionType={property.transactionType}
          type={property.type as any}
          surface={property.surface}
          bedrooms={property.bedrooms}
          etage={(property as any).etage}
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
              propertyLocation={`${project.daira}, ${project.wilaya || ''}`.replace(/,\s*$/, '')}
              transactionType={property.transactionType}
            />
          </div>
        </div>
        <div className="mb-8">
          <PropertyContactDetails
            propertyId={property.id}
            phoneNumber={property.phoneNumber || promoteur.phoneNumber}
            address={property.address || project.address || ''}
            city={project.daira}
            wilaya={project.wilaya || ''}
            propertyOwnerType={property.propertyOwnerType}
            propertyOwnerName={property.propertyOwnerName || promoteur.name}
          />
        </div>
      </div>
    </main>
  );
}
