interface RecentActivityProps {
  properties: Array<{ id: string; title: string; price?: string | number }>;
}

export default function RecentActivity({ properties }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {properties.slice(0, 5).map((property) => (
          <div key={property.id} className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {property.title}
              </p>
              <p className="text-xs text-gray-500">
                Added {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 