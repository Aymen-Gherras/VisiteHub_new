interface PriceRangesListProps {
  priceRanges: { range: string; count: number }[];
  totalProperties: number;
}

export default function PriceRangesList({ priceRanges, totalProperties }: PriceRangesListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Distribution</h3>
      <div className="space-y-3">
        {priceRanges.map((item) => (
          <div key={item.range} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{item.range}</span>
            <div className="flex items-center">
              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(item.count / totalProperties) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 