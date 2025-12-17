'use client';

import { useState, useEffect } from 'react';
import { Property, apiService, Agence, Promoteur, Project } from '../../../../../api';

interface BasicInfoSectionProps {
  propertyData: Partial<Property>;
  setPropertyData: (data: Partial<Property>) => void;
  onNext: () => void;
}

const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: '🏢', description: 'Modern apartment units' },
  { id: 'house', label: 'House', icon: '🏠', description: 'Traditional houses' },
  { id: 'villa', label: 'Villa', icon: '🏡', description: 'Luxury villas' },
  { id: 'land', label: 'Land', icon: '🌱', description: 'Buildable land plots' },
  { id: 'studio', label: 'Studio', icon: '🏘️', description: 'Compact studio units' },
  { id: 'commercial', label: 'Commercial', icon: '🏪', description: 'Commercial properties' }
];

const transactionTypes = [
  { id: 'vendre', label: 'For Sale', icon: '💰', description: 'Purchase property' },
  { id: 'location', label: 'For Rent', icon: '📋', description: 'Rent property' }
];

const rentPeriods = [
  { id: 'month', label: 'Per Month', icon: '📅', description: 'Monthly rental' },
  { id: 'day', label: 'Per Day', icon: '⏰', description: 'Daily rental' }
];

const ownerTypes = [
  { id: 'Particulier', label: 'Particulier', icon: '👤', description: 'Private individual' },
  { id: 'Agence immobilière', label: 'Agence immobilière', icon: '🏢', description: 'Real estate agency' },
  { id: 'Promotion immobilière', label: 'Promotion immobilière', icon: '🏗️', description: 'Real estate development' }
];

