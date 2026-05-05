import { Toggle } from '@/components/ui/toggle';
import { ClassicPlacesSettings } from '@/modules/swipes/interfaces/settings/settings.interface';
import { useSettingsStore } from './settings.store';
import { settingsUpdateEvent } from '../events/app-events/settings.event';
import { hapticFeedback } from '@telegram-apps/sdk-react';

export const Tags = () => {
  const { settings: rawSettings, tags } = useSettingsStore();
  const settings = rawSettings as ClassicPlacesSettings;

  const toggleCategoryType = (tagId: number) => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }

    const found = settings.classicPlaces.tags.find((x) => x == tagId);
    let updatedTags: number[] = [];

    if (found != undefined) {
      updatedTags = settings.classicPlaces.tags.filter((x) => x != found);
    } else {
      updatedTags = [...settings.classicPlaces.tags, tagId];
    }

    const newSettings: ClassicPlacesSettings = {
      type: 'classicPlaces',
      classicPlaces: {
        location: settings.classicPlaces.location,
        priceAvg: settings.classicPlaces.priceAvg,
        tags: updatedTags,
        recommendation: settings.classicPlaces.recommendation
      }
    };

    settingsUpdateEvent.update(newSettings);
  };

  return (
    <>
      {tags
        .sort((a, b) => a.order - b.order)
        .map(
          (tag) =>
            tag.visible && (
              <Toggle
                key={tag.id}
                pressed={settings.classicPlaces.tags.some((x) => x === tag.id)}
                className="relative flex py-2 flex-col justify-start rounded-2xl transition-colors bg-secondary border-none duration-150 w-full h-[140px] items-start"
                onClick={() => toggleCategoryType(tag.id)}
              >
                <span className="text-[15px] text-left font-medium relative z-10">
                  {tag.name}
                </span>

                <div className="relative z-10 w-full flex-grow aspect-square rounded-lg flex justify-center items-center overflow-hidden">
                  <img
                    className="w-full h-full object-contain"
                    src={tag.icon}
                  />
                </div>
              </Toggle>
            )
        )}
    </>
  );
};
