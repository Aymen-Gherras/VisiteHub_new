'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Promoteur } from '../../../api';
import { apiService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS_PER_PAGE = 20;

export default function AdminPromoteurs() {
  const pathname = usePathname();
  const { token } = useAuth();
  const [promoteurs, setPromoteurs] = useState<Promoteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWilaya, setFilterWilaya] = useState('');

  // Update refresh key when pathname changes to trigger re-fetch
  useEffect(() => {
    if (pathname === '/admin/promoteurs') {
      setRefreshKey(prev => prev + 1);
    }
  }, [pathname]);

  // Fetch promoteurs function for delete operations
  const fetchPromoteurs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getPromoteurs();
      setPromoteurs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promoteurs');
      console.error('Error fetching promoteurs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load - fetch immediately on mount and when refreshKey changes
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getPromoteurs();
        setPromoteurs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch promoteurs');
        console.error('Error fetching promoteurs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [refreshKey]);

  // Client-side filtering
  const filteredPromoteurs = useMemo(() => {
    let filtered = promoteurs;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(promoteur => 
        promoteur.name?.toLowerCase().includes(searchLower) ||
        promoteur.description?.toLowerCase().includes(searchLower) ||
        promoteur.email?.toLowerCase().includes(searchLower) ||
        promoteur.address?.toLowerCase().includes(searchLower) ||
        promoteur.wilaya?.toLowerCase().includes(searchLower) ||
        promoteur.daira?.toLowerCase().includes(searchLower)
      );
    }

    // Wilaya filter
    if (filterWilaya) {
      filtered = filtered.filter(promoteur => promoteur.wilaya === filterWilaya);
    }

    return filtered;
  }, [promoteurs, searchTerm, filterWilaya]);

  // Pagination
  const paginatedPromoteurs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPromoteurs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPromoteurs, currentPage]);

  const totalPages = Math.ceil(filteredPromoteurs.length / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredPromoteurs.length);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = async (id: string) => {
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (confirm('Are you sure you want to delete this promoteur?')) {
      try {
        await apiService.deletePromoteur(id, token);
        fetchPromoteurs();
      } catch (err) {
        console.error('Error deleting promoteur:', err);
        alert('Failed to delete promoteur');
      }
    }
  };

  // Get unique wilayas for filter
  const wilayas = useMemo(() => {
    const unique = new Set(promoteurs.map(a => a.wilaya).filter(Boolean));
    return Array.from(unique).sort();
  }, [promoteurs]);

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
          <h1 className="text-2xl font-bold text-gray-900">Promoteurs Immobiliers</h1>
          <p className="text-gray-600">Manage real estate promoters</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/promoteurs/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Promoteur
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, location..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Wilaya Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wilaya
            </label>
            <select
              value={filterWilaya}
              onChange={(e) => {
                setFilterWilaya(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Wilayas</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
              <h3 className="text-sm font-medium text-red-800">Error loading promoteurs</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Showing {startItem}-{endItem} of {filteredPromoteurs.length} promoteurs
          </p>
        </div>
      )}

      {/* Promoteurs Table */}
      {!loading && !error && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPromoteurs.map((promoteur) => (
                    <tr key={promoteur.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{promoteur.name}</div>
                        {promoteur.slug && (
                          <div className="text-xs text-gray-500">{promoteur.slug}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{promoteur.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{promoteur.phoneNumber || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{promoteur.wilaya || '-'}</div>
                        {promoteur.daira && (
                          <div className="text-xs text-gray-500">{promoteur.daira}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {promoteur.website ? (
                          <a
                            href={promoteur.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Visit
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(promoteur.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/promoteurs/${promoteur.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(promoteur.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedPromoteurs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No promoteurs found. Create your first promoteur to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {Pagination}
        </>
      )}
    </div>
  );
}
