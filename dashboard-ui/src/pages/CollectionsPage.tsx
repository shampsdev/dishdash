import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchCollections, 
  fetchCollectionById, 
  createCollection, 
  updateCollection, 
  deleteCollection 
} from '../services/api';
import type { Collection, CollectionFilter, CollectionPatch, CollectionType } from '../types/collection';
import CollectionForm from '../components/collections/CollectionForm';

const CollectionsPage: React.FC = () => {
  const { token } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  // Mobile view state to toggle between list and form
  const [showForm, setShowForm] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState<CollectionType | ''>('');
  const [selectedVisibility, setSelectedVisibility] = useState<boolean | undefined>(undefined);
  const [ownerIdFilter, setOwnerIdFilter] = useState('');
  const [filter, setFilter] = useState<CollectionFilter>({});

  // Apply filters when filter state changes
  useEffect(() => {
    const newFilter: CollectionFilter = {};
    
    if (selectedType) {
      newFilter.types = [selectedType];
    }
    
    if (selectedVisibility !== undefined) {
      newFilter.visible = selectedVisibility;
    }
    
    if (ownerIdFilter) {
      newFilter.ownerID = ownerIdFilter;
    }
    
    setFilter(newFilter);
  }, [selectedType, selectedVisibility, ownerIdFilter]);

  useEffect(() => {
    loadCollections();
  }, [token, filter]);

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const collectionsData = await fetchCollections(filter);
      // Sort collections by visibility (visible first) and then by order (ascending)
      const sortedCollections = Array.isArray(collectionsData) ? 
        collectionsData.flat().sort((a, b) => {
          // First sort by visibility
          if (a.visible !== b.visible) {
            return a.visible ? -1 : 1; // visible collections first
          }
          // Then sort by order
          return (a.order || 0) - (b.order || 0);
        }) : [];
      setCollections(sortedCollections);
    } catch (err) {
      console.error('Error loading collections:', err);
      setError('Failed to load collections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedType('');
    setSelectedVisibility(undefined);
    setOwnerIdFilter('');
  };

  const handleCreateCollection = async (collectionData: Collection) => {
    try {
      await createCollection(collectionData);
      await loadCollections();
      setIsCreating(false);
      // Return to list view on mobile after creating
      setShowForm(false);
    } catch (err) {
      console.error('Error creating collection:', err);
      setError('Failed to create collection. Please try again.');
    }
  };

  const handleUpdateCollection = async (collectionData: CollectionPatch) => {
    try {
      await updateCollection(collectionData);
      await loadCollections();
      // Keep the collection selected after update, but refresh the selection
      if (selectedCollection && selectedCollection.id) {
        const updatedCollection = await fetchCollectionById(selectedCollection.id);
        setSelectedCollection(updatedCollection);
      }
      // Return to list view on mobile after updating
      setShowForm(false);
    } catch (err) {
      console.error('Error updating collection:', err);
      setError('Failed to update collection. Please try again.');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteCollection(id);
      await loadCollections();
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
      }
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting collection:', err);
      setError('Failed to delete collection. Please try again.');
    }
  };

  const startCreating = () => {
    setSelectedCollection(null);
    setIsCreating(true);
    // Show form view on mobile when creating
    setShowForm(true);
  };

  const selectCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsCreating(false);
    // Show form view on mobile when selecting a collection
    setShowForm(true);
  };

  const cancelForm = () => {
    if (isCreating) {
      setIsCreating(false);
    }
    // Return to list view on mobile after canceling
    setShowForm(false);
  };

  // Back button for mobile view
  const handleBackToList = () => {
    setShowForm(false);
  };

  // Helper function to get color based on collection type
  const getTypeColor = (type: CollectionType) => {
    switch (type) {
      case 'basic':
        return 'bg-indigo-900/30 text-indigo-400';
      case 'favorites':
        return 'bg-pink-900/30 text-pink-400';
      default:
        return 'bg-gray-600 text-gray-300';
    }
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <svg
        className="w-16 h-16 text-gray-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <h3 className="text-lg font-semibold text-white mb-2">No Collection Selected</h3>
      <p className="text-gray-400 mb-6">Select a collection from the list to edit or create a new one.</p>
      <button
        onClick={startCreating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Create New Collection
      </button>
    </div>
  );

  // Filter section component
  const FilterSection = () => (
    <div className="bg-gray-700 p-3 rounded-md mb-3">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CollectionType | '')}
            className="w-full px-2 py-1.5 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="basic">Basic</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-400 mb-1">Visibility</label>
          <select
            value={selectedVisibility === undefined ? '' : selectedVisibility.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedVisibility(value === '' ? undefined : value === 'true');
            }}
            className="w-full px-2 py-1.5 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Visible</option>
            <option value="false">Hidden</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-400 mb-1">Owner ID</label>
          <input
            type="text"
            placeholder="Owner ID"
            value={ownerIdFilter}
            onChange={(e) => setOwnerIdFilter(e.target.value)}
            className="w-full px-2 py-1.5 bg-gray-600 border border-gray-500 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-3">
        <button
          onClick={clearFilters}
          className="px-3 py-1 bg-gray-600 text-sm text-gray-300 rounded hover:bg-gray-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  // Collection list component
  const CollectionListWrapper = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Collections</h2>
        <button
          onClick={startCreating}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Create
        </button>
      </div>
      
      <div className="px-3 pt-3">
        <FilterSection />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-blue-500 border-opacity-25"></div>
            <p className="mt-2 text-gray-300">Loading collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No collections found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => selectCollection(collection)}
                className={`p-3 rounded-md cursor-pointer transition-colors flex items-center ${
                  selectedCollection?.id === collection.id
                    ? 'bg-blue-900/30 border border-blue-500/50'
                    : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                }`}
              >
                {collection.avatar && (
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-600 flex-shrink-0 mr-3">
                    <img 
                      src={collection.avatar} 
                      alt={collection.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite error loop
                        target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"%3e%3crect width="40" height="40" fill="%234B5563"/%3e%3cpath d="M20 18C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14C18.8954 14 18 14.8954 18 16C18 17.1046 18.8954 18 20 18Z" fill="%236B7280"/%3e%3cpath d="M14 26L18 22L20 24L24 20L26 22V26H14Z" fill="%236B7280"/%3e%3c/svg%3e';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-white font-medium truncate">{collection.name}</p>
                    <p className="text-xs text-gray-400">ID: {collection.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      collection.visible 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {collection.visible ? 'Visible' : 'Hidden'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(collection.type)}`}>
                      {collection.type}
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                      Order: {collection.order}
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                      Places: {collection.places?.length || 0}
                    </span>
                    {collection.ownerId && (
                      <span className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                        Owner: {collection.ownerId.length > 8 ? collection.ownerId.substring(0, 8) + '...' : collection.ownerId}
                      </span>
                    )}
                  </div>
                </div>
                {deleteConfirmation === collection.id && (
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (collection.id) {
                          handleDeleteCollection(collection.id);
                        }
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation(null);
                      }}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                    >
                      No
                    </button>
                  </div>
                )}
                {deleteConfirmation !== collection.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (collection.id) {
                        setDeleteConfirmation(collection.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Form container component
  const FormContainer = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">
          {isCreating ? 'Create Collection' : 'Edit Collection'}
        </h2>
        {/* Back button for mobile view */}
        <div className="md:hidden">
          <button
            onClick={handleBackToList}
            className="p-1 text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {selectedCollection || isCreating ? (
          <CollectionForm
            collection={selectedCollection || undefined}
            onSubmit={isCreating 
              ? handleCreateCollection as (data: Collection | CollectionPatch) => Promise<void>
              : handleUpdateCollection as (data: Collection | CollectionPatch) => Promise<void>
            }
            onCancel={cancelForm}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">
            Select a collection to edit or create a new one
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {/* Mobile view - toggle between list and form views */}
      <div className="md:hidden h-full">
        {showForm ? (
          <FormContainer />
        ) : (
          <CollectionListWrapper />
        )}
      </div>

      {/* Desktop view - side by side layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-6 h-full">
        <CollectionListWrapper />
        <div className="h-full">
          {selectedCollection || isCreating ? (
            <FormContainer />
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
              <EmptyState />
            </div>
          )}
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage; 