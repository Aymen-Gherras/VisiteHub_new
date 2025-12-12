'use client';

import { useState, useEffect } from 'react';
import { Project, Promoteur, apiService } from '../../../../../api';

// Extended type to handle both display and API formats
type ProjectFormData = Partial<Project> & {
  promoteurId?: string;
};

interface BasicInfoSectionProps {
  projectData: ProjectFormData;
  setProjectData: (data: ProjectFormData) => void;
  onNext: () => void;
}

export default function BasicInfoSection({ projectData, setProjectData, onNext }: BasicInfoSectionProps) {
  const [name, setName] = useState(projectData.name || '');
  const [description, setDescription] = useState(projectData.description || '');
  const [promoteurId, setPromoteurId] = useState(
    projectData.promoteurId || projectData.promoteur?.id || ''
  );
  const [promoteurs, setPromoteurs] = useState<Promoteur[]>([]);
  const [loadingPromoteurs, setLoadingPromoteurs] = useState(true);

  useEffect(() => {
    const fetchPromoteurs = async () => {
      try {
        const data = await apiService.getPromoteurs();
        setPromoteurs(data);
      } catch (error) {
        console.error('Error fetching promoteurs:', error);
      } finally {
        setLoadingPromoteurs(false);
      }
    };

    fetchPromoteurs();
  }, []);

  const handleNext = () => {
    if (!name.trim()) {
      alert('Please enter the project name');
      return;
    }

    if (!promoteurId) {
      alert('Please select a promoteur for this project');
      return;
    }

    setProjectData({
      ...projectData,
      name: name.trim(),
      description: description.trim() || undefined,
      promoteurId
    });

    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Enter the basic details about the development project</p>
      </div>

      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name (e.g., Les Jardins de Sidi Abdellah)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          This will be displayed as the main project name on the website
        </p>
      </div>

      {/* Promoteur Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promoteur (Developer) *
        </label>
        {loadingPromoteurs ? (
          <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading promoteurs...</span>
          </div>
        ) : (
          <select
            value={promoteurId}
            onChange={(e) => setPromoteurId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a promoteur</option>
            {promoteurs.map((promoteur) => (
              <option key={promoteur.id} value={promoteur.id}>
                {promoteur.name}
              </option>
            ))}
          </select>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Select the property developer responsible for this project
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a detailed description of the project, including features, amenities, and unique selling points..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
        <p className="text-xs text-gray-500 mt-1">
          This description will appear on the project detail page (optional)
        </p>
      </div>

      {/* Project Type Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">🏘️</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Development Project</h3>
            <p className="text-sm text-blue-700">
              Projects are real estate developments that contain multiple properties. They help organize 
              properties by location and development phase, making it easier for buyers to find related units.
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
          <span>Next: Location</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
