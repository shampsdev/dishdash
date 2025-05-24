import React from 'react';
import type { Place } from '../../types/place';

interface PlaceListProps {
  places: Place[];
  onEdit: (place: Place) => void;
  onDelete: (place: Place) => void;
}

const PlaceList: React.FC<PlaceListProps> = ({ places, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Image
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Rating
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Review Count
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Updated At
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {places.map((place) => (
            <tr key={place.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {place.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {place.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {place.images && place.images.length > 0 && (
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                    <img 
                      src={place.images[0]} 
                      alt={place.title} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite error loop
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"%3e%3crect width="40" height="40" fill="%234B5563"/%3e%3cpath d="M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z" fill="%236B7280"/%3e%3cpath d="M14 26L18 22L20 24L24 20L26 22V26H14Z" fill="%236B7280"/%3e%3c/svg%3e';
                      }}
                    />
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {place.reviewRating.toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {place.reviewCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {place.updatedAt ? new Date(place.updatedAt).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <button
                  onClick={() => onEdit(place)}
                  className="text-indigo-400 hover:text-indigo-300 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(place)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaceList; 