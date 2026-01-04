'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService } from '@/api';
import { useAuth } from '@/context/AuthContext';
import ImageDropzone from '../../../components/common/ImageDropzone';

export default function EditHotel() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const hotelId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [dairas, setDairas] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    wilaya: '',
    daira: '',
    iframeUrl: '',
    roomsNumber: '',
    starsNumber: '',
    coverImage: '',
  });

  useEffect(() => {
    apiService
      .listWilayas()
      .then((data) => setWilayas(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) return;
      try {
        setLoading(true);
        const hotel = await apiService.getHotel(hotelId);
        setFormData({
          name: hotel.name || '',
          slug: hotel.slug || '',
          wilaya: hotel.wilaya || '',
          daira: hotel.daira || '',
          iframeUrl: hotel.iframeUrl || '',
          roomsNumber: typeof hotel.roomsNumber === 'number' ? String(hotel.roomsNumber) : '',
          starsNumber: typeof hotel.starsNumber === 'number' ? String(hotel.starsNumber) : '',
          coverImage: hotel.coverImage || '',
        });
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch hotel');
      } finally {
        setLoading(false);
      }
    };

    void fetchHotel();
  }, [hotelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchDairas = async () => {
      if (!formData.wilaya) {
        setDairas([]);
        setFormData((prev) => ({ ...prev, daira: '' }));
        return;
      }
      try {
        const data = await apiService.listDairas(formData.wilaya);
        setDairas(data);
        if (formData.daira && !data.includes(formData.daira)) {
          setFormData((prev) => ({ ...prev, daira: '' }));
        }
      } catch {
        setDairas([]);
      }
    };
    void fetchDairas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.wilaya]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    if (!hotelId) {
      setError('Hotel ID is missing');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const roomsNumber = formData.roomsNumber.trim() ? Number(formData.roomsNumber) : undefined;
      const starsNumber = formData.starsNumber.trim() ? Number(formData.starsNumber) : undefined;

      await apiService.updateHotel(
        hotelId,
        {
          name: formData.name,
          slug: formData.slug,
          wilaya: formData.wilaya || undefined,
          daira: formData.daira || undefined,
          iframeUrl: formData.iframeUrl || undefined,
          roomsNumber: Number.isFinite(roomsNumber as any) ? roomsNumber : undefined,
          starsNumber: Number.isFinite(starsNumber as any) ? starsNumber : undefined,
          coverImage: formData.coverImage || undefined,
        },
        token,
      );

      router.push('/admin/hotels');
    } catch (err) {
      console.error('Error updating hotel:', err);
      setError(err instanceof Error ? err.message : 'Failed to update hotel');
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Hotel</h1>
              <p className="mt-2 text-gray-600">Update hotel information</p>
            </div>
            <button
              onClick={() => router.push('/admin/hotels')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Hotels
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
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
              />
            </div>

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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-2">Wilaya</label>
                <select
                  id="wilaya"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Wilaya</option>
                  {wilayas.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="daira" className="block text-sm font-medium text-gray-700 mb-2">Daira</label>
                <select
                  id="daira"
                  name="daira"
                  value={formData.daira}
                  onChange={handleChange}
                  disabled={!formData.wilaya}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">{formData.wilaya ? 'Select Daira' : 'Select Wilaya first'}</option>
                  {dairas.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="iframeUrl" className="block text-sm font-medium text-gray-700 mb-2">Iframe URL</label>
              <input
                type="url"
                id="iframeUrl"
                name="iframeUrl"
                value={formData.iframeUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="roomsNumber" className="block text-sm font-medium text-gray-700 mb-2">Rooms number</label>
                <input
                  type="number"
                  id="roomsNumber"
                  name="roomsNumber"
                  min={0}
                  value={formData.roomsNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="starsNumber" className="block text-sm font-medium text-gray-700 mb-2">Stars number</label>
                <input
                  type="number"
                  id="starsNumber"
                  name="starsNumber"
                  min={0}
                  value={formData.starsNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <ImageDropzone
              title="Cover Image"
              description="Upload a cover image (stored in /uploads)"
              value={formData.coverImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              disabled={saving}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin/hotels')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
