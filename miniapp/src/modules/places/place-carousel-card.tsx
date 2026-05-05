import { Icons } from '@/assets/icons/icons';
import { Tag } from '@/components/ui/tag';
import { getPriceCount } from '@/shared/util/price.util';
import { getTime } from '@/shared/util/time.util';

interface CarouselCardProps {
  src: string;
  distance?: number;
  price?: number;
}

export const PlaceCarouselCard = ({
  src,
  price,
  distance
}: CarouselCardProps) => {
  return (
    <div className="w-[94%] mx-auto select-none">
      <div className="aspect-[19/14] relative overflow-hidden rounded-[25px]">
        <img
          src={src}
          alt=""
          className="h-full w-full pointer-events-none object-cover"
        />
        <div className="absolute text-secondary-foreground bottom-2 left-2 flex gap-2">
          {price && (
            <Tag
              className="bg-black/70"
              size="sm"
              icon={
                <>
                  {getPriceCount(price).map((_x, index) => (
                    <Icons.ruble key={`${index}_ruble_icon`} />
                  ))}
                </>
              }
            />
          )}
          {distance && (
            <Tag
              className="bg-black/70"
              size="sm"
              icon={<Icons.walk className="h-[16px] w-[16px]" />}
              text={getTime(distance)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
