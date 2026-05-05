import { motion, AnimatePresence } from 'framer-motion';
import { easeOutExpo } from '@/lib/easings.data';

import { useLobbyStore } from '@/modules/swipes/lobby/lobby.store';
import { SwipableCard } from '../../components/ui/swipes/swipable-card';
import { useEffect } from 'react';
import { Icons } from '@/assets/icons/icons';
import { useServerRouteStore } from '@/shared/stores/server-route.store';
import { useResultStore } from '@/modules/swipes/results/result.store';
import { getTime } from '@/shared/util/time.util';
import { useSettingsStore } from '@/modules/swipes/settings/settings.store';
import {
  isClassicPlaces,
  isCollectionPlaces
} from '@/modules/swipes/interfaces/settings/settings.interface';

import { viewport, hapticFeedback } from '@telegram-apps/sdk-react';
import { Card } from '@/components/ui/swipes/card';
import { useSaved } from '@/shared/hooks/useSaved';
import { swipesEvent } from '@/modules/swipes/events/app-events/swipes.event';
import { getDistance } from '@/shared/util/distance.util';

export type SwipeType = 'like' | 'dislike';

export const SwipesPage = () => {
  const { cards } = useLobbyStore();
  const { settings } = useSettingsStore();
  const { setRoute } = useServerRouteStore();
  const { result } = useResultStore();

  const { saved, removeFromSaved, addtoSaved } = useSaved();

  const safeAreaInsets = viewport.safeAreaInsets();

  const length = result?.top?.length ?? 0;

  const onResults = () => {
    setRoute('results');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (cards.length === 0) {
        onResults();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [cards]);

  // Define optional card variants
  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: easeOutExpo }
    },
    upcoming: {
      opacity: 0.5,
      y: 67,
      scale: 0.9,
      transition: { duration: 0.3, ease: easeOutExpo }
    },
    remainings: {
      opacity: 0,
      y: 60,
      scale: 0.9
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: easeOutExpo }
    }
  };

  const toggleSave = (id: number) => {
    if (saved?.places.flatMap((x) => x.id).includes(id)) {
      removeFromSaved(id);
    } else {
      addtoSaved(id);
    }
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
  };

  return (
    <div
      style={{
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0,
        paddingTop:
          safeAreaInsets.top > 0 ? safeAreaInsets.top * 2.2 : '1.25rem'
      }}
      className="min-h-screen flex flex-col"
    >
      <div className="flex w-[92%] mx-auto justify-between items-center pb-5">
        <div className="flex text-xl font-medium">
          <h1 className="text-xl font-medium">Свайпайте</h1>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={length}
            onTap={onResults}
            className={`${length === 1 && 'animate-scale'} p-2 bg-secondary rounded-full relative cursor-pointer transition-transform active:scale-75 active:opacity-75`}
          >
            <Icons.heart
              className={`${length === 1 && 'animate-pulse'} text-primary`}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex-grow w-[92%] mx-auto relative h-full overflow-visible">
        <AnimatePresence>
          {cards.length > 0 &&
            cards.map((card, i) => {
              const isLast = i === cards.length - 1;
              const isUpcoming = i === cards.length - 2;
              return (
                <motion.div
                  key={`card-${card.id}`}
                  className="absolute h-full w-full"
                  variants={cardVariants}
                  initial="remainings"
                  animate={
                    isLast ? 'current' : isUpcoming ? 'upcoming' : 'remainings'
                  }
                  exit="exit"
                >
                  <SwipableCard
                    onSwipeLeft={() => swipesEvent.swipe(card.id, 'dislike')}
                    onSwipeRight={() => swipesEvent.swipe(card.id, 'like')}
                  >
                    <Card
                      onSaved={() => toggleSave(card.id)}
                      card={card}
                      saved={saved?.places
                        .flatMap((x) => x.id)
                        .includes(card.id)}
                      time={
                        isClassicPlaces(settings)
                          ? getTime(
                              getDistance(
                                settings.classicPlaces.location,
                                card.location
                              )
                            )
                          : isCollectionPlaces(settings)
                            ? getTime(
                                getDistance(
                                  settings.collectionPlaces.location,
                                  card.location
                                )
                              )
                            : '0'
                      }
                      likes={result?.top
                        .filter((like) => like.card.id === card.id)
                        .flatMap((x) => x.likes)}
                    />
                  </SwipableCard>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};
