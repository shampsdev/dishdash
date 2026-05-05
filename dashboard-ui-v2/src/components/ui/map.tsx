import React from 'react';

import Map, { MapProps, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import LIGHT_MAP_STYLE from '@/assets/map/monochrome-light.json';
import DARK_MAP_STYPE from '@/assets/map/monochrome-dark.json';
import { MAPBOX_TOKEN } from '@/shared/constants';
import { useDarkMode } from '@/shared/providers/dark-mode.provider';

type CustomMapProps = Omit<MapProps, 'projection' | 'logoPosition' | 'terrain'>;

export const CustomMap = React.forwardRef<MapRef, CustomMapProps>(
  (props, ref) => {
    const { isDark } = useDarkMode();

    return (
      <Map
        //@ts-expect-error something's wrong here with the types
        mapStyle={isDark ? DARK_MAP_STYPE : LIGHT_MAP_STYLE}
        attributionControl={false}
        mapboxAccessToken={MAPBOX_TOKEN}
        ref={ref}
        {...props}
      >
        {props.children}
      </Map>
    );
  }
);

CustomMap.displayName = 'CustomMap';
