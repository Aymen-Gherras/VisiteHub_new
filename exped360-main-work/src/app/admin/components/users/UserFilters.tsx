interface UserFiltersProps {
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function UserFilters({
  searchTerm,
  filterRole,
  filterStatus,
  filteredCount,
  onSearchChange,
  onRoleChange,
  onStatusChange
}: UserFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-400 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Filter
          </label>
          <select
            value={filterRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-400 transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="user">User</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Filter
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-400 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <div className="bg-gray-50 px-4 py-3 rounded-lg w-full">
            <div className="text-sm text-gray-600">Results</div>
            <div className="text-2xl font-bold text-gray-900">{filteredCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 