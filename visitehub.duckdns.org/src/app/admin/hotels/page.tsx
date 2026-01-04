'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiService, Hotel } from '@/api';
import { useAuth } from '@/context/AuthContext';

const ITEMS_PER_PAGE = 20;

export default function AdminHotels() {
  const pathname = usePathname();
  const { token } = useAuth();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterWilaya, setFilterWilaya] = useState('');

  useEffect(() => {
    if (pathname === '/admin/hotels') {
      setRefreshKey((prev) => prev + 1);
    }
  }, [pathname]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHotels();
      setHotels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHotels();
  }, [refreshKey]);

  const filteredHotels = useMemo(() => {
    let filtered = hotels;

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter((h) =>
        h.name?.toLowerCase().includes(s) ||
        h.wilaya?.toLowerCase().includes(s) ||
        h.daira?.toLowerCase().includes(s),
      );
    }

    if (filterWilaya) {
      filtered = filtered.filter((h) => h.wilaya === filterWilaya);
    }

    return filtered;
  }, [hotels, searchTerm, filterWilaya]);

  const paginatedHotels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHotels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHotels, currentPage]);

  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = async (id: string) => {
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        await apiService.deleteHotel(id, token);
        fetchHotels();
      } catch (err) {
        console.error('Error deleting hotel:', err);
        alert('Failed to delete hotel');
      }
    }
  };

  const wilayas = useMemo(() => {
    const unique = new Set(hotels.map((h) => h.wilaya).filter(Boolean));
    return Array.from(unique).sort();
  }, [hotels]);

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
          <h1 className="text-2xl font-bold text-gray-900">Hotels</h1>
          <p className="text-gray-600">Manage hotels</p>
        </div>
        <Link
          href="/admin/hotels/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Hotel
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
              placeholder="Search by name, wilaya, daira"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilaya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daira
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedHotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hotel.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hotel.wilaya || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hotel.daira || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/hotels/${hotel.id}/edit`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(hotel.id)}
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
            <div className="text-sm text-gray-600">
              Page {currentPage} / {totalPages}
            </div>
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
