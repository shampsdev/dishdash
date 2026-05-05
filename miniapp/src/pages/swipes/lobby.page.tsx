import { BOT_USERNAME } from '@/shared/constants';

import Layout from '@/modules/swipes/layout';
import { Icons } from '@/assets/icons/icons';
import { Avatar } from '@/components/ui/avatar';

import { motion, AnimatePresence, cubicBezier } from 'framer-motion';

import { useLobbyStore } from '@/modules/swipes/lobby/lobby.store';
import { useSettingsStore } from '@/modules/swipes/settings/settings.store';

import { ClassicPlacesSettingsPreview } from '@/modules/swipes/settings/classic-places/classic-places-preview';
import { CollectionPlacesSettingsPreview } from '@/modules/swipes/settings/collection-places/collection-places-preview';
import {
  isClassicPlaces,
  isCollectionPlaces
} from '@/modules/swipes/interfaces/settings/settings.interface';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backButton, openTelegramLink } from '@telegram-apps/sdk-react';

export const LobbyPage = () => {
  const { users, lobbyId } = useLobbyStore();
  const { settings: rawSettings, ready } = useSettingsStore();
  const navigate = useNavigate();

  const onShareClick = () => {
    openTelegramLink(
      `https://t.me/share/url?url=https://t.me/${BOT_USERNAME}/app?startapp=${lobbyId}`
    );
  };

  const setMainScreen = () => {
    navigate('/');
  };

  useEffect(() => {
    backButton.show();
    backButton.onClick(setMainScreen);

    return () => {
      backButton.hide();
      backButton.offClick(setMainScreen);
    };
  }, []);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 1, ease: cubicBezier(0.16, 1, 0.3, 1) }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: cubicBezier(0.7, 0.84, 0, 0) }
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key="lobbySettings"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="flex flex-col h-screen w-full p-0 bg-background"
        >
          <div>
            <div className="pt-5 text-center space-y-2">
              <h1 className="text-2xl font-medium">Участники</h1>
            </div>
            <div className="flex px-5 py-10 flex-wrap justify-center gap-5">
              {users.map((user) => (
                <Avatar
                  key={`${user.id}_${user.name}`}
                  src={user.avatar}
                  style={{
                    height: '60px',
                    width: '60px',
                    outline: 'none'
                  }}
                  fallback={'?'}
                  fallbackElement={
                    <span className="text-[30px] font-medium text-primary">
                      {user?.name
                        .split(' ')
                        .slice(0, 2)
                        .map((x) => x.charAt(0))
                        .join('')
                        .toUpperCase()}
                    </span>
                  }
                />
              ))}
              <div
                onClick={onShareClick}
                className="h-[60px] w-[60px] bg-secondary flex items-center justify-center rounded-full"
              >
                <Icons.addPerson className="text-accent-foreground pr-1 pb-1" />
              </div>
            </div>
          </div>
          <div className="text-center space-y-2">
            {isClassicPlaces(rawSettings) && (
              <ClassicPlacesSettingsPreview
                settings={rawSettings}
                ready={ready}
              />
            )}
            {isCollectionPlaces(rawSettings) && (
              <CollectionPlacesSettingsPreview
                settings={rawSettings}
                ready={ready}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};
