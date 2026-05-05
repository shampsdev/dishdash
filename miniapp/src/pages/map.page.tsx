import { useCallback, useEffect, useState } from 'react';

import { postLobby } from '@/shared/api/lobby.api';
import {
  ClassicPlacesSettings,
  CollectionPlacesSettings
} from '@/modules/swipes/interfaces/settings/settings.interface';
import { Location } from '@/shared/interfaces/location.interface';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectPointMap } from '@/modules/map/select-point-map';
import { backButton, mainButton } from '@telegram-apps/sdk-react';

export const MapPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [location, setLocation] = useState<Location>({
    lat: 59.95624325142887,
    lon: 30.309287115051006
  });

  const goBack = () => {
    navigate(-1);
  };

  const onMainButtonClick = useCallback(async () => {
    let collectionSettings: CollectionPlacesSettings = {
      type: 'collectionPlaces',
      collectionPlaces: {
        location,
        collectionId: id || ''
      }
    };

    let classicSettings: ClassicPlacesSettings = {
      type: 'classicPlaces',
      classicPlaces: {
        location,
        priceAvg: 1200,
        tags: [],
        recommendation: null
      }
    };

    const settings = id !== undefined ? collectionSettings : classicSettings;

    try {
      const lobby = await postLobby(settings);
      if (lobby != undefined) {
        navigate(`/${lobby.id}/lobby`);
      }
    } catch (error) {
      console.error('Failed to create lobby:', error);
    }
  }, [location, id, navigate]);

  const onPointChange = (point: Location) => {
    setLocation(point);
  };

  useEffect(() => {
    backButton.show();
    backButton.onClick(goBack);

    return () => {
      backButton.hide();
      backButton.offClick(goBack);
    };
  }, []);

  useEffect(() => {
    mainButton.onClick(onMainButtonClick);

    return () => {
      mainButton.offClick(onMainButtonClick);
    };
  }, [onMainButtonClick]);

  return (
    <div className="h-screen w-svh z-[50] relative">
      <SelectPointMap
        showNavigationControls
        showZoomControls
        onPointChange={onPointChange}
        onMainButtonClick={onMainButtonClick}
      />
    </div>
  );
};
