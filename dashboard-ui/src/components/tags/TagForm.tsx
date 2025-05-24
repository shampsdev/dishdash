import React, { useState, useEffect } from 'react';
import type { Tag } from '../../types/tag';

interface TagFormProps {
  tag?: Tag;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ tag, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [visible, setVisible] = useState(true);
  const [order, setOrder] = useState(0);
  const [excluded, setExcluded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Initialize or reset form based on tag prop
  useEffect(() => {
    if (tag) {
      // Edit mode - set values from existing tag
      setName(tag.name);
      setIconUrl(tag.icon);
      setVisible(tag.visible);
      setOrder(tag.order);
      setExcluded(tag.excluded);
    } else {
      // Create mode - reset to defaults
      setName('');
      setIconUrl('');
      setVisible(true);
      setOrder(0);
      setExcluded(false);
      setPreviewError(false);
    }
  }, [tag]);

  const handleIconUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconUrl(e.target.value);
    // Reset preview error when changing URL
    setPreviewError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('icon', iconUrl);
      formData.append('visible', visible.toString());
      formData.append('order', order.toString());
      formData.append('excluded', excluded.toString());

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Tag Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="iconUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Icon URL
          </label>
          <input
            id="iconUrl"
            type="url"
            value={iconUrl}
            onChange={handleIconUrlChange}
            placeholder="https://example.com/icon.png"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          
          {iconUrl && (
            <div className="mt-3 flex items-center">
              {!previewError ? (
                <div className="flex space-x-4 items-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-md overflow-hidden shadow-md">
                    <img
                      src={iconUrl}
                      alt="Icon preview"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <span className="text-sm text-gray-400">Icon preview</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Invalid image URL</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-1">
            Order
          </label>
          <input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
          />
          <p className="mt-1 text-sm text-gray-400">Lower numbers appear first</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex items-center h-5">
              <input
                id="visible"
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="visible" className="text-sm text-gray-300">
                Visible
              </label>
              <p className="text-xs text-gray-400">
                Tag will be shown to users in the app
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center h-5">
              <input
                id="excluded"
                type="checkbox"
                checked={excluded}
                onChange={(e) => setExcluded(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="excluded" className="text-sm text-gray-300">
                Excluded
              </label>
              <p className="text-xs text-gray-400">
                Tag is excluded from search results
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : tag ? 'Update Tag' : 'Create Tag'}
        </button>
      </div>
    </form>
  );
};

export default TagForm; 