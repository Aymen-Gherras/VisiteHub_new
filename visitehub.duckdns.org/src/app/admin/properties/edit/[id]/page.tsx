'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCreationTabs from '../../../components/properties/PropertyCreationTabs';
import { Property } from '../../../../../api';
import { apiService } from '../../../../../api';
import { useAuth } from '../../../../../context/AuthContext';

export default function EditProperty({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [propertyData, setPropertyData] = useState<Partial<Property>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState<string>('');

  useEffect(() => {
    const initializeProperty = async () => {
      try {
        const resolvedParams = await params;
        setPropertyId(resolvedParams.id);
        
        setLoading(true);
        setError(null);
        const data = await apiService.getProperty(resolvedParams.id);
        setPropertyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeProperty();
  }, [params]);

  const handlePropertyUpdated = (property: Property) => {
    router.push('/admin/properties');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading property</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
            <p className="mt-2 text-gray-600">
              Update property information and details
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/properties')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back to Properties
          </button>
        </div>
      </div>

      <PropertyCreationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        onPropertyCreated={handlePropertyUpdated}
        isEditing={true}
        propertyId={propertyId}
        token={token || ''}
      />
    </div>
  );
}
