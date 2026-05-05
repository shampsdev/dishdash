import { useState } from 'react';
import { useMatchStore } from '@/modules/swipes/match/match.store';
import { useSafeArea } from '@/shared/hooks/useSafeArea';
import { useServerRouteStore } from '@/shared/stores/server-route.store';
import { hapticFeedback } from '@telegram-apps/sdk-react';
import { motion } from 'framer-motion';
import { useResultStore } from '../results/result.store';
import { SwipableCard } from '@/components/ui/swipes/swipable-card';
import { Card } from '@/components/ui/swipes/card';
import { useSaved } from '@/shared/hooks/useSaved';
import {
  isClassicPlaces,
  isCollectionPlaces
} from '../interfaces/settings/settings.interface';
import { getTime } from '@/shared/util/time.util';
import { useSettingsStore } from '../settings/settings.store';
import { getDistance } from '@/shared/util/distance.util';

export const MatchCard = () => {
  const { card } = useMatchStore();
  const { result } = useResultStore();
  const { setRoute } = useServerRouteStore();
  const { saved, removeFromSaved, addtoSaved } = useSaved();
  const { settings } = useSettingsStore();
  const { safeAreaInsets } = useSafeArea();

  const [phase, setPhase] = useState<'match' | 'animatingOut' | 'card'>(
    'match'
  );

  const onResults = () => setRoute('results');
  const onContinue = () => setRoute('swiping');

  const likes = result?.top
    .filter((like) => like.card.id === card?.id)
    .flatMap((x) => x.likes);

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
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0
      }}
      className="flex h-screen pb-6 flex-col justify-center items-center overflow-hidden"
      onClick={() => {
        if (phase === 'match') setPhase('animatingOut');
      }}
    >
      {(phase === 'match' || phase === 'animatingOut') && (
        <motion.div
          className="absolute inset-0 z-10 flex flex-col justify-center items-center"
          initial={{ opacity: 1 }}
          animate={phase === 'animatingOut' ? { opacity: 0 } : {}}
          transition={{ duration: 0.8 }}
          onAnimationComplete={() => {
            if (phase === 'animatingOut') setPhase('card');
          }}
        >
          <div className="w-fit italic font-bold uppercase">
            <motion.h2
              initial={{ x: '-100%' }}
              animate={phase === 'match' ? { x: 0 } : { x: '-200%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-3xl"
            >
              it&apos;s a
            </motion.h2>
            <motion.h1
              initial={{ x: '100%' }}
              animate={phase === 'match' ? { x: 0 } : { x: '200%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-6xl pr-2 -mt-2"
            >
              match!
            </motion.h1>
          </div>
        </motion.div>
      )}

      {phase === 'card' && card && (
        <div
          style={{
            paddingTop:
              safeAreaInsets.top > 0 ? safeAreaInsets.top * 2 : '1.25rem'
          }}
          className="flex-grow w-[92%] mx-auto relative h-full overflow-visible"
        >
          <div className="uppercase italic font-bold pb-5 w-fit mx-auto">
            <h1 className="text-xl pr-2">it&apos;s a match!</h1>
          </div>
          <SwipableCard onSwipeLeft={onContinue} onSwipeRight={onResults}>
            <Card
              onSaved={() => toggleSave(card.id)}
              card={card}
              saved={saved?.places.flatMap((x) => x.id).includes(card.id)}
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
              likes={likes}
            />
          </SwipableCard>
        </div>
      )}
    </div>
  );
};
