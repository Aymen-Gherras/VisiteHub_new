export default function ExportSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="mr-2">📊</span>
          Export Analytics Report
        </button>
        <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="mr-2">📋</span>
          Export Property List
        </button>
        <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="mr-2">📈</span>
          Export Performance Data
        </button>
      </div>
    </div>
  );
} 