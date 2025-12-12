interface TopLocationsListProps {
  topLocations: { location: string; count: number }[];
}

export default function TopLocationsList({ topLocations }: TopLocationsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
      <div className="space-y-3">
        {topLocations.map((item, index) => (
          <div key={item.location} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 mr-2">
                #{index + 1}
              </span>
              <span className="text-sm text-gray-700">{item.location}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {item.count} properties
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 