import { useState, useEffect } from 'react';
import { apiService } from '../../../../api';

interface PropertyFiltersProps {
  searchTerm: string;
  filterType: string;
  filterTransactionType: string;
  filterWilaya: string;
  filterOwnerType: string;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onTransactionTypeChange: (value: string) => void;
  onWilayaChange: (value: string) => void;
  onOwnerTypeChange: (value: string) => void;
}

export default function PropertyFilters({
  searchTerm,
  filterType,
  filterTransactionType,
  filterWilaya,
  filterOwnerType,
  filteredCount,
  onSearchChange,
  onTypeChange,
  onTransactionTypeChange,
  onWilayaChange,
  onOwnerTypeChange
}: PropertyFiltersProps) {
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [loadingWilayas, setLoadingWilayas] = useState(false);

  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        setLoadingWilayas(true);
        const data = await apiService.listWilayas();
        setWilayas(data || []);
      } catch (err) {
        console.error('Error fetching wilayas:', err);
      } finally {
        setLoadingWilayas(false);
      }
    };
    fetchWilayas();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Properties
          </label>
          <input
            type="text"
            placeholder="Search by title, description, location, or owner type..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={filterType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="apartment">Appartement</option>
              <option value="house">Maison</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="land">Terrain</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <select
              value={filterTransactionType}
              onChange={(e) => onTransactionTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Transactions</option>
              <option value="vendre">For Sale</option>
              <option value="location">For Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wilaya
            </label>
            <select
              value={filterWilaya}
              onChange={(e) => onWilayaChange(e.target.value)}
              disabled={loadingWilayas}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">All Wilayas</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Type
            </label>
            <select
              value={filterOwnerType}
              onChange={(e) => onOwnerTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Owners</option>
              <option value="Particulier">Particulier</option>
              <option value="Agence immobilière">Agence immobilière</option>
              <option value="Promotion immobilière">Promotion immobilière</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {filteredCount} {filteredCount === 1 ? 'property' : 'properties'} found
          </span>
          {(filterType !== 'all' || filterTransactionType !== 'all' || filterWilaya || filterOwnerType !== 'all') && (
            <button
              onClick={() => {
                onTypeChange('all');
                onTransactionTypeChange('all');
                onWilayaChange('');
                onOwnerTypeChange('all');
                onSearchChange('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 