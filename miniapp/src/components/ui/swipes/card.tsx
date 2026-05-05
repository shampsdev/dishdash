import { Card as CardInterface } from '@/modules/swipes/interfaces/card.interface';
import {
  motion,
  PanInfo,
  useMotionValue,
  useSpring,
  useTransform
} from 'framer-motion';
import StoryViewer from '../stories/story-viewer';
import { Icons } from '@/assets/icons/icons';
import { hapticFeedback, openLink } from '@telegram-apps/sdk-react';
import { Tag as TagInterface } from '@/shared/interfaces/tag.interface';
import { Tag } from '../tag';
import { Avatar } from '../avatar';
import { User } from '@/shared/interfaces/user.interface';
import { getPriceCount } from '@/shared/util/price.util';

export interface CardComponentProps {
  card: CardInterface;
  time?: string;
  likes?: User[];
  saved?: boolean;
  onSaved?: () => void;
}

export const Card = ({
  card,
  time,
  likes,
  saved,
  onSaved
}: CardComponentProps) => {
  const expandedRaw = useMotionValue(0);
  const expanded = useSpring(expandedRaw, {
    stiffness: 300,
    damping: 35
  });

  const drawerHeight = useTransform(expanded, [0, 1], ['40%', '60%']);

  const gradient = useTransform(
    expanded,
    [0, 1],
    [
      'linear-gradient(to top, black 20%, transparent 50%)',
      'linear-gradient(to top, black 50%, transparent 70%)'
    ]
  );

  const bottomGradient = useTransform(
    expanded,
    [0, 1],
    [
      'linear-gradient(to top, black 30%, transparent 100%)',
      'linear-gradient(to top, black 0%, transparent 0%)'
    ]
  );

  const handleDrag = (_: any, info: PanInfo) => {
    if (
      Math.abs(info.delta.y) > Math.abs(info.delta.x) &&
      Math.abs(info.offset.y) < 50
    ) {
      if (info.delta.y < 0 && Math.abs(info.offset.x) < 20) {
        expandedRaw.set(1);
      } else {
        expandedRaw.set(0);
      }
    }
  };

  const getCardTags = (tags: TagInterface[]) => {
    return tags.length > 0
      ? tags
          .slice(0, 3)
          .flatMap((x) => x.name)
          .join(' · ')
      : '';
  };

  const followPlaceURL = () => {
    const url =
      card.url !== null && card.url !== ''
        ? card.url
        : `https://yandex.ru/maps/?rtext=${card.location.lat}%2C${card.location.lon}`;
    openLink(url);
  };

  const getRandomPosition = () => {
    const randomX = Math.random() * 70;
    const randomY = Math.random() * 30 - 15;

    const offsetX = Math.random() * 10 - 5;
    const offsetY = Math.random() * 5 - 2.5;

    return {
      x: randomX + offsetX,
      y: randomY + offsetY
    };
  };

  const onChange = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
  };

  return (
    <div className="relative h-full overflow-hidden rounded-3xl">
      <StoryViewer
        onNext={onChange}
        onPrev={onChange}
        loop
        className="absolute w-full h-[90%] z-0"
        stories={card.images.map((x) => ({
          url: x,
          type: 'image',
          duration: 3000
        }))}
        progressBarSettings={{
          padding: 0,
          progressBarPosition: 'top'
        }}
      />
      <motion.div style={{ bottom: drawerHeight }} className="absolute z-30">
        {likes?.map((x, index) => {
          const { x: randomX, y: randomY } = getRandomPosition();

          return (
            <motion.div
              className="absolute bottom-0 left-0"
              key={`${x.telegram}_avatar`}
              initial={{ opacity: 0, y: 100, x: -20 }}
              animate={{
                opacity: 1,
                y: randomY,
                x: randomX
              }}
              transition={{
                opacity: { duration: 2, delay: index * 2 },
                y: { duration: 5, ease: 'easeOut', delay: index * 2 },
                x: { duration: 5, ease: 'easeOut', delay: index * 2 }
              }}
            >
              <Avatar src={x.avatar} />
            </motion.div>
          );
        })}
      </motion.div>
      <motion.div
        className="absolute left-0 h-[100%] w-full pointer-events-none"
        style={{
          background: gradient
        }}
        transition={{
          duration: 2
        }}
      />
      <motion.div
        className="absolute flex flex-col z-10 w-full"
        style={{ height: drawerHeight, bottom: 0 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDrag={handleDrag}
      >
        <div className="p-4 h-fit w-full">
          {card.title && (
            <div className="flex mb-1 mt-5 items-center justify-between">
              <h2 className="text-[25px] font-medium">{card.title}</h2>
              <div
                onClick={onSaved}
                className="bg-white/20 active:scale-90 transition-transform touch-auto cursor-pointer backdrop-blur-md rounded-full p-2 w-[33px] h-[33px] flex items-center justify-center z-30"
              >
                <Icons.saved
                  className={
                    !saved ? 'text-white/70' : 'text-accent-foreground'
                  }
                />
              </div>
            </div>
          )}
          <div className="line-clamp-1 pb-5">
            <p className="text-secondary-foreground text-[15px] leading-none">
              {getCardTags(card.tags ?? [])}
            </p>
          </div>
          <div className="flex gap-2">
            <Tag
              className="bg-white/20"
              icon={
                <>
                  {getPriceCount(card.priceAvg).map((_x, index) => (
                    <Icons.ruble key={`${index}_ruble_icon`} />
                  ))}
                </>
              }
            />
            {time && (
              <Tag
                className="bg-white/20 text-white/70"
                icon={<Icons.walk className="h-[16px] w-[16px]" />}
                text={time}
              />
            )}
          </div>
        </div>
        <div className="relative text-[15px] h-full px-4">
          {card.description && <p>{card.description}</p>}
          <div
            onClick={followPlaceURL}
            className="flex items-center gap-2 mt-4"
          >
            <Icons.marker />
            <p className="underline">Гражданская ул., 13-15</p>
          </div>
        </div>
        <motion.div
          className="absolute bottom-0 h-20 left-0 w-full pointer-events-none"
          style={{
            background: bottomGradient
          }}
          transition={{
            duration: 2
          }}
        />
      </motion.div>
    </div>
  );
};
