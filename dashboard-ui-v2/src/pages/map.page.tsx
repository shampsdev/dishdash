import { Input } from '@/components/ui/input';
import { CustomMap } from '@/components/ui/map';
import { usePlaces } from '@/shared/hooks/usePlaces';
import { Marker } from 'react-map-gl/mapbox';
import { useNavigate } from 'react-router-dom';

export const MapPage = () => {
  const { data: places } = usePlaces();
  const naviagte = useNavigate();

  return (
    <div className='w-full relative h-full flex'>
      <div className='absolute z-20 w-full m-2'>
        <div className='bg-background w-[80%] md:w-[50%] h-10 mx-auto rounded-xl flex items-center'>
          <Input
            type='text'
            placeholder='Название места ...'
            className='dark:bg-transparent border-none dark:ring-0'
          />
        </div>
      </div>
      <CustomMap
        initialViewState={{
          latitude: 59.95725,
          longitude: 30.30826,
          zoom: 15,
        }}
      >
        {places?.map((place) => {
          return (
            <Marker
              onClick={() => naviagte(`/dashboard/${place.id}`)}
              longitude={place.location.lon}
              latitude={place.location.lat}
            >
              <div className='relative group cursor-pointer'>
                {/* <img
                  className='h-[30px] w-[30px] rounded-full border-2'
                  src={place.images[0]}
                  alt={place.title}
                /> */}
                <div className='h-[10px] w-[10px] rounded-full bg-primary'></div>
                <div className='invisible absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:visible'>
                  {place.title}
                </div>
              </div>
            </Marker>
          );
        })}
      </CustomMap>
    </div>
  );
};
