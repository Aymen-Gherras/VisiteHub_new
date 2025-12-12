'use client';

import { useState } from 'react';
import { Agence } from '../../../../../api';

interface BasicInfoSectionProps {
  agenceData: Partial<Agence>;
  setAgenceData: (data: Partial<Agence>) => void;
  onNext: () => void;
}

export default function BasicInfoSection({ agenceData, setAgenceData, onNext }: BasicInfoSectionProps) {
  const [name, setName] = useState(agenceData.name || '');
  const [description, setDescription] = useState(agenceData.description || '');
  const [specializations, setSpecializations] = useState(
    Array.isArray(agenceData.specializations) 
      ? agenceData.specializations.join(', ') 
      : agenceData.specializations || ''
  );
  const [experienceYears, setExperienceYears] = useState(agenceData.experienceYears?.toString() || '');

  const handleNext = () => {
    if (!name.trim()) {
      alert('Please enter the agency name');
      return;
    }

    setAgenceData({
      ...agenceData,
      name: name.trim(),
      description: description.trim() || undefined,
      specializations: specializations.trim() 
        ? specializations.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : undefined,
      experienceYears: experienceYears ? parseInt(experienceYears) : undefined
    });

    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Enter the basic details about the real estate agency</p>
      </div>

      {/* Agency Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agency Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter agency name (e.g., Century 21 Alger)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          This will be displayed as the main agency name on the website
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agency Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a brief description of the agency, its services, expertise, and market focus..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
        <p className="text-xs text-gray-500 mt-1">
          This description will appear on the agency profile page (optional)
        </p>
      </div>

      {/* Experience and Specializations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            placeholder="0"
            min="0"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of years in real estate business (optional)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specializations
          </label>
          <input
            type="text"
            value={specializations}
            onChange={(e) => setSpecializations(e.target.value)}
            placeholder="e.g., Résidentiel, Commercial, Terrain, Luxe"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Areas of expertise, separated by commas (optional)
          </p>
        </div>
      </div>

      {/* Agency Type Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">🏢</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Real Estate Agency</h3>
            <p className="text-sm text-blue-700">
              Real estate agencies help clients buy, sell, and rent properties. They provide market expertise, 
              property valuation, and handle transactions between buyers and sellers.
            </p>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
        >
          <span>Next: Contact & Location</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
