import { ResultItem } from '@/modules/swipes/interfaces/results.interface';
import { Avatar } from '@/components/ui/avatar';
import { PlaceCarousel } from '@/modules/places/place-carousel';

interface ResultCardProps extends ResultItem {
  onClick?: () => void;
  distance?: number;
}

export const ResultCard = ({
  card,
  likes,
  distance,
  onClick
}: ResultCardProps) => {
  return (
    <div className="flex flex-col">
      <PlaceCarousel
        distance={distance}
        price={card.priceAvg}
        place={card}
        onClick={onClick}
      />
      <div className="h-12 flex justify-between items-center w-[92%] mx-auto gap-2">
        <div className="flex gap-1">
          {likes.flatMap((like) => (
            <Avatar
              key={`avatar_${like.telegram}`}
              style={{ outline: 0, height: '30px', width: '30px' }}
              src={like.avatar}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
