'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PropertyOwner, PropertyOwnerType, PropertyOwnerStatistics } from '../../../../api/types';
import { apiService } from '../../../../api';

export default function PropertyOwnerDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [propertyOwner, setPropertyOwner] = useState<PropertyOwner | null>(null);
  const [statistics, setStatistics] = useState<PropertyOwnerStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ownerData, statsData] = await Promise.all([
          apiService.getPropertyOwner(id),
          apiService.getPropertyOwnerStatistics(id)
        ]);
        
        setPropertyOwner(ownerData);
        setStatistics(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property owner');
        console.error('Error fetching property owner:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !propertyOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error || 'Property owner not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {propertyOwner.imageUrl && (
                <img
                  src={propertyOwner.imageUrl}
                  alt={propertyOwner.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{propertyOwner.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    propertyOwner.ownerType === PropertyOwnerType.AGENCE 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {propertyOwner.ownerType === PropertyOwnerType.AGENCE ? 'Agence' : 'Promoteur'}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{propertyOwner.slug}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/admin/property-owners/${propertyOwner.id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Owner
              </Link>
              <button
                onClick={() => router.push('/admin/property-owners')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Property Owners
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {propertyOwner.coverImage && (
          <div className="mb-8">
            <img
              src={propertyOwner.coverImage}
              alt={`${propertyOwner.name} cover`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.stats.totalProperties}</p>
                </div>
              </div>
            </div>

            {propertyOwner.ownerType === PropertyOwnerType.PROMOTEUR && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-semibold text-gray-900">{statistics.stats.totalProjects}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Properties</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.stats.activeProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured Properties</p>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.stats.featuredProperties}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {propertyOwner.description && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{propertyOwner.description}</p>
              </div>
            )}

            {/* Projects (for promoteurs) */}
            {propertyOwner.ownerType === PropertyOwnerType.PROMOTEUR && propertyOwner.projects && propertyOwner.projects.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                  <Link
                    href={`/admin/property-owners/${propertyOwner.id}/projects`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View All Projects →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {propertyOwner.projects.slice(0, 4).map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">{project.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Properties */}
            {propertyOwner.properties && propertyOwner.properties.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Recent Properties</h3>
                  <Link
                    href={`/admin/properties?owner=${propertyOwner.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View All Properties →
                  </Link>
                </div>
                <div className="space-y-3">
                  {propertyOwner.properties.slice(0, 5).map((property) => (
                    <div key={property.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                        <p className="text-sm text-gray-500">{property.wilaya}, {property.daira}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{property.price} DZD</p>
                        <p className="text-sm text-gray-500">{property.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {propertyOwner.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{propertyOwner.phoneNumber}</span>
                  </div>
                )}
                {propertyOwner.email && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{propertyOwner.email}</span>
                  </div>
                )}
                {propertyOwner.website && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                    <a href={propertyOwner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {propertyOwner.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {(propertyOwner.wilaya || propertyOwner.address) && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div className="space-y-2">
                  {propertyOwner.wilaya && (
                    <p className="text-gray-700">
                      <span className="font-medium">Wilaya:</span> {propertyOwner.wilaya}
                      {propertyOwner.daira && `, ${propertyOwner.daira}`}
                    </p>
                  )}
                  {propertyOwner.address && (
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span> {propertyOwner.address}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Created:</span> {new Date(propertyOwner.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Updated:</span> {new Date(propertyOwner.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">ID:</span> {propertyOwner.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
