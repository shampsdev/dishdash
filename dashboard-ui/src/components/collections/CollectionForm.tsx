import React, { useState, useEffect } from 'react';
import type { Collection, CollectionPatch, CollectionType } from '../../types/collection';
import PlacesMultiSelect from '../places/PlacesMultiSelect';

interface CollectionFormProps {
  collection?: Collection;
  onSubmit: (collectionData: Collection | CollectionPatch) => Promise<void>;
  onCancel: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ collection, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const [order, setOrder] = useState(0);
  const [ownerId, setOwnerId] = useState('');
  const [type, setType] = useState<CollectionType>('basic');
  const [visible, setVisible] = useState(true);
  const [places, setPlaces] = useState<number[]>([]);
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with collection data if editing
  useEffect(() => {
    if (collection) {
      setName(collection.name || '');
      setDescription(collection.description || '');
      setAvatar(collection.avatar || '');
      setOrder(collection.order || 0);
      setOwnerId(collection.ownerId || '');
      setType(collection.type || 'basic');
      setVisible(collection.visible);
      setPlaces(collection.places || []);
    } else {
      // Reset form if creating a new collection
      setName('');
      setDescription('');
      setAvatar('');
      setOrder(0);
      setOwnerId('');
      setType('basic');
      setVisible(true);
      setPlaces([]);
      setAvatarPreviewError(false);
    }
  }, [collection]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!ownerId.trim()) {
      newErrors.ownerId = 'Owner ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const collectionData: Collection | CollectionPatch = collection
        ? {
            id: collection.id!,
            name,
            description,
            avatar,
            order,
            ownerId,
            type,
            visible,
            places
          }
        : {
            name,
            description,
            avatar,
            order,
            ownerId,
            type,
            visible,
            places
          };

      await onSubmit(collectionData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({...errors, submit: 'Failed to save collection. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.value);
    setAvatarPreviewError(false);
  };

  const handleAvatarError = () => {
    setAvatarPreviewError(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-700 border ${
              errors.name ? 'border-red-500' : 'border-gray-600'
            } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-1">
            Avatar URL
          </label>
          <input
            id="avatar"
            type="url"
            value={avatar}
            onChange={handleAvatarChange}
            placeholder="https://example.com/avatar.png"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {avatar && (
            <div className="mt-3 flex items-center">
              {!avatarPreviewError ? (
                <div className="flex space-x-4 items-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-md overflow-hidden shadow-md">
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={handleAvatarError}
                    />
                  </div>
                  <span className="text-sm text-gray-400">Avatar preview</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-1">
              Order
            </label>
            <input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-300 mb-1">
              Owner ID <span className="text-red-500">*</span>
            </label>
            <input
              id="ownerId"
              type="text"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                errors.ownerId ? 'border-red-500' : 'border-gray-600'
              } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              required
            />
            {errors.ownerId && <p className="mt-1 text-sm text-red-500">{errors.ownerId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as CollectionType)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="basic">Basic</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>

          <div className="flex items-center mt-6">
            <input
              id="visible"
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded"
            />
            <label htmlFor="visible" className="ml-2 block text-sm text-gray-300">
              Visible
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Places
          </label>
          <PlacesMultiSelect
            selectedPlaces={places}
            onChange={setPlaces}
          />
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-300 rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Collection'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CollectionForm; 