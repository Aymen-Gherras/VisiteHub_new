'use client';

import { useRouter } from 'next/navigation';
import PropertyOwnerForm from '../../components/property-owners/PropertyOwnerForm';
import { PropertyOwner } from '../../../../api/types';

export default function CreatePropertyOwner() {
  const router = useRouter();

  const handlePropertyOwnerCreated = (propertyOwner: PropertyOwner) => {
    // Redirect to property owners list after successful creation
    router.push('/admin/property-owners');
  };

  const handleCancel = () => {
    router.push('/admin/property-owners');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Property Owner</h1>
              <p className="mt-2 text-gray-600">
                Add a new agence or promoteur to manage properties
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Property Owners
            </button>
          </div>
        </div>

        {/* Property Owner Form */}
        <PropertyOwnerForm
          onSave={handlePropertyOwnerCreated}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
