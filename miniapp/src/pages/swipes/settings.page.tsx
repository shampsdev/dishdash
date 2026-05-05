import Layout from '@/modules/swipes/layout';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';

import { isClassicPlaces } from '@/modules/swipes/interfaces/settings/settings.interface';
import { useSettingsStore } from '@/modules/swipes/settings/settings.store';
import { ClassicPlacesSettingsPanel } from '@/modules/swipes/settings/classic-places/classic-places-pannel';
import { useEffect } from 'react';
import { useServerRouteStore } from '@/shared/stores/server-route.store';
import { backButton } from '@telegram-apps/sdk-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const SettingsPage = () => {
  const { settings, ready } = useSettingsStore();
  const { setRoute } = useServerRouteStore();

  const setPreview = () => {
    setRoute('lobby');
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 2, ease: cubicBezier(0.16, 1, 0.3, 1) }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: cubicBezier(0.7, 0.84, 0, 0) }
    }
  };

  useEffect(() => {
    backButton.show();
    backButton.onClick(setPreview);

    return () => {
      backButton.hide();
      backButton.offClick(setPreview);
    };
  }, []);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key="lobbySettings"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-[92%] mx-auto p-0 bg-background"
        >
          <div className="flex flex-col items-center justify-center w-[90%] max-w-lg">
            <div className="flex w-full justify-between items-center">
              <h3 className="text-2xl font-medium my-4 w-full text-left">
                Настройки
              </h3>
            </div>
          </div>

          {isClassicPlaces(settings) && (
            <ClassicPlacesSettingsPanel settings={settings} />
          )}

          <div className="absolute z-10 bottom-10 right-0 left-0">
            <div className="flex justify-center gap-4">
              <Button
                onClick={setPreview}
                className={cn(
                  'w-fit mx-auto min-w-[140px] text-center',
                  ready
                    ? 'bg-accent-foreground text-secondary-foreground'
                    : 'bg-secondary text-secondary-foreground pointer-events-none'
                )}
              >
                Выбрать
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};
