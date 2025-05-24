import React, { useState, useEffect, useRef } from 'react';
import { fetchPlaces } from '../../services/api';
import type { Place } from '../../types/place';

interface PlacesMultiSelectProps {
  selectedPlaces: number[];
  onChange: (selectedPlaces: number[]) => void;
}

const PlacesMultiSelect: React.FC<PlacesMultiSelectProps> = ({ selectedPlaces, onChange }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch places on component mount
  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      try {
        const placesData = await fetchPlaces();
        setPlaces(placesData);
        setFilteredPlaces(placesData);
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  // Filter places when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPlaces(places);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = places.filter(place => 
        place.title.toLowerCase().includes(lowercaseSearch) || 
        place.address.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredPlaces(filtered);
    }
  }, [searchTerm, places]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePlace = (placeId: number) => {
    if (selectedPlaces.includes(placeId)) {
      onChange(selectedPlaces.filter(id => id !== placeId));
    } else {
      onChange([...selectedPlaces, placeId]);
    }
  };

  // Get selected places details for display
  const getSelectedPlacesDetails = () => {
    const selectedPlacesDetails = places.filter(place => 
      selectedPlaces.includes(place.id!)
    );
    return selectedPlacesDetails;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full rounded-md bg-gray-700 border border-gray-600 text-white px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedPlaces.length > 0 ? (
            <span>{selectedPlaces.length} places selected</span>
          ) : (
            <span className="text-gray-400">Select places...</span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Display selected places as chips */}
      {selectedPlaces.length > 0 && !isOpen && (
        <div className="mt-2 flex flex-wrap gap-1">
          {getSelectedPlacesDetails().map(place => (
            <div key={place.id} className="bg-blue-900/40 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
              <span className="truncate max-w-[150px]">{place.title}</span>
              <button 
                className="ml-1 text-blue-400 hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlace(place.id!);
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-700 shadow-lg rounded-md max-h-80 overflow-auto custom-scrollbar">
          <div className="sticky top-0 bg-gray-700 p-2 border-b border-gray-600 z-10">
            <input
              type="text"
              placeholder="Search places..."
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()} // Prevent dropdown from closing
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-t-blue-500 border-blue-500 border-opacity-25"></div>
              <span className="ml-2 text-gray-300">Loading places...</span>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="py-4 px-3 text-gray-400 text-center">
              {searchTerm ? 'No matching places found' : 'No places available'}
            </div>
          ) : (
            <div className="py-1">
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-600 ${
                    selectedPlaces.includes(place.id!) ? 'bg-blue-900/30' : ''
                  }`}
                  onClick={() => togglePlace(place.id!)}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 rounded bg-gray-700"
                    checked={selectedPlaces.includes(place.id!)}
                    onChange={() => {}} // Handled by parent div click
                    onClick={e => e.stopPropagation()}
                  />
                  
                  {place.images && place.images.length > 0 && (
                    <div className="ml-2 h-8 w-8 bg-gray-600 rounded overflow-hidden">
                      <img 
                        src={place.images[0]} 
                        alt="" 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="ml-2 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm text-white truncate">{place.title}</p>
                      <p className="text-xs text-gray-400">ID: {place.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <p className="text-xs text-gray-400 truncate">{place.address}</p>
                      {place.reviewRating > 0 && (
                        <span className="bg-yellow-900/30 text-yellow-400 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {place.reviewRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedPlaces.length > 0 && (
            <div className="sticky bottom-0 bg-gray-700 p-2 border-t border-gray-600 flex justify-between items-center">
              <span className="text-sm text-gray-300">{selectedPlaces.length} places selected</span>
              <button
                className="px-2 py-1 bg-gray-600 text-xs text-gray-300 rounded hover:bg-gray-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlacesMultiSelect; 