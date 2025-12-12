'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PromoteurCreationTabs from '../../../components/promoteurs/PromoteurCreationTabs';
import { Promoteur } from '../../../../../api';
import { apiService } from '../../../../../api';
import { useAuth } from '../../../../../context/AuthContext';

export default function EditPromoteur({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [promoteurData, setPromoteurData] = useState<Partial<Promoteur>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoteurId, setPromoteurId] = useState<string>('');

  useEffect(() => {
    const initializePromoteur = async () => {
      try {
        const resolvedParams = await params;
        setPromoteurId(resolvedParams.id);
        
        setLoading(true);
        setError(null);
        const data = await apiService.getPromoteur(resolvedParams.id);
        setPromoteurData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch promoteur');
        console.error('Error fetching promoteur:', err);
      } finally {
        setLoading(false);
      }
    };

    initializePromoteur();
  }, [params]);

  const handlePromoteurUpdated = (promoteur: Promoteur) => {
    router.push('/admin/promoteurs');
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading promoteur</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Promoteur</h1>
              <p className="mt-2 text-gray-600">
                Update promoteur information and details
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

        <PromoteurCreationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          promoteurData={promoteurData}
          setPromoteurData={setPromoteurData}
          onPromoteurCreated={handlePromoteurUpdated}
          isEditing={true}
          promoteurId={promoteurId}
          token={token || ''}
        />
      </div>
    </div>
  );
}
