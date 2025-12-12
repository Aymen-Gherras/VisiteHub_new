interface ChartPlaceholderProps {
  title: string;
  description: string;
}

export default function ChartPlaceholder({ title, description }: ChartPlaceholderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
} 