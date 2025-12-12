import Link from 'next/link';
import { PropertyOwner, PropertyOwnerType } from '../../../../api/types';

interface PropertyOwnerTableProps {
  propertyOwners: PropertyOwner[];
  onDelete: (id: string) => void;
}

export default function PropertyOwnerTable({ propertyOwners, onDelete }: PropertyOwnerTableProps) {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOwnerTypeColor = (ownerType: PropertyOwnerType) => {
    return ownerType === PropertyOwnerType.AGENCE 
      ? 'bg-green-100 text-green-800' 
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Properties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {propertyOwners.map((owner) => (
              <tr key={owner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {owner.imageUrl ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={owner.imageUrl}
                          alt={owner.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {owner.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {owner.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOwnerTypeColor(owner.ownerType)}`}>
                    {owner.ownerType === PropertyOwnerType.AGENCE ? 'Agence' : 'Promoteur'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    {owner.phoneNumber && (
                      <div className="text-sm text-gray-900">{owner.phoneNumber}</div>
                    )}
                    {owner.email && (
                      <div className="text-sm text-gray-500">{owner.email}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {owner.wilaya && owner.daira ? `${owner.wilaya}, ${owner.daira}` : owner.wilaya || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {owner.properties?.length || 0} properties
                    </span>
                    {owner.ownerType === PropertyOwnerType.PROMOTEUR && (
                      <span className="text-xs text-gray-500">
                        {owner.projects?.length || 0} projects
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(owner.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/property-owners/${owner.id}`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/property-owners/${owner.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Edit
                    </Link>
                    {owner.ownerType === PropertyOwnerType.PROMOTEUR && (
                      <Link
                        href={`/admin/property-owners/${owner.id}/projects`}
                        className="text-purple-600 hover:text-purple-900 text-sm"
                      >
                        Projects
                      </Link>
                    )}
                    <button
                      onClick={() => onDelete(owner.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
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
