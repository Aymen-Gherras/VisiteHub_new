import { PropertyOwnerType } from '../../../../api/types';

interface PropertyOwnerFiltersProps {
  searchTerm: string;
  filterOwnerType: PropertyOwnerType | 'all';
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onOwnerTypeChange: (value: PropertyOwnerType | 'all') => void;
}

export default function PropertyOwnerFilters({
  searchTerm,
  filterOwnerType,
  filteredCount,
  onSearchChange,
  onOwnerTypeChange,
}: PropertyOwnerFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, description, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Owner Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Type
          </label>
          <select
            value={filterOwnerType}
            onChange={(e) => onOwnerTypeChange(e.target.value as PropertyOwnerType | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value={PropertyOwnerType.AGENCE}>Agences</option>
            <option value={PropertyOwnerType.PROMOTEUR}>Promoteurs</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="flex items-end">
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredCount}</span> property owners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
