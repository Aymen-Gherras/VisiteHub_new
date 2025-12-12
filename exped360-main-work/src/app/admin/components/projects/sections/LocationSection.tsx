'use client';

import { useState } from 'react';
import { Project } from '../../../../../api';

// Extended type to handle both display and API formats
type ProjectFormData = Partial<Project> & {
  promoteurId?: string;
};

interface LocationSectionProps {
  projectData: ProjectFormData;
  setProjectData: (data: ProjectFormData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const wilayas = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane'
];

export default function LocationSection({ projectData, setProjectData, onNext, onPrevious }: LocationSectionProps) {
  const [address, setAddress] = useState(projectData.address || '');
  const [wilaya, setWilaya] = useState(projectData.wilaya || '');
  const [daira, setDaira] = useState(projectData.daira || '');
  const [latitude, setLatitude] = useState(projectData.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(projectData.longitude?.toString() || '');

  const handleNext = () => {
    if (!wilaya) {
      alert('Please select a wilaya');
      return;
    }

    // Validate coordinates if provided
    if (latitude && (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) {
      alert('Please enter a valid latitude (-90 to 90)');
      return;
    }

    if (longitude && (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) {
      alert('Please enter a valid longitude (-180 to 180)');
      return;
    }

    setProjectData({
      ...projectData,
      address: address.trim() || undefined,
      wilaya,
      daira: daira.trim() || undefined,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined
    });

    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
        <p className="text-gray-600">Specify the project location and address details</p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Address
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter the full project address"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
        <p className="text-xs text-gray-500 mt-1">
          Full address of the project location (optional)
        </p>
      </div>

      {/* Wilaya and Daira */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wilaya (Province) *
          </label>
          <select
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Wilaya</option>
            {wilayas.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daira (District)
          </label>
          <input
            type="text"
            value={daira}
            onChange={(e) => setDaira(e.target.value)}
            placeholder="Enter daira name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Coordinates */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          GPS Coordinates (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="36.7538"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Latitude coordinate (-90 to 90)
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="3.0588"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Longitude coordinate (-180 to 180)
            </p>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">📍</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800 mb-1">Location Information</h3>
            <p className="text-sm text-green-700">
              Accurate location information helps potential buyers find and evaluate the project. 
              GPS coordinates enable precise mapping and location-based searches.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
        >
          <span>Next: Project Details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
