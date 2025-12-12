'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgenceCreationTabs from '../../components/agences/AgenceCreationTabs';
import { Agence } from '../../../../api';

export default function CreateAgence() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [agenceData, setAgenceData] = useState<Partial<Agence>>({});

  const handleAgenceCreated = (agence: Agence) => {
    // Redirect to agences list after successful creation
    router.push('/admin/agences');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Agence</h1>
              <p className="mt-2 text-gray-600">
                Add a new real estate agency with detailed information
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/agences')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Agences
            </button>
          </div>
        </div>

        {/* Agence Creation Tabs */}
        <AgenceCreationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          agenceData={agenceData}
          setAgenceData={setAgenceData}
          onAgenceCreated={handleAgenceCreated}
        />
      </div>
    </div>
  );
}
