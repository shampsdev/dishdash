import React from 'react';
import type { Tag } from '../../types/tag';

interface TagListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Icon
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Order
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Visible
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Excluded
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {tag.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {tag.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {tag.icon && (
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                    <img src={tag.icon} alt={tag.name} className="h-full w-full object-cover" />
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {tag.order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tag.visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {tag.visible ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tag.excluded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {tag.excluded ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(tag)}
                  className="text-indigo-400 hover:text-indigo-300 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tag)}
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

export default TagList; 