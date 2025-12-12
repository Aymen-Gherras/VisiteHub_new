'use client';

import { useState } from 'react';
import { Project } from '../../../../../api';

// Extended type to handle both display and API formats
type ProjectFormData = Partial<Project> & {
  promoteurId?: string;
};

interface DetailsSectionProps {
  projectData: ProjectFormData;
  setProjectData: (data: ProjectFormData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const statusOptions = [
  { id: 'planning' as const, label: 'Planning', icon: '📋', description: 'Project in planning phase' },
  { id: 'construction' as const, label: 'Under Construction', icon: '🏗️', description: 'Currently being built' },
  { id: 'completed' as const, label: 'Completed', icon: '✅', description: 'Construction finished' },
  { id: 'suspended' as const, label: 'Suspended', icon: '⏸️', description: 'Temporarily suspended' }
];

export default function DetailsSection({ projectData, setProjectData, onNext, onPrevious }: DetailsSectionProps) {
  const [status, setStatus] = useState(projectData.status || 'planning');
  const [startDate, setStartDate] = useState(() => {
    if (!projectData.startDate) return '';
    try {
      return new Date(projectData.startDate).toISOString().split('T')[0];
    } catch {
      return '';
    }
  });
  const [expectedCompletionDate, setExpectedCompletionDate] = useState(() => {
    if (!projectData.expectedCompletionDate) return '';
    try {
      return new Date(projectData.expectedCompletionDate).toISOString().split('T')[0];
    } catch {
      return '';
    }
  });
  const [completionPercentage, setCompletionPercentage] = useState(
    projectData.completionPercentage?.toString() || '0'
  );
  const [amenities, setAmenities] = useState(projectData.amenities || '');

  const handleNext = () => {
    // Validate dates
    if (startDate && expectedCompletionDate && new Date(startDate) > new Date(expectedCompletionDate)) {
      alert('Start date cannot be after expected completion date');
      return;
    }

    // Validate completion percentage
    const percentage = parseInt(completionPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      alert('Completion percentage must be between 0 and 100');
      return;
    }

    setProjectData({
      ...projectData,
      status: status as any,
      startDate: startDate || undefined,
      expectedCompletionDate: expectedCompletionDate || undefined,
      completionPercentage: percentage,
      amenities: amenities.trim() || undefined
    });

    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Details</h2>
        <p className="text-gray-600">Specify project timeline, status, and features</p>
      </div>

      {/* Project Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Project Status *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setStatus(option.id)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
                ${status === option.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Project Timeline
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Expected Completion Date
            </label>
            <input
              type="date"
              value={expectedCompletionDate}
              onChange={(e) => setExpectedCompletionDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Completion Percentage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Completion Percentage
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0"
            max="100"
            value={completionPercentage}
            onChange={(e) => setCompletionPercentage(e.target.value)}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={completionPercentage}
              onChange={(e) => setCompletionPercentage(e.target.value)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
            />
            <span className="text-gray-600">%</span>
          </div>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Amenities & Features
        </label>
        <textarea
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
          placeholder="List project amenities and features (e.g., Swimming pool, Gym, Parking, Security, Gardens, Playground, etc.)"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
        <p className="text-xs text-gray-500 mt-1">
          Describe the amenities and features available in this project (optional)
        </p>
      </div>

      {/* Project Info */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-orange-800 mb-1">Project Progress</h3>
            <p className="text-sm text-orange-700">
              Keep track of project status and completion percentage to inform potential buyers 
              about the development progress and expected delivery timeline.
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
          <span>Next: Images & Gallery</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
