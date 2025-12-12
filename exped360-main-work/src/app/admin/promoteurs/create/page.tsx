'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PromoteurCreationTabs from '../../components/promoteurs/PromoteurCreationTabs';
import { Promoteur } from '../../../../api';

export default function CreatePromoteur() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [promoteurData, setPromoteurData] = useState<Partial<Promoteur>>({});

  const handlePromoteurCreated = (promoteur: Promoteur) => {
    // Redirect to promoteurs list after successful creation
    router.push('/admin/promoteurs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Promoteur</h1>
              <p className="mt-2 text-gray-600">
                Add a new property developer with detailed information
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/promoteurs')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Promoteurs
            </button>
          </div>
        </div>

        {/* Promoteur Creation Tabs */}
        <PromoteurCreationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          promoteurData={promoteurData}
          setPromoteurData={setPromoteurData}
          onPromoteurCreated={handlePromoteurCreated}
        />
      </div>
    </div>
  );
}
