'use client';

import { useState } from 'react';
import { Project } from '../../../../api';
import BasicInfoSection from './sections/BasicInfoSection';
import LocationSection from './sections/LocationSection';
import DetailsSection from './sections/DetailsSection';
import ImagesSection from './sections/ImagesSection';

// Extended type to handle both display and API formats
type ProjectFormData = Partial<Project> & {
  promoteurId?: string;
};

interface ProjectCreationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projectData: ProjectFormData;
  setProjectData: (data: ProjectFormData) => void;
  onProjectCreated: (project: Project) => void;
  isEditing?: boolean;
  projectId?: string;
  token?: string;
}

const tabs = [
  { id: 'basic-info', label: 'Basic Information', icon: '🏘️', description: 'Project name and description' },
  { id: 'location', label: 'Location', icon: '📍', description: 'Address and location details' },
  { id: 'details', label: 'Project Details', icon: '📋', description: 'Timeline and specifications' },
  { id: 'images', label: 'Images & Gallery', icon: '📸', description: 'Cover image and gallery' }
];

export default function ProjectCreationTabs({
  activeTab,
  setActiveTab,
  projectData,
  setProjectData,
  onProjectCreated,
  isEditing,
  projectId,
  token
}: ProjectCreationTabsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info':
        return (
          <BasicInfoSection
            projectData={projectData}
            setProjectData={setProjectData}
            onNext={handleNext}
          />
        );
      case 'location':
        return (
          <LocationSection
            projectData={projectData}
            setProjectData={setProjectData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'details':
        return (
          <DetailsSection
            projectData={projectData}
            setProjectData={setProjectData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'images':
        return (
          <ImagesSection
            projectData={projectData}
            setProjectData={setProjectData}
            onPrevious={handlePrevious}
            onProjectCreated={onProjectCreated}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            isEditing={isEditing}
            projectId={projectId}
            token={token}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isCompleted = tabs.findIndex(t => t.id === tab.id) < tabs.findIndex(t => t.id === activeTab);
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : isCompleted
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden md:block">{tab.label}</span>
                {isCompleted && (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>

      {/* Progress Indicator */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              Step {tabs.findIndex(tab => tab.id === activeTab) + 1} of {tabs.length}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((tabs.findIndex(tab => tab.id === activeTab) + 1) / tabs.length) * 100}%`
                }}
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </div>
        </div>
      </div>
    </div>
  );
}
