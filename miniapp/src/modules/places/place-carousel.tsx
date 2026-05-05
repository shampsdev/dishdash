import { Icons } from '@/assets/icons/icons';
import { Carousel } from '@/components/ui/carousel/carousel';
import { PlaceCarouselCard } from '@/modules/places/place-carousel-card';
import { Card } from '@/modules/swipes/interfaces/card.interface';
import { Tag } from '@/shared/interfaces/tag.interface';

interface PlaceCarouselProps {
  place: Card;
  price?: number;
  distance?: number;
  onClick?: () => void;
}

export const PlaceCarousel = ({
  place,
  onClick,
  price,
  distance
}: PlaceCarouselProps) => {
  const getPlaceCategories = (tags: Tag[]) => {
    return tags.length > 0
      ? tags
          .slice(0, 3)
          .flatMap((x) => x.name)
          .join(' · ')
      : 'Без тегов';
  };

  return (
    <div className="pt-4">
      <div className="w-[92%] mx-auto">
        <div className="line-clamp-1">
          <p className="text-secondary-foreground text-[13px]">
            {getPlaceCategories(place.tags ?? [])}
          </p>
        </div>
        <div onClick={onClick} className="flex justify-between items-center">
          <h1 className="text-xl font-medium">{place.title}</h1>
          <Icons.arrowRight className="h-[20px] w-[20px] text-secondary-foreground" />
        </div>
      </div>
      <Carousel className="pt-4 pb-2 mx-[4%]" gutter={160}>
        {place.images.map((x, index) => (
          <PlaceCarouselCard
            key={`${place.id}_image_${index}`}
            src={x}
            {...(index === 0 && {
              price: price,
              distance: distance
            })}
          />
        ))}
      </Carousel>
    </div>
  );
};
