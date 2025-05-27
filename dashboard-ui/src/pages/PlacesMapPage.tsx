import React from 'react';
import PlacesMap from '../components/map/PlacesMap';

const PlacesMapPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Places Map</h1>
        <p className="text-gray-400">View all places on an interactive map</p>
      </div>
      
      <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
        <PlacesMap height="100%" />
      </div>
    </div>
  );
};

export default PlacesMapPage; 