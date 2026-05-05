import { Button } from '@/components/ui/button';
import { StyledMap, StyledMapProps } from './styled-map';
import { cn } from '@/lib/utils';

import marker from '@/assets/icons/marker.png';
import { useState } from 'react';
import { ViewStateChangeEvent } from 'react-map-gl';
import { fetchAddress } from '@/shared/api/places.api';

interface SelectPointMapProps extends StyledMapProps {
  onMainButtonClick: () => void;
}

export const SelectPointMap = (props: SelectPointMapProps) => {
  const [isMoving, setIsMoving] = useState(false);
  const [address, setAddress] = useState('Кронверкский пр-кт, д 49');

  const handleMoveStart = (evt: ViewStateChangeEvent) => {
    setIsMoving(true);
    setAddress('проверяем...');
    if (props.onMoveStart) props.onMoveStart(evt);
  };

  const handleMoveEnd = (evt: ViewStateChangeEvent) => {
    setIsMoving(false);

    const coords = {
      lat: evt.viewState.latitude,
      lon: evt.viewState.longitude
    };

    fetchAddress(coords).then((res) => {
      setAddress(res?.address ?? '...');
    });

    if (props.onMoveEnd) props.onMoveEnd(evt);
  };

  return (
    <div className={cn('h-screen w-svh z-[50] relative', props.className)}>
      <StyledMap
        {...props}
        onMoveStart={handleMoveStart}
        onMoveEnd={handleMoveEnd}
      />

      <div className="absolute z-[1000] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
          <div
            className={cn(
              'h-[48px] w-[58px] z-10 transition-transform duration-300',
              isMoving ? '-translate-y-6' : 'translate-y-0'
            )}
          >
            <img className="object-contain" src={marker} />
          </div>
          <div className="h-[6px] w-[9px] bg-white rounded-[100%] -mt-1"></div>
        </div>
      </div>
      <div className="pointer-events-none absolute z-20 bottom-0 right-0 left-0 flex flex-col h-56 gap-6 justify-center items-center">
        <div className="text-center">
          <p className="text-secondary-foreground">Искать в радиусе:</p>
          <h2 className="text-xl font-semibold">{address}</h2>
        </div>
        <Button
          onClick={props.onMainButtonClick}
          className="z-20 pointer-events-auto"
        >
          Выбрать этот адрес
        </Button>
      </div>
      <div className="absolute pointer-events-none bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
    </div>
  );
};
