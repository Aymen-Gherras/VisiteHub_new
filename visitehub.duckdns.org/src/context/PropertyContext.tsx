'use client';

import React, { createContext, useContext, useState } from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
}

interface PropertyContextType {
  properties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  addProperty: (property: Property) => void;
  removeProperty: (id: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const addProperty = (property: Property) => {
    setProperties(prev => [...prev, property]);
  };

  const removeProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      selectedProperty,
      setSelectedProperty,
      addProperty,
      removeProperty
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}; 