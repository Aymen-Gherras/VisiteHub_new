import { ProjectStatus, PropertyOwner } from '../../../../api/types';

interface ProjectFiltersProps {
  searchTerm: string;
  filterStatus: ProjectStatus | 'all';
  filterPromoteur: string;
  promoteurs: PropertyOwner[];
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus | 'all') => void;
  onPromoteurChange: (value: string) => void;
}

export default function ProjectFilters({
  searchTerm,
  filterStatus,
  filterPromoteur,
  promoteurs,
  filteredCount,
  onSearchChange,
  onStatusChange,
  onPromoteurChange,
}: ProjectFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, description, or promoteur..."
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

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatus | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value={ProjectStatus.PLANNING}>Planning</option>
            <option value={ProjectStatus.CONSTRUCTION}>Construction</option>
            <option value={ProjectStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        {/* Promoteur Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promoteur
          </label>
          <select
            value={filterPromoteur}
            onChange={(e) => onPromoteurChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Promoteurs</option>
            {promoteurs.map((promoteur) => (
              <option key={promoteur.id} value={promoteur.id}>
                {promoteur.name}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="flex items-end">
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredCount}</span> projects
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
