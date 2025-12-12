'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Property } from '../../../api';
import { PropertyTable, PropertyFilters } from '../components';
import { apiService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

export default function AdminProperties() {
  const { token } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTransactionType, setFilterTransactionType] = useState('all');
  const [filterWilaya, setFilterWilaya] = useState('');
  const [filterOwnerType, setFilterOwnerType] = useState('all');

  // Debounced fetch function
  const debouncedFetchProperties = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (filters: any, page: number) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            setLoading(true);
            setError(null);
            
            const params: any = {
              limit: ITEMS_PER_PAGE,
              offset: (page - 1) * ITEMS_PER_PAGE,
            };
            
            // Add filters to API params
            if (filters.type !== 'all') params.type = filters.type;
            if (filters.transactionType !== 'all') params.transactionType = filters.transactionType;
            if (filters.wilaya) params.wilaya = filters.wilaya;
            if (filters.ownerType !== 'all') params.propertyOwnerType = filters.ownerType;
            
            const data = await apiService.getProperties(params);
            setProperties(data.properties);
            setTotalProperties(data.total);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch properties');
            console.error('Error fetching properties:', err);
          } finally {
            setLoading(false);
          }
        }, 300);
      };
    })(),
    []
  );

  // Initial load - fetch immediately without debounce
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: any = {
          limit: ITEMS_PER_PAGE,
          offset: 0,
        };
        
        const data = await apiService.getProperties(params);
        setProperties(data.properties);
        setTotalProperties(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Handle filter changes - with debounce
  useEffect(() => {
    setCurrentPage(1);
    debouncedFetchProperties({
      type: filterType,
      transactionType: filterTransactionType,
      wilaya: filterWilaya,
      ownerType: filterOwnerType,
    }, 1);
  }, [filterType, filterTransactionType, filterWilaya, filterOwnerType, debouncedFetchProperties]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    debouncedFetchProperties({
      type: filterType,
      transactionType: filterTransactionType,
      wilaya: filterWilaya,
      ownerType: filterOwnerType,
    }, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filterType, filterTransactionType, filterWilaya, filterOwnerType, debouncedFetchProperties]);

  // Client-side search filtering (on already fetched properties)
  const filteredProperties = useMemo(() => {
    if (!searchTerm) return properties;
    
    const searchLower = searchTerm.toLowerCase();
    return properties.filter(property => 
      property.title?.toLowerCase().includes(searchLower) ||
      property.description?.toLowerCase().includes(searchLower) ||
      property.wilaya?.toLowerCase().includes(searchLower) ||
      property.daira?.toLowerCase().includes(searchLower) ||
      property.address?.toLowerCase().includes(searchLower) ||
      property.propertyOwnerType?.toLowerCase().includes(searchLower)
    );
  }, [properties, searchTerm]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalProperties / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalProperties);

  const handleDelete = async (id: string) => {
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await apiService.deleteProperty(id, token);
        // Refresh the current page
        debouncedFetchProperties({
          type: filterType,
          transactionType: filterTransactionType,
          wilaya: filterWilaya,
          ownerType: filterOwnerType,
        }, currentPage);
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Failed to delete property');
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }
    try {
      const updated = await apiService.toggleFeaturedProperty(id, token);
      setProperties(prev => prev.map(p => (p.id === id ? { ...p, isFeatured: updated.isFeatured } : p)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle featured');
    }
  };

  // Pagination component
  const Pagination = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page button
    if (currentPage > 2) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-600 border-2 border-gray-300 font-medium transition-all duration-200 text-sm"
        >
          1
        </button>
      );
      if (currentPage > 3) {
        pages.push(
          <span key="dots-start" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            i === currentPage
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-600 border-2 border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="dots-end" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-600 border-2 border-gray-300 font-medium transition-all duration-200 text-sm"
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6 mb-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white text-blue-600 font-medium border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-blue-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white text-blue-600 font-medium border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-blue-600 flex items-center gap-2"
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/properties/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Property
          </Link>
        </div>
      </div>

      {/* Filters */}
      <PropertyFilters
        searchTerm={searchTerm}
        filterType={filterType}
        filterTransactionType={filterTransactionType}
        filterWilaya={filterWilaya}
        filterOwnerType={filterOwnerType}
        filteredCount={totalProperties}
        onSearchChange={setSearchTerm}
        onTypeChange={setFilterType}
        onTransactionTypeChange={setFilterTransactionType}
        onWilayaChange={setFilterWilaya}
        onOwnerTypeChange={setFilterOwnerType}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading properties</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Showing {startItem}-{endItem} of {totalProperties} properties
          </p>
        </div>
      )}

      {/* Properties Table */}
      {!loading && !error && (
        <>
          <PropertyTable
            properties={filteredProperties}
            onEdit={(property) => {
              // Navigate to edit page
              window.location.href = `/admin/properties/edit/${property.id}`;
            }}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
          />
          {Pagination}
        </>
      )}
    </div>
  );
} 