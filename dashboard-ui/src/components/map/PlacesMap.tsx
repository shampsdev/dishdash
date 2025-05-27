import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import './PlacesMap.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls } from 'ol/control';

import type { Place } from '../../types/place';
import { fetchPlaces } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface PlacesMapProps {
  height?: string;
}

const PlacesMap: React.FC<PlacesMapProps> = ({ height = '600px' }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { token } = useAuth();
  
  // Default center position - Saint Petersburg
  const defaultCenter = fromLonLat([30.308611, 59.9375]);
  
  // Refs for DOM elements and OpenLayers objects
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjectRef = useRef<Map | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupCloserRef = useRef<HTMLAnchorElement>(null);
  const popupContentRef = useRef<HTMLDivElement>(null);
  const popupOverlayRef = useRef<Overlay | null>(null);
  
  // Load places data
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        const placesData = await fetchPlaces();
        setPlaces(placesData);
        setFilteredPlaces(placesData);
      } catch (err) {
        console.error('Error loading places for map:', err);
        setError('Failed to load places data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadPlaces();
    }
  }, [token]);
  
  // Filter places when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlaces(places);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = places.filter(place => 
      place.title?.toLowerCase().includes(lowerSearchTerm) || 
      place.address?.toLowerCase().includes(lowerSearchTerm) ||
      place.description?.toLowerCase().includes(lowerSearchTerm)
    );
    
    setFilteredPlaces(filtered);
  }, [searchTerm, places]);
  
  // Initialize map
  useEffect(() => {
    if (loading || error || !mapRef.current) return;
    
         // Create popup overlay
     // We need to use type assertion because the TypeScript definitions
     // for OpenLayers don't include the autoPanAnimation option
     const popupOverlay = new Overlay({
       element: popupRef.current!,
       autoPan: true
     });
    
    popupOverlayRef.current = popupOverlay;
    
    // Close popup when clicking the closer button
    if (popupCloserRef.current) {
      popupCloserRef.current.onclick = function() {
        popupOverlayRef.current?.setPosition(undefined);
        popupCloserRef.current!.blur();
        return false;
      };
    }
    
         // Create vector source and layer for place markers
     const vectorSource = new VectorSource();
     
     // Define a static style for all features
     const markerStyle = new Style({
       image: new CircleStyle({
         radius: 8,
         fill: new Fill({ color: '#3b82f6' }),
         stroke: new Stroke({ color: 'white', width: 2 })
       })
     });
     
     const vectorLayer = new VectorLayer({
       source: vectorSource,
       style: markerStyle
     });
    
         // Create simplified OSM source with reduced tile loading
     const osmSource = new OSM({
       // Reduce the number of tile requests
       wrapX: false,
       crossOrigin: null,
       // Use a simpler tile server with less detailed tiles
       url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
     });
     
     // Create map with simplified configuration
     const map = new Map({
       target: mapRef.current,
       pixelRatio: 1, // Force standard pixel ratio regardless of device
       layers: [
         new TileLayer({
           source: osmSource,
           preload: 0, // Reduce preloading of tiles
           useInterimTilesOnError: false // Don't load interim tiles on error
         }),
         vectorLayer,
       ],
       view: new View({
         center: defaultCenter,
         zoom: 12, // Zoom out a bit to see more of Saint Petersburg
         minZoom: 8, // Limit minimum zoom to reduce tile requests
         maxZoom: 20, // Limit maximum zoom to reduce tile requests
         constrainResolution: true // Snap to zoom levels to reduce tile requests
       }),
       controls: defaultControls({
         attribution: false, // Hide attribution to simplify UI
         zoom: true,
         rotate: false,
       }),
     });
    
    map.addOverlay(popupOverlay);
    
    // Add place features to the vector source
    const validPlaces = filteredPlaces.filter(
      place => place.location && typeof place.location.lat === 'number' && typeof place.location.lon === 'number'
    );
    
         const features = validPlaces.map(place => {
       // Create a point geometry with the correct coordinates
       const coordinates = fromLonLat([place.location!.lon, place.location!.lat]);
       const pointGeometry = new Point(coordinates);
       
       // Create the feature with the point geometry
       const feature = new Feature({
         geometry: pointGeometry,
         place: place,
       });
       
       return feature;
     });
    
    vectorSource.addFeatures(features);
    
    // No auto-zooming - we keep the fixed view on Saint Petersburg
    
    // Add click handler for features
    map.on('click', function(evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });
      
      if (feature) {
        const place = feature.get('place') as Place;
        
        if (popupContentRef.current && popupOverlayRef.current) {
                     // Create popup content with truncated description
           const truncatedDescription = place.description && place.description.length > 50 
             ? place.description.substring(0, 50) + '...' 
             : place.description;
           
           popupContentRef.current.innerHTML = `
             <h3 class="font-bold text-lg text-gray-900">${place.title || ''}</h3>
             ${place.address ? `<p class="text-sm text-gray-700">${place.address}</p>` : ''}
             ${truncatedDescription ? `<p class="text-xs mt-1 text-gray-600">${truncatedDescription}</p>` : ''}
             ${place.url ? `<a href="${place.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-xs mt-2 block">Visit website</a>` : ''}
           `;
          
                     // Get coordinates from the point geometry
           const geometry = feature.getGeometry();
           if (geometry instanceof Point) {
             const coordinates = geometry.getCoordinates();
             popupOverlayRef.current.setPosition(coordinates);
           }
        }
      }
    });
    
    // Change cursor style on hover
    map.on('pointermove', function(evt) {
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });
    
    mapObjectRef.current = map;
    
    // Cleanup function
    return () => {
      if (mapObjectRef.current) {
        mapObjectRef.current.setTarget(undefined);
        mapObjectRef.current = null;
      }
    };
  }, [loading, error, filteredPlaces]);
  
  // Update features when filtered places change
  useEffect(() => {
    if (loading || error || !mapObjectRef.current) return;
    
    const map = mapObjectRef.current;
    
    // Get the vector layer
         const vectorLayer = map.getLayers().getArray().find(
       layer => layer instanceof VectorLayer
     ) as VectorLayer<VectorSource> | undefined;
     
     if (!vectorLayer) return;
     
     const vectorSource = vectorLayer.getSource();
     if (!vectorSource) return;
     
     vectorSource.clear();
     
     // Add place features to the vector source
     const validPlaces = filteredPlaces.filter(
       place => place.location && typeof place.location.lat === 'number' && typeof place.location.lon === 'number'
     );
     
     const features = validPlaces.map(place => {
       // Create a point geometry with the correct coordinates
       const coordinates = fromLonLat([place.location!.lon, place.location!.lat]);
       const pointGeometry = new Point(coordinates);
       
       // Create the feature with the point geometry
       const feature = new Feature({
         geometry: pointGeometry,
         place: place,
       });
       
       return feature;
     });
     
     vectorSource.addFeatures(features);
     
     // No auto-zooming - we keep the fixed view on Saint Petersburg
  }, [filteredPlaces]);

  return (
    <div className="w-full flex flex-col" style={{ height }}>
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="text"
            placeholder="Search places by name, address or description..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-sm text-gray-300 whitespace-nowrap">
            Showing {filteredPlaces.filter(place => place.location && typeof place.location.lat === 'number' && typeof place.location.lon === 'number').length} 
            {' '}of {places.length} places
          </div>
        </div>
      </div>
      <div className="flex-1 w-full relative">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-500 border-opacity-25"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
            <div className="text-red-400">{error}</div>
          </div>
        ) : (
          <>
            <div ref={mapRef} className="w-full h-full rounded-lg"></div>
            <div ref={popupRef} className="ol-popup">
              <a href="#" ref={popupCloserRef} className="ol-popup-closer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </a>
              <div ref={popupContentRef} className="ol-popup-content"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlacesMap; 