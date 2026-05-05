import { CustomMap } from './ui/map';
import { MapRef, Marker, MarkerDragEvent } from 'react-map-gl/mapbox';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Place } from '@/interfaces/place.interface';
import { useEffect, useRef } from 'react';

interface LocationPickerProps {
  className?: string;
  place: Place;
  setPlace: React.Dispatch<React.SetStateAction<Place>>;
}

export const LocationPicker = ({
  className,
  place,
  setPlace,
}: LocationPickerProps) => {
  const mapRef = useRef<MapRef>(null);

  const handleMarkerDragEnd = ({ lngLat }: MarkerDragEvent) => {
    setPlace((prev) => ({
      ...prev,
      location: {
        lat: lngLat.lat,
        lon: lngLat.lng,
      },
    }));
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [place.location.lon, place.location.lat],
        zoom: 15,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place.id]);

  return (
    <div className={cn(className)}>
      <Label>Location </Label>
      <div className='h-full w-full relative border border-secondary rounded-lg overflow-hidden'>
        <span className='text-primary text-xs bg-background p-2 absolute bottom-0 right-0 rounded-tl-lg z-20'>
          lat. {place.location.lat.toFixed(5)} / lon.{' '}
          {place.location.lon.toFixed(5)}
        </span>
        <CustomMap
          ref={mapRef}
          initialViewState={{
            latitude: place.location.lat,
            longitude: place.location.lon,
            zoom: 15,
          }}
        >
          <Marker
            draggable
            onDragEnd={handleMarkerDragEnd}
            longitude={place.location.lon}
            latitude={place.location.lat}
          >
            <div className='relative group'>
              <img
                className='h-[30px] w-[30px] rounded-full border-2 border-primary'
                src={place.images[0]}
                alt={place.title}
              />
              <div className='invisible absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:visible group-active:hidden'>
                {place.title}
              </div>
            </div>
          </Marker>
        </CustomMap>
      </div>
    </div>
  );
};
