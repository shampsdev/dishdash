import { ClassicPlacesSettings } from '@/modules/swipes/interfaces/settings/settings.interface';
import { useCallback, useEffect, useState } from 'react';
import { settingsUpdateEvent } from '../../events/app-events/settings.event';
import { Tags } from '../tags';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@telegram-apps/sdk-react';

interface SettingsProps {
  settings: ClassicPlacesSettings;
}

export const ClassicPlacesSettingsPanel = ({ settings }: SettingsProps) => {
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (settings.classicPlaces.priceAvg <= 800) {
      setSelectedPriceLevel('cheap');
    } else if (settings.classicPlaces.priceAvg < 1600) {
      setSelectedPriceLevel('normal');
    } else {
      setSelectedPriceLevel('expensive');
    }
  }, [settings.classicPlaces.priceAvg]);

  const handleSettingsChange = useCallback(
    (newSettings: ClassicPlacesSettings) => {
      settingsUpdateEvent.update(newSettings);
    },
    []
  );

  const onPriceChange = (value: number[]) => {
    handleSettingsChange({
      type: 'classicPlaces',
      classicPlaces: {
        location: settings.classicPlaces.location,
        priceAvg: value[0],
        tags: settings.classicPlaces.tags,
        recommendation: settings.classicPlaces.recommendation
      }
    });
  };

  const handleSelectPrice = (level: string) => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }

    setSelectedPriceLevel(level);
    if (level === 'cheap') {
      onPriceChange([800]); // Cheap price
    } else if (level === 'normal') {
      onPriceChange([1200]); // Normal price
    } else if (level === 'expensive') {
      onPriceChange([1600]); // Expensive price
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 w-full overflow-y-auto no-scrollbar">
        <Tags />
      </div>
      <h2 className="text-2xl py-3 font-medium">Средний чек</h2>
      <div className="grid grid-cols-3">
        <div
          className={cn(
            'cursor-pointer h-20 w-28 flex flex-col justify-center items-center bg-secondary rounded-xl',
            selectedPriceLevel === 'cheap' ? 'bg-accent-foreground' : ''
          )}
          onClick={() => handleSelectPrice('cheap')}
        >
          <span className="text-2xl font-medium tracking-wide">₽</span>
          <span>Дешево</span>
        </div>
        <div
          className={cn(
            'cursor-pointer h-20 w-28 flex flex-col justify-center items-center bg-secondary rounded-xl',
            selectedPriceLevel === 'normal' ? 'bg-accent-foreground' : ''
          )}
          onClick={() => handleSelectPrice('normal')}
        >
          <span className="text-2xl font-medium tracking-wide">₽₽</span>
          <span>Средне</span>
        </div>
        <div
          className={cn(
            'cursor-pointer h-20 w-28 flex flex-col justify-center items-center bg-secondary rounded-xl',
            selectedPriceLevel === 'expensive' ? 'bg-accent-foreground' : ''
          )}
          onClick={() => handleSelectPrice('expensive')}
        >
          <span className="text-2xl font-medium tracking-wide">₽₽₽</span>
          <span>Дорого</span>
        </div>
      </div>
    </>
  );
};
