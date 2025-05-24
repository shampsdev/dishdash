import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchPlaces, fetchPlaceById, createPlace, updatePlace, deletePlace } from '../services/api';
import type { Place, PlaceFilter, PlacePatch } from '../types/place';
import PlaceForm from '../components/places/PlaceForm';

const PlacesPage: React.FC = () => {
  const { token } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  // Mobile view state to toggle between list and form
  const [showForm, setShowForm] = useState(false);
  
  // Search and filter states
  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [filter, setFilter] = useState<PlaceFilter>({});
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (idFilter) {
          // Поиск по id
          const id = parseInt(idFilter, 10);
          if (!isNaN(id)) {
            const place = await fetchPlaceById(id);
            setPlaces(place ? [place] : []);
          } else {
            setPlaces([]);
          }
        } else {
          // Обычный фильтр
          const placesData = await fetchPlaces(filter);
          const placesArray = Array.isArray(placesData) ? placesData.flat() : [];
          setPlaces(placesArray);
        }
      } catch (err) {
        console.error('Error loading places:', err);
        setError('Failed to load places. Please try again later.');
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, filter, idFilter]);

  // Update filter when search values change
  useEffect(() => {
    // Use a small delay to avoid too many API calls while typing
    const timer = setTimeout(() => {
      const newFilter: PlaceFilter = {};
      
      if (nameFilter) {
        newFilter.search = nameFilter;
      }
      
      if (idFilter) {
        newFilter.id = parseInt(idFilter, 10);
      }
      
      setFilter(newFilter);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [nameFilter, idFilter]);

  const clearFilters = () => {
    setNameFilter('');
    setIdFilter('');
  };

  const handleCreatePlace = async (placeData: Place | PlacePatch): Promise<Place | null> => {
    try {
      // Ensure we're using a complete Place object for creation
      if ('priceAvg' in placeData) {
        const createdPlace = await createPlace(placeData as Place);
        
        // Refresh place list
        setIdFilter('');
        setNameFilter('');
        setFilter({});
        setIsCreating(false);
        // Return to list view on mobile after creating
        setShowForm(false);
        
        return createdPlace;
      } else {
        console.error('Cannot create place: incomplete data');
        setError('Cannot create place: incomplete data');
        return null;
      }
    } catch (err) {
      console.error('Error creating place:', err);
      setError('Failed to create place. Please try again.');
      return null;
    }
  };

  const handleUpdatePlace = async (placeData: PlacePatch): Promise<Place | null> => {
    try {
      const updatedPlace = await updatePlace(placeData);
      
      // Refresh place list
      setIdFilter('');
      setNameFilter('');
      setFilter({});
      
      // Keep the place selected after update, but refresh the selection
      if (selectedPlace && selectedPlace.id) {
        const refreshedPlace = await fetchPlaceById(selectedPlace.id);
        setSelectedPlace(refreshedPlace);
      }
      
      // Return to list view on mobile after updating
      setShowForm(false);
      
      return updatedPlace;
    } catch (err) {
      console.error('Error updating place:', err);
      setError('Failed to update place. Please try again.');
      return null;
    }
  };

  const handleDeletePlace = async (id: number) => {
    try {
      await deletePlace(id);
      setIdFilter('');
      setNameFilter('');
      setFilter({});
      if (selectedPlace?.id === id) {
        setSelectedPlace(null);
      }
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting place:', err);
      setError('Failed to delete place. Please try again.');
    }
  };

  const startCreating = () => {
    setSelectedPlace(null);
    setIsCreating(true);
    // Show form view on mobile when creating
    setShowForm(true);
  };

  const selectPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsCreating(false);
    // Show form view on mobile when selecting a place
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
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-white mb-2">No Place Selected</h3>
      <p className="text-gray-400 mb-6">Select a place from the list to edit or create a new one.</p>
      <button
        onClick={startCreating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Create New Place
      </button>
    </div>
  );

  // Place list component
  const PlaceListWrapper = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Places</h2>
        <button
          onClick={startCreating}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Create
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-blue-500 border-opacity-25"></div>
            <p className="mt-2 text-gray-300">Loading places...</p>
          </div>
        ) : places.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No places found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => selectPlace(place)}
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  selectedPlace?.id === place.id
                    ? 'bg-blue-900/30 border border-blue-500/50'
                    : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                }`}
              >
                <div className="flex items-center">
                  {showImages && place.images && place.images.length > 0 && (
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-600 flex-shrink-0 mr-2">
                      <img 
                        src={place.images[0]} 
                        alt={place.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"%3e%3crect width="24" height="24" fill="%234B5563"/%3e%3c/svg%3e';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium truncate mr-2">{place.title}</p>
                      <div className="flex items-center">
                        {deleteConfirmation === place.id ? (
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (place.id) {
                                  handleDeletePlace(place.id);
                                }
                              }}
                              className="bg-red-600 text-white px-1.5 py-0.5 rounded text-xs hover:bg-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmation(null);
                              }}
                              className="bg-gray-600 text-white px-1.5 py-0.5 rounded text-xs hover:bg-gray-700"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (place.id) {
                                setDeleteConfirmation(place.id);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {place.id && (
                        <span className="bg-gray-600 text-gray-300 px-1.5 py-0.5 text-xs rounded">
                          ID: {place.id}
                        </span>
                      )}
                      {place.reviewRating > 0 && (
                        <span className="bg-yellow-900/30 text-yellow-400 px-1.5 py-0.5 text-xs rounded">
                          ★ {place.reviewRating.toFixed(1)}
                        </span>
                      )}
                      {place.address && (
                        <span className="bg-gray-600 text-gray-300 px-1.5 py-0.5 text-xs rounded truncate max-w-[150px]">
                          {place.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Form container component
  const FormContainer = () => (
    <div className="flex flex-col h-full">
      <div className="p-3 bg-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">
          {isCreating ? 'Create Place' : selectedPlace ? 'Edit Place' : 'Place Details'}
        </h2>
        {/* Back button for mobile view */}
        <button
          onClick={handleBackToList}
          className="md:hidden px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500"
        >
          Back to List
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        {isCreating ? (
          <PlaceForm
            onSubmit={handleCreatePlace}
            onCancel={cancelForm}
            isCreating={true}
          />
        ) : selectedPlace ? (
          <PlaceForm
            place={selectedPlace}
            onSubmit={handleUpdatePlace}
            onCancel={cancelForm}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-2 overflow-hidden">
      <h1 className="text-2xl font-bold text-white mb-3">Places Dashboard</h1>
      
      {/* Фильтры поиска */}
      <div className="mb-3 flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Search by name</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Enter place name"
            className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        <div className="w-40">
          <label className="block text-xs text-gray-400 mb-1">Search by ID</label>
          <input
            type="number"
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
            placeholder="Enter place ID"
            className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearFilters} 
            className="h-8 px-4 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500"
          >
            Reset
          </button>
          <label className="flex items-center text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showImages}
              onChange={(e) => setShowImages(e.target.checked)}
              className="mr-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Show Images
          </label>
        </div>
      </div>
      
      {/* Desktop view - Side by side */}
      <div className="hidden md:flex space-x-2 flex-1 overflow-hidden">
        <div className="w-1/4 overflow-hidden">
          <PlaceListWrapper />
        </div>
        <div className="w-3/4 overflow-hidden">
          <FormContainer />
        </div>
      </div>
      
      {/* Mobile view - Toggle between list and form */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        {showForm ? <FormContainer /> : <PlaceListWrapper />}
      </div>
    </div>
  );
};

export default PlacesPage; 