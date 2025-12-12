import { useState, useEffect } from 'react';
import { PropertyOwner, PropertyOwnerType } from '../api/types';
import { apiService } from '../api';

export function usePropertyOwners(ownerType?: PropertyOwnerType) {
  const [propertyOwners, setPropertyOwners] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropertyOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPropertyOwners(ownerType);
      setPropertyOwners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyOwners();
  }, [ownerType]);

  const refetch = () => {
    fetchPropertyOwners();
  };

  return {
    propertyOwners,
    loading,
    error,
    refetch
  };
}

export function useAgences() {
  return usePropertyOwners(PropertyOwnerType.AGENCE);
}

export function usePromoteurs() {
  return usePropertyOwners(PropertyOwnerType.PROMOTEUR);
}

export function usePropertyOwner(id: string | null) {
  const [propertyOwner, setPropertyOwner] = useState<PropertyOwner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setPropertyOwner(null);
      return;
    }

    const fetchPropertyOwner = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getPropertyOwner(id);
        setPropertyOwner(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property owner');
        setPropertyOwner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyOwner();
  }, [id]);

  return {
    propertyOwner,
    loading,
    error
  };
}
