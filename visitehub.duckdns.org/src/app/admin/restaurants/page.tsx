'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiService, Restaurant } from '@/api';
import { useAuth } from '@/context/AuthContext';

const ITEMS_PER_PAGE = 20;

export default function AdminRestaurants() {
  const pathname = usePathname();
  const { token } = useAuth();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterWilaya, setFilterWilaya] = useState('');

  useEffect(() => {
    if (pathname === '/admin/restaurants') {
      setRefreshKey((prev) => prev + 1);
    }
  }, [pathname]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRestaurants();
  }, [refreshKey]);

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter((r) =>
        r.name?.toLowerCase().includes(s) ||
        r.wilaya?.toLowerCase().includes(s) ||
        r.daira?.toLowerCase().includes(s) ||
        r.type?.toLowerCase().includes(s),
      );
    }

    if (filterWilaya) {
      filtered = filtered.filter((r) => r.wilaya === filterWilaya);
    }

    return filtered;
  }, [restaurants, searchTerm, filterWilaya]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRestaurants, currentPage]);

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = async (id: string) => {
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await apiService.deleteRestaurant(id, token);
        fetchRestaurants();
      } catch (err) {
        console.error('Error deleting restaurant:', err);
        alert('Failed to delete restaurant');
      }
    }
  };

  const wilayas = useMemo(() => {
    const unique = new Set(restaurants.map((r) => r.wilaya).filter(Boolean));
    return Array.from(unique).sort();
  }, [restaurants]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600">Manage restaurants</p>
        </div>
        <Link
          href="/admin/restaurants/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Restaurant
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">{error}</div>
      ) : null}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by name, type, wilaya, daira"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya</label>
            <select
              value={filterWilaya}
              onChange={(e) => {
                setFilterWilaya(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              {wilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wilaya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daira</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRestaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{restaurant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{restaurant.type || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{restaurant.wilaya || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{restaurant.daira || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/restaurants/${restaurant.id}/edit`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(restaurant.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">Page {currentPage} / {totalPages}</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-white text-blue-600 font-medium border-2 border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-white text-blue-600 font-medium border-2 border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
