import { Icons } from '@/assets/icons/icons';
import { ResultCard } from '@/modules/swipes/results/result-card';
import { useResultStore } from '@/modules/swipes/results/result.store';
import { useServerRouteStore } from '@/shared/stores/server-route.store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import face from '@/assets/icons/hmmm.png';
import { backButton } from '@telegram-apps/sdk-react';
import { Button } from '@/components/ui/button';
import { useLobbyStore } from '@/modules/swipes/lobby/lobby.store';
import { useSafeArea } from '@/shared/hooks/useSafeArea';
import { useSettingsStore } from '@/modules/swipes/settings/settings.store';
import {
  isClassicPlaces,
  isCollectionPlaces
} from '@/modules/swipes/interfaces/settings/settings.interface';
import { getDistance } from '@/shared/util/distance.util';

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export const ResultPage = () => {
  const { cards } = useLobbyStore();
  const { settings } = useSettingsStore();
  const { result } = useResultStore();
  const navigate = useNavigate();

  const { safeAreaInsets } = useSafeArea();

  const { setRoute } = useServerRouteStore();

  const goBack = () => {
    navigate('/');
  };

  const setSwipes = () => {
    setRoute('swiping');
  };

  useEffect(() => {
    backButton.show();
    backButton.onClick(goBack);

    return () => {
      backButton.hide();
      backButton.offClick(goBack);
    };
  }, []);

  const matches = result?.top ?? [];

  return (
    <div
      style={{
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0,
        paddingTop:
          safeAreaInsets.top > 0 ? safeAreaInsets.top * 2.2 : '1.25rem'
      }}
      className="flex flex-col overflow-y-scroll h-screen no-scrollbar pb-24"
    >
      <div className="flex w-[92%] mx-auto justify-between items-center">
        <h1 className="text-xl font-medium">Ваши мэтчи</h1>
        {cards.length > 0 && (
          <motion.div
            onTap={setSwipes}
            className="cursor-pointer active:scale-75 flex justify-center items-center w-[33px] h-[33px] bg-secondary rounded-full active:opacity-75 transition-all"
          >
            <Icons.cards className="h-[21px] w-[19px] ml-[2px]" />
          </motion.div>
        )}
      </div>
      {result && result.top.length > 0 ? (
        <AnimatePresence>
          <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
          >
            {matches.map((x) => (
              <motion.div
                key={`result_card_${x.card.id}`}
                variants={childVariants}
              >
                <ResultCard
                  distance={
                    isClassicPlaces(settings)
                      ? getDistance(
                          settings.classicPlaces.location,
                          x.card.location
                        )
                      : isCollectionPlaces(settings)
                        ? getDistance(
                            settings.collectionPlaces.location,
                            x.card.location
                          )
                        : undefined
                  }
                  onClick={() => navigate(`${x.card.id}`)}
                  card={x.card}
                  likes={x.likes}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex space-y-3 h-[75vh] items-center justify-center flex-col">
          <div className="w-[30%] mx-auto pb-2">
            <img src={face} />
          </div>
          <p className="text-2xl font-medium">Пока ничего нет</p>
          <p className="w-[90%] text-center">Здесь появятся ваши мэтчи</p>
        </div>
      )}
      <div className="absolute z-10 bottom-10 right-0 left-0">
        <Button onClick={goBack} className="w-fit mx-auto">
          На главную
        </Button>
      </div>
    </div>
  );
};
