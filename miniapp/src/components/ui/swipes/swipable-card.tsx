import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo
} from 'framer-motion';
import { useLobbyStore } from '@/modules/swipes/lobby/lobby.store';
import { CardSwipeDirection } from '../../../modules/swipes/interfaces/card.interface';
import { ReactElement } from 'react';
import CardDecision from './card-decision';
import { CardComponentProps } from '@/components/ui/swipes/card';
import { hapticFeedback } from '@telegram-apps/sdk-react';

type Props = {
  children: ReactElement<CardComponentProps>;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
};

export const SwipableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight
}: Props): JSX.Element => {
  const { cards, setCards } = useLobbyStore();

  const x = useMotionValue(0);
  const offsetBoundary = 80;

  const inputX = [offsetBoundary * -1, 0, offsetBoundary];
  const outputRotate = [-15, 0, 15];

  let drivenRotation = useTransform(x, inputX, outputRotate);

  const sendDirection = (direction: CardSwipeDirection) => {
    if (direction === 'left') {
      if (onSwipeLeft) onSwipeLeft();
    } else {
      if (onSwipeRight) onSwipeRight();
    }
  };

  const handlePanEnd = (info: any) => {
    const isOffBoundary =
      info.offset.x > offsetBoundary || info.offset.x < -offsetBoundary;
    const direction = info.offset.x > 0 ? 'right' : 'left';

    if (isOffBoundary) {
      setCards(cards.slice(0, -1));
      sendDirection(direction);
      if (hapticFeedback.impactOccurred.isAvailable()) {
        hapticFeedback.impactOccurred('light');
      }
    } else {
      animate(x, 0, { type: 'spring', stiffness: 1000, damping: 30 });
    }
  };

  const onPan = (info: PanInfo) => {
    if (
      Math.abs(info.delta.x) > Math.abs(info.delta.y) ||
      Math.abs(info.offset.x) > 40
    )
      x.set(info.offset.x);
  };

  // const leftOpacity = useTransform(drivenRotation, [-5, 0, 5], [0, 0, 0.3]);
  // const rightOpacity = useTransform(drivenRotation, [-5, 0, 5], [0.7, 0, 0]);

  const iconRightOpacity = useTransform(drivenRotation, [-5, 0, 5], [1, 0, 0]);
  const iconLeftOpacity = useTransform(drivenRotation, [-5, 0, 5], [0, 0, 1]);

  return (
    <motion.div
      className={`touch-none bg-transparent rounded-lg relative h-full w-full text-primary origin-bottom shadow-card select-none active:cursor-grab`}
      style={{
        x,
        rotate: drivenRotation
      }}
      onPan={(_, info) => onPan(info)}
      onPanEnd={(_, info) => handlePanEnd(info)}
    >
      {drivenRotation && (
        <CardDecision
          rightOpacity={iconRightOpacity}
          leftOpacity={iconLeftOpacity}
        />
      )}
      {children}
    </motion.div>
  );
};
