'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCreationTabs from '../../components/properties/PropertyCreationTabs';
import { Property } from '../../../../api';

export default function CreateProperty() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [propertyData, setPropertyData] = useState<Partial<Property>>({});

  const handlePropertyCreated = (property: Property) => {
    // Redirect to properties list after successful creation
    router.push('/admin/properties');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
              <p className="mt-2 text-gray-600">
                Add a new property listing with detailed information
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

        {/* Property Creation Tabs */}
        <PropertyCreationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          propertyData={propertyData}
          setPropertyData={setPropertyData}
          onPropertyCreated={handlePropertyCreated}
        />
      </div>
    </div>
  );
}
