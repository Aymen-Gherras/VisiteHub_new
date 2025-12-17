'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiService } from '../../../../../api';
import { useAuth } from '../../../../../context/AuthContext';

export default function EditAgence() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const agenceId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [dairas, setDairas] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    email: '',
    phoneNumber: '',
    address: '',
    wilaya: '',
    daira: '',
    website: '',
    logo: '',
  });

  // Fetch agence data on mount
  useEffect(() => {
    const fetchAgence = async () => {
      if (!agenceId) return;
      
      try {
        setLoading(true);
        const agence = await apiService.getAgence(agenceId);
        setFormData({
          name: agence.name || '',
          slug: agence.slug || '',
          description: agence.description || '',
          email: agence.email || '',
          phoneNumber: agence.phoneNumber || '',
          address: agence.address || '',
          wilaya: agence.wilaya || '',
          daira: agence.daira || '',
          website: agence.website || '',
          logo: agence.logo || '',
        });
      } catch (err) {
        console.error('Error fetching agence:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch agence');
      } finally {
        setLoading(false);
      }
    };
    fetchAgence();
  }, [agenceId]);

  // Fetch wilayas on mount
  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        const data = await apiService.listWilayas();
        setWilayas(data);
      } catch (err) {
        console.error('Error fetching wilayas:', err);
      }
    };
    fetchWilayas();
  }, []);

  // Fetch dairas when wilaya changes
  useEffect(() => {
    const fetchDairas = async () => {
      if (!formData.wilaya) {
        setDairas([]);
        return;
      }
      try {
        const data = await apiService.listDairas(formData.wilaya);
        setDairas(data);
      } catch (err) {
        console.error('Error fetching dairas:', err);
        setDairas([]);
      }
    };
    fetchDairas();
  }, [formData.wilaya]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (!agenceId) {
      setError('Agence ID is missing');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await apiService.updateAgence(agenceId, formData, token);
      router.push('/admin/agences');
    } catch (err) {
      console.error('Error updating agence:', err);
      setError(err instanceof Error ? err.message : 'Failed to update agence');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Agence</h1>
              <p className="mt-2 text-gray-600">
                Update agence information
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/agences')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Agences
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error updating agence</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter agence name"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="agence-name"
              />
              <p className="mt-1 text-sm text-gray-500">URL-friendly identifier</p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@agence.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+213 XXX XXX XXX"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the agence..."
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            {/* Wilaya and Daira */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-2">
                  Wilaya
                </label>
                <select
                  id="wilaya"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Wilaya</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="daira" className="block text-sm font-medium text-gray-700 mb-2">
                  Daira
                </label>
                <select
                  id="daira"
                  name="daira"
                  value={formData.daira}
                  onChange={handleChange}
                  disabled={!formData.wilaya}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Daira</option>
                  {dairas.map((daira) => (
                    <option key={daira} value={daira}>
                      {daira}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.agence.com"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/agences')}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
