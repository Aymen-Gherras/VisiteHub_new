'use client';

import { useState } from 'react';
import { Promoteur } from '../../../../../api';

interface BasicInfoSectionProps {
  promoteurData: Partial<Promoteur>;
  setPromoteurData: (data: Partial<Promoteur>) => void;
  onNext: () => void;
}

export default function BasicInfoSection({ promoteurData, setPromoteurData, onNext }: BasicInfoSectionProps) {
  const [name, setName] = useState(promoteurData.name || '');
  const [description, setDescription] = useState(promoteurData.description || '');

  const handleNext = () => {
    if (!name.trim()) {
      alert('Please enter the promoteur name');
      return;
    }

    setPromoteurData({
      ...promoteurData,
      name: name.trim(),
      description: description.trim() || undefined
    });

    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Enter the basic details about the property developer</p>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter company name (e.g., Cevital Immobilier)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          This will be displayed as the main company name on the website
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a brief description of the company, its history, expertise, and notable projects..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
        <p className="text-xs text-gray-500 mt-1">
          This description will appear on the company profile page (optional)
        </p>
      </div>

      {/* Company Type Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">🏗️</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Property Developer</h3>
            <p className="text-sm text-blue-700">
              Property developers (promoteurs) are companies that develop new real estate projects. 
              They typically handle everything from land acquisition to construction and sales of new properties.
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
