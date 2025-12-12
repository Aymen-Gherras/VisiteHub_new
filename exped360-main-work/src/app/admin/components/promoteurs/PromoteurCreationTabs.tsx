'use client';

import { useState } from 'react';
import { Promoteur } from '../../../../api';
import BasicInfoSection from './sections/BasicInfoSection';
import ContactSection from './sections/ContactSection';
import ImagesSection from './sections/ImagesSection';

interface PromoteurCreationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  promoteurData: Partial<Promoteur>;
  setPromoteurData: (data: Partial<Promoteur>) => void;
  onPromoteurCreated: (promoteur: Promoteur) => void;
  isEditing?: boolean;
  promoteurId?: string;
  token?: string;
}

const tabs = [
  { id: 'basic-info', label: 'Basic Information', icon: '🏗️', description: 'Company name and description' },
  { id: 'contact', label: 'Contact & Location', icon: '📍', description: 'Contact details and address' },
  { id: 'images', label: 'Images & Branding', icon: '📸', description: 'Logo and cover image' }
];

export default function PromoteurCreationTabs({
  activeTab,
  setActiveTab,
  promoteurData,
  setPromoteurData,
  onPromoteurCreated,
  isEditing,
  promoteurId,
  token
}: PromoteurCreationTabsProps) {
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
            promoteurData={promoteurData}
            setPromoteurData={setPromoteurData}
            onNext={handleNext}
          />
        );
      case 'contact':
        return (
          <ContactSection
            promoteurData={promoteurData}
            setPromoteurData={setPromoteurData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'images':
        return (
          <ImagesSection
            promoteurData={promoteurData}
            setPromoteurData={setPromoteurData}
            onPrevious={handlePrevious}
            onPromoteurCreated={onPromoteurCreated}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            isEditing={isEditing}
            promoteurId={promoteurId}
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
