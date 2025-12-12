'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyOwner } from '../../../../../api/types';
import { apiService } from '../../../../../api';
import PropertyOwnerForm from '../../../components/property-owners/PropertyOwnerForm';

export default function EditPropertyOwner({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [propertyOwner, setPropertyOwner] = useState<PropertyOwner | null>(null);
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

    const fetchPropertyOwner = async () => {
      try {
        setLoading(true);
        setError(null);
        const owner = await apiService.getPropertyOwner(id);
        setPropertyOwner(owner);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property owner');
        console.error('Error fetching property owner:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyOwner();
  }, [id]);

  const handlePropertyOwnerUpdated = (updatedOwner: PropertyOwner) => {
    // Redirect to property owner detail page after successful update
    router.push(`/admin/property-owners/${updatedOwner.id}`);
  };

  const handleCancel = () => {
    if (id) {
      router.push(`/admin/property-owners/${id}`);
    } else {
      router.push('/admin/property-owners');
    }
  };

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
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Property Owner</h1>
              <p className="mt-2 text-gray-600">
                Update information for {propertyOwner.name}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to {propertyOwner.name}
            </button>
          </div>
        </div>

        {/* Property Owner Form */}
        <PropertyOwnerForm
          propertyOwner={propertyOwner}
          onSave={handlePropertyOwnerUpdated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