export default function BasicInfoSection({ propertyData, setPropertyData, onNext }: BasicInfoSectionProps) {
  const [selectedType, setSelectedType] = useState(propertyData.type || '');
  const [selectedTransaction, setSelectedTransaction] = useState(propertyData.transactionType || '');
  const [selectedRentPeriod, setSelectedRentPeriod] = useState((propertyData as any)?.rentPeriod || 'month');
  const [selectedOwnerType, setSelectedOwnerType] = useState(propertyData.propertyOwnerType || 'Particulier');
  const [propertyOwnerName, setPropertyOwnerName] = useState((propertyData as any)?.propertyOwnerName || '');
  const [title, setTitle] = useState(propertyData.title || '');
  
  // Agences and Promoteurs state
  const [agences, setAgences] = useState<Agence[]>([]);
  const [promoteurs, setPromoteurs] = useState<Promoteur[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  // Projects state (Promotion immobilière)
  const [selectedPromoteurId, setSelectedPromoteurId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>((propertyData as any)?.projectId || '');
  const [loadingProjects, setLoadingProjects] = useState(false);
  
  // Ensure price is always treated as a string, preserving full text like "1 milliards"
  const initialPrice = propertyData.price !== undefined && propertyData.price !== null 
    ? (typeof propertyData.price === 'string' ? propertyData.price : String(propertyData.price))
    : '';
  const [price, setPrice] = useState(initialPrice);
  const [surface, setSurface] = useState(propertyData.surface?.toString() || '');

  // Fetch agences and promoteurs on mount
  useEffect(() => {
    const fetchOwners = async () => {
      setLoadingOwners(true);
      try {
        const [agencesData, promoteursData] = await Promise.all([
          apiService.getAgences(),
          apiService.getPromoteurs()
        ]);
        setAgences(agencesData);
        setPromoteurs(promoteursData);
      } catch (err) {
        console.error('Error fetching agences/promoteurs:', err);
      } finally {
        setLoadingOwners(false);
      }
    };
    fetchOwners();
  }, []);

  // If editing and we only have promoteur name, infer promoteurId
  useEffect(() => {
    if (selectedOwnerType !== 'Promotion immobilière') return;
    if (selectedPromoteurId) return;
    if (!propertyOwnerName) return;
    const found = promoteurs.find((p) => p.name === propertyOwnerName);
    if (found) setSelectedPromoteurId(found.id);
  }, [selectedOwnerType, selectedPromoteurId, propertyOwnerName, promoteurs]);

  // Fetch projects for selected promoteur
  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedOwnerType !== 'Promotion immobilière' || !selectedPromoteurId) {
        setProjects([]);
        return;
      }

      setLoadingProjects(true);
      try {
        const data = await apiService.listPromoteurProjects(selectedPromoteurId);
        setProjects(data);

        if (selectedProjectId && !data.some((p) => p.id === selectedProjectId)) {
          setSelectedProjectId('');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjects([]);
        setSelectedProjectId('');
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [selectedOwnerType, selectedPromoteurId, selectedProjectId]);

  const handleNext = () => {
    if (!selectedType || !selectedTransaction || !title || !price || !surface || !selectedOwnerType) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate property owner name if owner type is agency or promotion
    if ((selectedOwnerType === 'Agence immobilière' || selectedOwnerType === 'Promotion immobilière') && !propertyOwnerName.trim()) {
      alert('Please enter the property owner name (agency or promotion company name)');
      return;
    }

    // Promotion immobilière requires project selection
    if (selectedOwnerType === 'Promotion immobilière') {
      if (!selectedPromoteurId) {
        alert('Please select a promotion company');
        return;
      }
      if (!selectedProjectId) {
        alert('Please select a project');
        return;
      }
    }

    setPropertyData({
      ...propertyData,
      type: selectedType as any,
      transactionType: selectedTransaction as any,
      rentPeriod: selectedTransaction === 'location' ? selectedRentPeriod as any : undefined,
      propertyOwnerType: selectedOwnerType,
      propertyOwnerName: (selectedOwnerType === 'Agence immobilière' || selectedOwnerType === 'Promotion immobilière') ? propertyOwnerName.trim() : undefined,
      projectId: selectedOwnerType === 'Promotion immobilière' ? selectedProjectId : undefined,
      title,
      price: price, // Keep as string
      surface: Number(surface)
    });

    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Start by selecting the property type and basic details</p>
      </div>

      {/* Property Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter property title (e.g., Modern 3BR Apartment in Alger)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Property Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Property Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
                ${selectedType === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Transaction Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactionTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTransaction(type.id)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
                ${selectedTransaction === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rent Period Selection - Only show for rental properties */}
      {selectedTransaction === 'location' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Rent Period *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rentPeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedRentPeriod(period.id)}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
                  ${selectedRentPeriod === period.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{period.icon}</span>
                  <div>
                    <div className="font-medium">{period.label}</div>
                    <div className="text-sm text-gray-500">{period.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Property Owner Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Property Owner Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ownerTypes.map((ownerType) => (
            <button
              key={ownerType.id}
              onClick={() => {
                setSelectedOwnerType(ownerType.id);
                if (ownerType.id === 'Particulier') {
                  setPropertyOwnerName('');
                  setSelectedPromoteurId('');
                  setProjects([]);
                  setSelectedProjectId('');
                }

                if (ownerType.id === 'Agence immobilière') {
                  setSelectedPromoteurId('');
                  setProjects([]);
                  setSelectedProjectId('');
                }

                if (ownerType.id === 'Promotion immobilière') {
                  setPropertyOwnerName('');
                  setProjects([]);
                  setSelectedProjectId('');
                }
              }}
              className={`
                p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
                ${selectedOwnerType === ownerType.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{ownerType.icon}</span>
                <div>
                  <div className="font-medium">{ownerType.label}</div>
                  <div className="text-sm text-gray-500">{ownerType.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Property Owner Name - Only show for Agence immobilière or Promotion immobilière */}
      {(selectedOwnerType === 'Agence immobilière' || selectedOwnerType === 'Promotion immobilière') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedOwnerType === 'Agence immobilière' ? 'Select Agency' : 'Select Promotion Company'} *
          </label>
          {loadingOwners ? (
            <div className="flex items-center justify-center py-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-sm text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              {selectedOwnerType === 'Agence immobilière' ? (
                <select
                  value={propertyOwnerName}
                  onChange={(e) => setPropertyOwnerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an agency...</option>
                  {agences.length === 0 ? (
                    <option value="" disabled>No agencies available</option>
                  ) : (
                    agences.map((agence) => (
                      <option key={agence.id} value={agence.name}>
                        {agence.name}
                      </option>
                    ))
                  )}
                </select>
              ) : (
                <div className="space-y-4">
                  <select
                    value={selectedPromoteurId}
                    onChange={(e) => {
                      const nextPromoteurId = e.target.value;
                      setSelectedPromoteurId(nextPromoteurId);
                      const found = promoteurs.find((p) => p.id === nextPromoteurId);
                      setPropertyOwnerName(found?.name || '');
                      setSelectedProjectId('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a promotion company...</option>
                    {promoteurs.length === 0 ? (
                      <option value="" disabled>No promotion companies available</option>
                    ) : (
                      promoteurs.map((promoteur) => (
                        <option key={promoteur.id} value={promoteur.id}>
                          {promoteur.name}
                        </option>
                      ))
                    )}
                  </select>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Project *
                    </label>
                    {loadingProjects ? (
                      <div className="flex items-center justify-center py-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                        <span className="ml-2 text-sm text-gray-600">Loading projects...</span>
                      </div>
                    ) : (
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                        disabled={!selectedPromoteurId}
                      >
                        <option value="">
                          {!selectedPromoteurId ? 'Select a promotion company first...' : 'Select a project...'}
                        </option>
                        {selectedPromoteurId && projects.length === 0 ? (
                          <option value="" disabled>No projects available for this promoteur</option>
                        ) : (
                          projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          {selectedOwnerType === 'Agence immobilière' && agences.length === 0 && !loadingOwners && (
            <p className="mt-2 text-sm text-gray-500">
              No agencies found. Please create an agency in the{' '}
              <a href="/admin/agences/create" className="text-purple-600 hover:text-purple-800 underline">
                Agences section
              </a>{' '}
              first.
            </p>
          )}
          {selectedOwnerType === 'Promotion immobilière' && promoteurs.length === 0 && !loadingOwners && (
            <p className="mt-2 text-sm text-gray-500">
              No promotion companies found. Please create a promoter in the{' '}
              <a href="/admin/promoteurs/create" className="text-purple-600 hover:text-purple-800 underline">
                Promoteurs section
              </a>{' '}
              first.
            </p>
          )}
        </div>
      )}

      {/* Price and Surface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (DZD) *
          </label>
          <div className="relative">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='e.g., 1,500,000 or "1 milliards" or "Sur demande"'
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">₋</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter price as number (e.g., 1,500,000) or text (e.g., "1 milliards", "Sur demande")
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Surface Area (m²) *
          </label>
          <input
            type="number"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
        >
          <span>Next: Property Details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
