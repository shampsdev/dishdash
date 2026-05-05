import { ClassicPlacesSettings } from '@/modules/swipes/interfaces/settings/settings.interface';
import { useSettingsStore } from '../settings.store';
import { useEffect } from 'react';
import { swipesEvent } from '../../events/app-events/swipes.event';
import { useNavigate } from 'react-router-dom';
import { useServerRouteStore } from '@/shared/stores/server-route.store';
import { backButton } from '@telegram-apps/sdk-react';
import { Button } from '@/components/ui/button';

interface PreviewSettingsProps {
  settings: ClassicPlacesSettings;
  ready: boolean;
}

export const ClassicPlacesSettingsPreview = ({
  settings,
  ready
}: PreviewSettingsProps) => {
  const { tags } = useSettingsStore();
  const { setRoute } = useServerRouteStore();
  const navigate = useNavigate();

  const setSettings = () => {
    setRoute('settings');
  };

  const setMainScreen = () => {
    navigate('/');
  };

  const setStart = () => {
    swipesEvent.start();
  };

  useEffect(() => {
    backButton.show();
    backButton.onClick(setMainScreen);

    return () => {
      backButton.hide();
      backButton.offClick(setMainScreen);
    };
  }, []);

  return (
    <>
      <h1 className="text-2xl font-medium">Настройки лобби</h1>
      {settings.classicPlaces.tags.length === 0 && (
        <p className="w-3/4 mx-auto">
          Пока что вы ничего не выбрали :( <br /> Перейдите в настройки
        </p>
      )}
      <div className='pb-4'></div>
      {settings.classicPlaces && settings.classicPlaces.tags.length > 0 && (
        <div className="w-[92%] mx-auto">
          <div className="grid grid-cols-3 gap-2">
            {tags
              .filter((x) => settings.classicPlaces.tags.includes(x.id))
              .map((x, index) => (
                <div
                  key={`${x.id}_${index}`}
                  className="h-full w-full flex items-center bg-secondary rounded-xl"
                >
                  <img className="p-1" src={x.icon} />
                </div>
              ))}
            <div className="h-full w-full min-h-28 flex flex-col justify-center items-center bg-secondary rounded-xl">
              <span className="text-2xl font-medium">
                {settings.classicPlaces.priceAvg <= 800
                  ? '₽'
                  : settings.classicPlaces.priceAvg < 1600
                    ? '₽₽'
                    : '₽₽₽'}
              </span>
              <span>
                {settings.classicPlaces.priceAvg <= 800
                  ? 'Дешево'
                  : settings.classicPlaces.priceAvg < 1600
                    ? 'Средне'
                    : 'Дорого'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute z-10 bottom-10 right-0 left-0">
        <div className="mx-auto w-fit flex gap-4">
          <Button
            className="w-full min-w-[140px] bg-secondary"
            onClick={setSettings}
          >
            Настроить
          </Button>
          {ready && (
            <Button className="w-full min-w-[140px]" onClick={setStart}>
              Начать
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
