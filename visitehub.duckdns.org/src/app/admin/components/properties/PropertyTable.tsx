import { Property } from '../../../../api';
import { formatPrice } from '../../../../utils/formatPrice';

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
}

export default function PropertyTable({ properties, onEdit, onDelete, onToggleFeatured }: PropertyTableProps) {
  const TypeBadge = ({ type }: { type: string }) => {
    const colors = {
      apartment: 'bg-blue-100 text-blue-800',
      house: 'bg-green-100 text-green-800',
      villa: 'bg-purple-100 text-purple-800',
      land: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      land: 'Terrain'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors] || colors.apartment}`}>
        {labels[type as keyof typeof labels] || type}
      </span>
    );
  };

  const TransactionBadge = ({ type }: { type: string }) => {
    const colors = {
      vendre: 'bg-green-100 text-green-800',
      location: 'bg-orange-100 text-orange-800'
    };

    const labels = {
      vendre: 'Vente',
      location: 'Location'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors] || colors.vendre}`}>
        {labels[type as keyof typeof labels] || type}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {property.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.daira}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TypeBadge type={property.type} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TransactionBadge type={property.transactionType} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {property.daira}, {property.wilaya}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${property.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {property.isFeatured ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {onToggleFeatured && (
                      <button
                        onClick={() => onToggleFeatured(property.id)}
                        className={`px-2 py-1 rounded ${property.isFeatured ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                      >
                        {property.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(property)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(property.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 