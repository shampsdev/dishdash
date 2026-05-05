import { CollectionPlacesSettings } from '@/modules/swipes/interfaces/settings/settings.interface';
import { useEffect, useState } from 'react';
import { Collection } from '@/shared/interfaces/collection.interface';
import { fetchCollection } from '@/shared/api/collections.api';
import { swipesEvent } from '../../events/app-events/swipes.event';
import { Button } from '@/components/ui/button';

interface PreviewSettingsProps {
  settings: CollectionPlacesSettings;
  ready: boolean;
}

export const CollectionPlacesSettingsPreview = ({
  settings
}: PreviewSettingsProps) => {
  const [collection, setCollection] = useState<Collection | undefined>();

  useEffect(() => {
    fetchCollection(settings.collectionPlaces.collectionId).then((result) => {
      setCollection(result);
    });
  }, []);

  const setStart = () => {
    swipesEvent.start();
  };

  return (
    collection != undefined && (
      <div className="absolute z-10 bottom-10 right-0 left-0">
        <div className="mx-auto w-fit flex gap-4">
          <Button className="w-full min-w-[140px]" onClick={setStart}>
            Начать
          </Button>
        </div>
      </div>
    )
  );
};
