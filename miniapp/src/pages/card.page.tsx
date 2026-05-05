import { Card } from '@/components/ui/swipes/card';
import { SwipableCard } from '@/components/ui/swipes/swipable-card';
import { Card as CardInterface } from '@/modules/swipes/interfaces/card.interface';
import { fetchPlace } from '@/shared/api/places.api';
import { useSafeArea } from '@/shared/hooks/useSafeArea';
import { useSaved } from '@/shared/hooks/useSaved';
import {
  backButton,
  hapticFeedback,
} from '@telegram-apps/sdk-react';
import { cubicBezier, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const CardPage = () => {
  const { cardId } = useParams();

  const [card, setCard] = useState<CardInterface | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      if (!cardId) return;
      const data = await fetchPlace(cardId);
      if (data) setCard(data);
    };

    loadCard();
  }, [cardId]);

  const navigate = useNavigate();
  const { safeAreaInsets } = useSafeArea();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    backButton.show();
    backButton.onClick(goBack);

    return () => {
      backButton.hide();
      backButton.offClick(goBack);
    };
  }, []);

  const { saved, removeFromSaved, addtoSaved } = useSaved();

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

  const onSwipe = () => {
    goBack();
  };

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
    <div
      style={{
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0,
        paddingTop:
          safeAreaInsets.top > 0 ? safeAreaInsets.top * 2.2 : '1.25rem'
      }}
      className="min-h-screen flex flex-col"
    >
      <div className="flex-grow w-[92%] mx-auto relative h-full overflow-visible">
        {card && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute h-full w-full"
            variants={pageVariants}
          >
            <SwipableCard onSwipeLeft={onSwipe} onSwipeRight={onSwipe}>
              <Card
                onSaved={() => toggleSave(card.id)}
                card={card}
                saved={saved?.places.flatMap((x) => x.id).includes(card.id)}
              />
            </SwipableCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};
